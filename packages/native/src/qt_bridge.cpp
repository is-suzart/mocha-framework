#include <QString>
#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQmlPropertyMap>
#include <QObject>
#include <QTimer>
#include <QThread>
#include <QVariant>
#include <QMetaObject>
#include <QMetaProperty>
#include <QDebug>

#include <QMap>
#include <QHash>
#include <QMutex>
#include <QMutexLocker>
#include <QColor>
#include <functional>
#include <cstdio>

// ── MochaPropertyMap: TS ↔ QML proxy via QQmlPropertyMap ──
//
// QQmlPropertyMap exposes dynamic properties to QML with automatic
// change notification.  Calling insert(key, value) emits
// valueChanged(key), which QML's binding engine tracks natively —
// no comma-operator tricks needed.

class MochaPropertyMap : public QQmlPropertyMap {
    Q_OBJECT
    Q_PROPERTY(int bridgeSeq READ seq NOTIFY seqChanged)

    QStringList _pendingCalls;
    int _seq = 0;

public:
    int proxyId = 0;

    MochaPropertyMap(QObject* parent = nullptr) : QQmlPropertyMap(this, parent) {}

    int seq() const { return _seq; }

    Q_INVOKABLE void setValue(QString name, QString value) {
        insert(name, QVariant(value));
        _seq++;
        fprintf(stderr, "[C++ MochaPropertyMap] setValue('%s', '%s'), _seq=%d\n",
            name.toUtf8().constData(), value.toUtf8().constData(), _seq);
        emit seqChanged();
    }

    Q_INVOKABLE void setInt(QString name, int value) {
        insert(name, QVariant(value));
        _seq++;
        fprintf(stderr, "[C++ MochaPropertyMap] setInt('%s', %d), _seq=%d\n",
            name.toUtf8().constData(), value, _seq);
        emit seqChanged();
    }

    Q_INVOKABLE void setBool(QString name, bool value) {
        insert(name, QVariant(value));
        _seq++;
        fprintf(stderr, "[C++ MochaPropertyMap] setBool('%s', %d), _seq=%d\n",
            name.toUtf8().constData(), value ? 1 : 0, _seq);
        emit seqChanged();
    }

    Q_INVOKABLE QVariant getValue(QString name) const {
        return value(name);
    }

    Q_INVOKABLE QVariant get(QString name) const {
        return value(name);
    }

    Q_INVOKABLE void bridgeCall(QString method) {
        _pendingCalls.append(method);
        _seq++;
        fprintf(stderr, "[C++ MochaPropertyMap] bridgeCall('%s'), _seq=%d, pending=%d\n",
            method.toUtf8().constData(), _seq, _pendingCalls.size());
        emit seqChanged();
    }

    bool hasPendingCalls() const {
        return !_pendingCalls.isEmpty();
    }

    QString drainOneCall() {
        if (_pendingCalls.isEmpty()) return QString();
        return _pendingCalls.takeFirst();
    }

signals:
    void seqChanged();
};

static void mochaMessageHandler(QtMsgType type, const QMessageLogContext& ctx, const QString& msg) {
    fprintf(stderr, "[QT %s] %s\n",
        type == QtDebugMsg ? "DEBUG" :
        type == QtWarningMsg ? "WARN" :
        type == QtCriticalMsg ? "CRIT" :
        type == QtFatalMsg ? "FATAL" : "INFO",
        msg.toUtf8().constData());
    if (type == QtFatalMsg) abort();
}

extern "C" {

// QApplication

void* qt_app_create(int /*argc*/, char** /*argv*/) {
    qputenv("QT_QML_DEBUG", "1");
    qputenv("QML_DEBUGGER_PORT", "3768");
    qInstallMessageHandler(mochaMessageHandler);
    fprintf(stderr, "[MOCHA DEBUG] Creating QGuiApplication...\n");
    static int dummy_argc = 1;
    static char dummy_argv0[] = "mocha-native";
    static char* dummy_argv[] = { dummy_argv0, nullptr };
    auto* app = new QGuiApplication(dummy_argc, dummy_argv);
    fprintf(stderr, "[MOCHA DEBUG] QGuiApplication created: %p, platform: %s\n", (void*)app, app->platformName().toUtf8().constData());
    return app;
}

void qt_app_destroy(void* app) {
    delete static_cast<QGuiApplication*>(app);
}

// QML Engine

void* qml_engine_create() {
    fprintf(stderr, "[MOCHA DEBUG] Creating QQmlApplicationEngine...\n");
    auto* e = new QQmlApplicationEngine();
    fprintf(stderr, "[MOCHA DEBUG] QQmlApplicationEngine created: %p\n", (void*)e);
    return e;
}

void qml_engine_destroy(void* engine) {
    delete static_cast<QQmlApplicationEngine*>(engine);
}

void qml_engine_load_data(void* engine, const char* qml_data, const char* base_path, const char* import_path) {
    auto* e = static_cast<QQmlApplicationEngine*>(engine);
    fprintf(stderr, "[MOCHA DEBUG] Loading QML data (%zu bytes)\n", strlen(qml_data));
    
    // Add MochaDS import path if provided
    if (import_path && import_path[0] != '\0') {
        fprintf(stderr, "[MOCHA DEBUG] Adding import path: %s\n", import_path);
        e->addImportPath(QString::fromUtf8(import_path));
    }
    
    QUrl baseUrl = QUrl::fromLocalFile(QString::fromUtf8(base_path));
    e->loadData(QByteArray(qml_data), baseUrl);
    fprintf(stderr, "[MOCHA DEBUG] QML loadData completed\n");
}

void* qml_engine_root_objects(void* engine) {
    auto* e = static_cast<QQmlApplicationEngine*>(engine);
    auto roots = e->rootObjects();
    fprintf(stderr, "[MOCHA DEBUG] rootObjects count: %d\n", roots.size());
    if (roots.isEmpty()) {
        fprintf(stderr, "[MOCHA DEBUG] No root objects - QML errors?\n");
        return nullptr;
    }
    // Return the first root object - caller must manage via qt_object_addref
    QObject* root = roots.first();
    QQmlEngine::setObjectOwnership(root, QQmlEngine::CppOwnership);
    fprintf(stderr, "[MOCHA DEBUG] Root object: %p (%s)\n", (void*)root, root->metaObject()->className());
    return root;
}

// QObject property access

void qt_object_addref(void* /*obj*/) {
    // Qt objects are managed by the QML engine or parent - no-op
}

const char* qt_object_get_property(void* obj, const char* name) {
    auto* o = static_cast<QObject*>(obj);
    QVariant val = o->property(name);
    static thread_local QByteArray result;
    result = val.toString().toUtf8();
    return result.constData();
}

void qt_object_set_property(void* obj, const char* name, const char* value) {
    auto* o = static_cast<QObject*>(obj);
    o->setProperty(name, QVariant(QString::fromUtf8(value)));
}

int qt_object_get_int_property(void* obj, const char* name) {
    auto* o = static_cast<QObject*>(obj);
    return o->property(name).toInt();
}

void qt_object_set_int_property(void* obj, const char* name, int value) {
    auto* o = static_cast<QObject*>(obj);
    o->setProperty(name, QVariant(value));
}

double qt_object_get_double_property(void* obj, const char* name) {
    auto* o = static_cast<QObject*>(obj);
    return o->property(name).toDouble();
}

void qt_object_set_double_property(void* obj, const char* name, double value) {
    auto* o = static_cast<QObject*>(obj);
    o->setProperty(name, QVariant(value));
}

int qt_object_get_bool_property(void* obj, const char* name) {
    auto* o = static_cast<QObject*>(obj);
    return o->property(name).toBool() ? 1 : 0;
}

void qt_object_set_bool_property(void* obj, const char* name, int value) {
    auto* o = static_cast<QObject*>(obj);
    o->setProperty(name, QVariant(value != 0));
}

// Event loop

void qt_app_process_events() {
    QCoreApplication::processEvents();
}

int qt_app_exec(void* app) {
    fprintf(stderr, "[MOCHA DEBUG] Entering Qt event loop (exec)...\n");
    auto ret = static_cast<QGuiApplication*>(app)->exec();
    fprintf(stderr, "[MOCHA DEBUG] Qt event loop exited with code: %d\n", ret);
    return ret;
}

void qt_app_quit(void* app) {
    static_cast<QGuiApplication*>(app)->quit();
}

// MochaPropertyMap

void* mocha_object_create(int proxyId) {
    auto* obj = new MochaPropertyMap();
    obj->proxyId = proxyId;
    QQmlEngine::setObjectOwnership(obj, QQmlEngine::CppOwnership);
    return obj;
}

void mocha_object_destroy(void* obj) {
    delete static_cast<MochaPropertyMap*>(obj);
}

void mocha_object_set_value(void* obj, const char* name, const char* value) {
    static_cast<MochaPropertyMap*>(obj)->setValue(
        QString::fromUtf8(name), QString::fromUtf8(value));
}

void mocha_object_set_int(void* obj, const char* name, int value) {
    static_cast<MochaPropertyMap*>(obj)->setInt(QString::fromUtf8(name), value);
}

void mocha_object_set_bool(void* obj, const char* name, int value) {
    static_cast<MochaPropertyMap*>(obj)->setBool(QString::fromUtf8(name), value != 0);
}

const char* mocha_object_get_value(void* obj, const char* name) {
    auto* mo = static_cast<MochaPropertyMap*>(obj);
    static thread_local QByteArray result;
    result = mo->getValue(QString::fromUtf8(name)).toString().toUtf8();
    return result.constData();
}

int mocha_object_has_pending_calls(void* obj) {
    return static_cast<MochaPropertyMap*>(obj)->hasPendingCalls() ? 1 : 0;
}

int mocha_object_drain_pending_calls(void* obj, char* buf, int max) {
    auto* mo = static_cast<MochaPropertyMap*>(obj);
    QString call = mo->drainOneCall();
    if (call.isEmpty()) return 0;
    QByteArray utf8 = call.toUtf8();
    int len = qMin(utf8.size(), max - 1);
    memcpy(buf, utf8.constData(), len);
    buf[len] = '\0';
    return len;
}

void qml_engine_set_context_property(void* engine, const char* name, void* obj) {
    auto* e = static_cast<QQmlApplicationEngine*>(engine);
    auto* qobj = static_cast<QObject*>(obj);
    e->rootContext()->setContextProperty(QString::fromUtf8(name), qobj);
}

void* qml_find_child_by_name(void* parent, const char* name) {
    auto* obj = static_cast<QObject*>(parent);
    auto* child = obj->findChild<QObject*>(
        QString::fromUtf8(name), Qt::FindChildrenRecursively);
    if (child) {
        QQmlEngine::setObjectOwnership(child, QQmlEngine::CppOwnership);
    }
    return child;
}

// ── QML Native Tree Inspector ──

static QMutex g_objMutex;
static int g_nextObjId = 1;
static QHash<int, QObject*> g_idToObj;
static QHash<QObject*, int> g_objToId;

static int registerQmlObj(QObject* obj) {
    if (!obj) return 0;
    QMutexLocker lock(&g_objMutex);
    auto it = g_objToId.find(obj);
    if (it != g_objToId.end()) return it.value();
    int id = g_nextObjId++;
    g_idToObj[id] = obj;
    g_objToId[obj] = id;
    return id;
}

static void unregisterQmlObj(QObject* obj) {
    if (!obj) return;
    QMutexLocker lock(&g_objMutex);
    auto it = g_objToId.find(obj);
    if (it != g_objToId.end()) {
        g_idToObj.remove(it.value());
        g_objToId.erase(it);
    }
}

static void collectAllQmlObjects(QObject* root, QList<QObject*>& out) {
    if (!root) return;
    out.append(root);
    const auto children = root->children();
    for (QObject* child : children) {
        collectAllQmlObjects(child, out);
    }
}

void native_qml_register_app_objects(void* enginePtr) {
    auto* e = static_cast<QQmlApplicationEngine*>(enginePtr);
    if (!e) return;

    QMutexLocker lock(&g_objMutex);
    const auto roots = e->rootObjects();
    for (QObject* root : roots) {
        QList<QObject*> all;
        collectAllQmlObjects(root, all);
        for (QObject* obj : all) {
            registerQmlObj(obj);
        }
    }
}

int native_qml_list_root_objects(int* ids, int max) {
    QMutexLocker lock(&g_objMutex);
    int n = qMin(g_idToObj.size(), max);
    int i = 0;
    for (auto it = g_idToObj.begin(); it != g_idToObj.end() && i < n; ++it, ++i) {
        ids[i] = it.key();
    }
    return i; // count
}

int native_qml_list_children(int objId, int* ids, int max) {
    QMutexLocker lock(&g_objMutex);
    QObject* obj = g_idToObj.value(objId);
    if (!obj) return 0;

    const auto children = obj->children();
    int n = qMin(children.size(), max);
    for (int i = 0; i < n; i++) {
        ids[i] = registerQmlObj(children[i]);
    }
    return n;
}

const char* native_qml_get_property(int objId, const char* name) {
    QMutexLocker lock(&g_objMutex);
    QObject* obj = g_idToObj.value(objId);
    if (!obj) return "";

    QVariant val = obj->property(name);
    static thread_local QByteArray result;
    result = val.toString().toUtf8();
    return result.constData();
}

const char* native_qml_get_type_name(int objId) {
    QMutexLocker lock(&g_objMutex);
    QObject* obj = g_idToObj.value(objId);
    if (!obj) return "";
    return obj->metaObject()->className();
}

const char* native_qml_get_object_name(int objId) {
    QMutexLocker lock(&g_objMutex);
    QObject* obj = g_idToObj.value(objId);
    if (!obj) return "";
    static thread_local QByteArray result;
    result = obj->objectName().toUtf8();
    return result.constData();
}

void native_qml_set_property(int objId, const char* name, const char* value) {
    QMutexLocker lock(&g_objMutex);
    QObject* obj = g_idToObj.value(objId);
    if (!obj) return;

    QByteArray propName(name);
    QVariant current = obj->property(propName);
    QVariant newVal;

    if (!current.isValid() || current.type() == QVariant::String) {
        newVal = QVariant(QString::fromUtf8(value));
    } else if (current.type() == QVariant::Int) {
        bool ok;
        int v = QString::fromUtf8(value).toInt(&ok);
        if (ok) newVal = QVariant(v); else newVal = QVariant(QString::fromUtf8(value));
    } else if (current.type() == QVariant::Double) {
        bool ok;
        double v = QString::fromUtf8(value).toDouble(&ok);
        if (ok) newVal = QVariant(v); else newVal = QVariant(QString::fromUtf8(value));
    } else if (current.type() == QVariant::Bool) {
        QString sv = QString::fromUtf8(value).toLower();
        newVal = QVariant(sv == "true" || sv == "1");
    } else if (current.type() == QVariant::Color) {
        newVal = QVariant(QColor(QString::fromUtf8(value)));
    } else {
        newVal = QVariant(QString::fromUtf8(value));
    }

    obj->setProperty(propName, newVal);
}

void native_qml_get_all_properties(int objId, char* buf, int max) {
    QMutexLocker lock(&g_objMutex);
    QObject* obj = g_idToObj.value(objId);
    if (!obj) { buf[0] = '\0'; return; }

    const QMetaObject* meta = obj->metaObject();
    QByteArray result = QByteArray("[");

    for (int i = meta->propertyOffset(); i < meta->propertyCount(); i++) {
        QMetaProperty prop = meta->property(i);
        if (!prop.isReadable()) continue;
        if (result.size() > 1) result.append(',');
        QVariant val = prop.read(obj);

        QByteArray entry;
        entry.append("{\"n\":\"");
        entry.append(prop.name());
        entry.append("\",\"t\":\"");
        entry.append(val.typeName());
        entry.append("\",\"v\":\"");
        QByteArray escaped = val.toString().toUtf8();
        escaped.replace('\\', "\\\\");
        escaped.replace('"', "\\\"");
        entry.append(escaped);
        entry.append("\",\"r\":");
        entry.append(prop.isReadable() ? "true" : "false");
        entry.append(",\"w\":");
        entry.append(prop.isWritable() ? "true" : "false");
        entry.append('}');
        result.append(entry);
    }
    result.append(']');

    int len = qMin(result.size(), max - 1);
    memcpy(buf, result.constData(), len);
    buf[len] = '\0';
}

} // extern "C"

// Include moc-generated code for MochaPropertyMap
#include "qt_bridge.moc"
