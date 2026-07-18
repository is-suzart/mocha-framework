# Ponte Reativa TS ↔ QML

Bridge que expõe objetos TypeScript (`QObject` com `QProperty`) no contexto do QML engine,
com sincronização reativa bidirecional e suporte a `providedIn: "root"` para estado global.

---

## Pré-requisitos (já existem)

| Peça | Arquivo |
|---|---|
| `Signal<T>`, `QProperty<T>` | `core/src/qproperty.ts`, `signals.ts` |
| `effect()`, `ReactiveEffect` | `core/src/reactivity.ts` |
| `QComputedProperty<T>` | `core/src/qcomputed.ts` |
| `QmlInit`, `QmlDestroy` | `core/src/lifecycle.ts` |
| `Container`, `@Injectable` | `core/src/di.ts` |
| `runApp()` | `qml/src/run-app.ts` |
| C++ bridge (QApp, QQmlEngine, MochaDS) | `native/src/qt_bridge.cpp`, `lib.rs` |
| Router + Route + RouterLink | `ui/MochaDS/` |

---

## Arquitetura

```
Node.js (JS/TS)                          Qt (C++)                  QML (UI)
┌──────────────────────┐          ┌──────────────────────────┐      ┌──────────────┐
│  CounterState        │          │  MochaDynamicObject       │      │              │
│  ├─ count: QProperty │──sync──►│  ├─ count: QVariant       │◄─bind┤ Text {       │
│  ├─ increment()      │  effect  │  ├─ increment: callback   │      │  text:       │
│  └─ reset()          │          │  ├─ __seq: int (NOTIFY)   │      │  ctrl.count  │
│                      │          │  └─ get/set/__call        │      │ }            │
│  effect(() => {      │          └──────────┬───────────────┘      └──────────────┘
│    proxy.setInt()    │                     │
│  })                  │              setContextProperty("ctrl")
└──────────────────────┘                     │
                                         QQmlEngine
```

### Fluxo de dados

```
TS QProperty.value = 5
  └─ effect() detecta (activeEffect tracking)
      └─ nativeProxySetInt(proxyId, "count", 5)
          └─ C++: MochaDynamicObject::setInt("count", 5)
              ├─ _values["count"] = QVariant(5)
              ├─ _seq++
              └─ emit seqChanged()
                  └─ QML: bindings que dependem de ctrl.__seq reavaliam
                      └─ ctrl.get("count") retorna "5"
```

---

## Etapas de Implementação

### Etapa 1: C++ — MochaDynamicObject + Context Property

**Arquivo:** `packages/native/src/qt_bridge.cpp`

Nova classe QObject que atua como proxy entre TS e QML:

```cpp
class MochaDynamicObject : public QObject {
    Q_OBJECT
    Q_PROPERTY(int __seq READ seq NOTIFY seqChanged)

    QMap<QString, QVariant> _values;
    QMap<QString, std::function<void()>> _callbacks;
    int _seq = 0;

public:
    MochaDynamicObject(QObject* parent = nullptr) : QObject(parent) {}

    int seq() const { return _seq; }

    Q_INVOKABLE void setValue(const char* name, const char* value) {
        _values[QString::fromUtf8(name)] = QVariant(QString::fromUtf8(value));
        _seq++; emit seqChanged();
    }

    Q_INVOKABLE void setInt(const char* name, int value) {
        _values[QString::fromUtf8(name)] = QVariant(value);
        _seq++; emit seqChanged();
    }

    Q_INVOKABLE void setBool(const char* name, bool value) {
        _values[QString::fromUtf8(name)] = QVariant(value);
        _seq++; emit seqChanged();
    }

    Q_INVOKABLE QVariant getValue(const char* name) const {
        return _values.value(QString::fromUtf8(name));
    }

    Q_INVOKABLE void __call(const char* method) {
        auto it = _callbacks.find(QString::fromUtf8(method));
        if (it != _callbacks.end()) it.value()();
    }

    void registerCallback(const QString& name, std::function<void()> cb) {
        _callbacks[name] = cb;
    }

signals:
    void seqChanged();
};
```

Funções C a exportar (`extern "C"`):

```c
void* mocha_object_create();
void   mocha_object_destroy(void* obj);
void   mocha_object_set_value(void* obj, const char* name, const char* value);
void   mocha_object_set_int(void* obj, const char* name, int value);
void   mocha_object_set_bool(void* obj, const char* name, int value);
const char* mocha_object_get_value(void* obj, const char* name);
void   mocha_object_register_callback(void* obj, const char* name, void (*cb)(void*), void* ctx);
void   qml_engine_set_context_property(void* engine, const char* name, void* obj);
```

### Etapa 2: Rust — Bindings napi

**Arquivo:** `packages/native/src/lib.rs`

Novas funções napi:

```rust
#[napi]
pub fn native_engine_create_proxy(engine_id: u32) -> Result<u32>;
// Cria MochaDynamicObject, registra no STATE, retorna id

#[napi]
pub fn native_proxy_set_value(proxy_id: u32, name: String, value: String) -> Result<()>;

#[napi]
pub fn native_proxy_set_int(proxy_id: u32, name: String, value: i32) -> Result<()>;

#[napi]
pub fn native_proxy_set_bool(proxy_id: u32, name: String, value: bool) -> Result<()>;

#[napi]
pub fn native_proxy_get_value(proxy_id: u32, name: String) -> Result<String>;

#[napi]
pub fn native_proxy_register_method(proxy_id: u32, name: String) -> Result<()>;
// Registra que um método existe no proxy. QML chama via __call.

#[napi]
pub fn native_engine_set_context(engine_id: u32, name: String, proxy_id: u32) -> Result<()>;
```

### Etapa 3: JS — NativeApp novos métodos

**Arquivo:** `packages/native/index.js`

```js
createProxy() {
  this._proxyId = nativeEngineCreateProxy(this._engine);
  return this._proxyId;
}

proxySetValue(proxyId, name, value, type) {
  if (type === 'number' && Number.isInteger(value))
    nativeProxySetInt(proxyId, name, value);
  else if (type === 'boolean')
    nativeProxySetBool(proxyId, name, value);
  else
    nativeProxySetValue(proxyId, name, String(value));
}

proxyRegisterMethod(proxyId, name) {
  nativeProxyRegisterMethod(proxyId, name);
}

setContextProperty(name, proxyId) {
  nativeEngineSetContext(this._engine, name, proxyId);
}
```

**Arquivo:** `packages/native/index.d.ts` — adicionar tipos.

### Etapa 4: TS — @QMLComponent com providedIn

**Arquivo:** `packages/qml/src/qml-component.ts`

Estender `QMLComponentOptions`:

```ts
export interface QMLComponentOptions {
  qml: string;
  providedIn?: "root" | "view";  // NOVO
  autoBind?: boolean;
  hotReload?: boolean;
}
```

Armazenar no metadata:

```ts
const metadata: QMLComponentMetadata = {
  options,
  document,
  bindings,
  componentName,
  providedIn: options.providedIn || "view",
};
```

### Etapa 5: TS — runApp com proxy + sync

**Arquivo:** `packages/qml/src/run-app.ts`

Fluxo:

```
runApp(AppController)
  ├─ Instancia AppController principal
  ├─ Escaneia components com providedIn: "root"
  │   └─ Para cada:
  │       ├─ Cria MochaDynamicObject (proxy C++)
  │       ├─ Escaneia @qproperty fields
  │       │   └─ effect() sync: QProperty.changed → proxySetValue
  │       ├─ Escaneia métodos públicos
  │       │   └─ proxyRegisterMethod(name)
  │       ├─ setContextProperty(nomeDaClasse, proxyId)
  │       └─ Guarda ref pra vida do app
  ├─ generateQMLSource com transformer (ctrl.get / ctrl.__call)
  ├─ loadQML
  └─ exec()
```

Funções auxiliares:

```ts
function scanRootServices(): Array<{ cls: Function; instance: QObject; proxyId?: number }>
// Retorna todos componentes registrados com providedIn: "root"

function scanProperties(instance: QObject): Array<{ name: string; qp: QProperty }>
// Retorna todas @qproperty QProperty com metadata __qproperty_*

function scanMethods(instance: QObject): Array<{ name: string; fn: Function }>
// Retorna métodos públicos que não são QProperty nem Signal
```

### Etapa 6: TS — generateQMLSource transformer

**Arquivo:** `packages/qml/src/qml-component.ts`

Modificar `generateQMLSource` para transformar bindings:

```ts
// Antes (QML template):
Text { text: appState.count.value }
Button { onClicked: appState.increment() }

// Depois (QML gerado):
Text { text: appState.get("count") }
Button { onClicked: appState.__call("increment") }
```

Regras de transformação:

| Expressão template | Vira |
|---|---|
| `controller.count.value` | `ctrl.get("count")` |
| `controller.title` | `ctrl.get("title")` |
| `controller.increment()` | `ctrl.__call("increment")` |
| `appState.count.value` | `appState.get("count")` |
| `appState.increment()` | `appState.__call("increment")` |

### Etapa 7: TS — QML __bridge helper

Para cada root view, adicionar automaticamente:

```qml
Item {
    // Força dependência reativa no proxy C++
    readonly property int __bridge: appState.__seq

    // Agora bindings que usam appState.get() reavaliam quando seq muda
    Text { text: appState.get("count") }
}
```

### Etapa 8: Rebuild + Test

```bash
cd packages/native && npx napi build --platform --release
cd ../.. && npx tsc -b packages/shared packages/core packages/qml packages/kit packages/cli
```

Criar projeto de teste:

```ts
// shared/CounterState.qml.ts
@QMLComponent({ providedIn: "root" })
export class CounterState extends QObject {
  @qproperty count = new QProperty(0);
  increment() { this.count.value++; }
}
```

---

## Dependências Entre Etapas

```
1 (C++ proxy)        ← independente
2 (Rust bindings)    ← depende de 1
3 (JS NativeApp)     ← depende de 2
4 (providedIn)       ← independente
5 (runApp)           ← depende de 2, 3, 4
6 (generateQML)      ← depende de 2
7 (__bridge helper)  ← depende de 6
8 (teste)            ← depende de 5, 6, 7
```

---

## Comportamento por providedIn

| Valor | Instância | Quando morre | Acesso QML |
|---|---|---|---|
| `"root"` | singleton | app fecha | `nomeDaClasse.get("prop")` no contexto |
| `"view"` (default) | por rota | rota desativa | `ctrl.get("prop")` |
| sem qml template | — | — | só via TS, sem contexto QML |

---

## Teste de Verificação

```qml
Route {
  path: "/counter"
  view: Component {
    VStack {
      Text { text: "Count: " + counterState.get("count") }
      Button { text: "+1"; onClicked: counterState.__call("increment") }
      RouterLink { to: "/other"; text: "Go" }
    }
  }
}
Route {
  path: "/other"
  view: Component {
    Text { text: counterState.get("count") }  // mesmo valor!
    RouterLink { to: "/counter"; text: "Back" }
  }
}
```

Navegar `/counter → /other → /counter` — count **persiste**.
