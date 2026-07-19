#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QObject>
#include <QTimer>
#include <QThread>
#include <QVariant>
#include <QString>
#include <QMetaObject>
#include <QMetaProperty>
#include <QDebug>

#include <QMap>
#include <functional>
#include <cstdio>

// ── MochaDynamicObject: TS ↔ QML proxy ──

class MochaDynamicObject : public QObject {
    Q_OBJECT
    Q_PROPERTY(int bridgeSeq READ seq NOTIFY seqChanged)

    QMap<QString, QVariant> _values;
    QStringList _pendingCalls;
    int _seq = 0;

public:
    int proxyId = 0;

    MochaDynamicObject(QObject* parent = nullptr) : QObject(parent) {}

    int seq() const { return _seq; }

    Q_INVOKABLE void setValue(QString name, QString value) {
        _values[name] = QVariant(value);
        _seq++; emit seqChanged();
    }

    Q_INVOKABLE void setInt(QString name, int value) {
        _values[name] = QVariant(value);
        _seq++; emit seqChanged();
    }

    Q_INVOKABLE void setBool(QString name, bool value) {
        _values[name] = QVariant(value);
        _seq++; emit seqChanged();
    }

    Q_INVOKABLE QVariant getValue(QString name) const {
        return _values.value(name);
    }

    Q_INVOKABLE QVariant get(QString name) const {
        return _values.value(name);
    }

    Q_INVOKABLE void bridgeCall(QString method) {
        _pendingCalls.append(method);
        _seq++; emit seqChanged();
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

// MochaDynamicObject

void* mocha_object_create(int proxyId) {
    auto* obj = new MochaDynamicObject();
    obj->proxyId = proxyId;
    QQmlEngine::setObjectOwnership(obj, QQmlEngine::CppOwnership);
    return obj;
}

void mocha_object_destroy(void* obj) {
    delete static_cast<MochaDynamicObject*>(obj);
}

void mocha_object_set_value(void* obj, const char* name, const char* value) {
    static_cast<MochaDynamicObject*>(obj)->setValue(
        QString::fromUtf8(name), QString::fromUtf8(value));
}

void mocha_object_set_int(void* obj, const char* name, int value) {
    static_cast<MochaDynamicObject*>(obj)->setInt(QString::fromUtf8(name), value);
}

void mocha_object_set_bool(void* obj, const char* name, int value) {
    static_cast<MochaDynamicObject*>(obj)->setBool(QString::fromUtf8(name), value != 0);
}

const char* mocha_object_get_value(void* obj, const char* name) {
    auto* mo = static_cast<MochaDynamicObject*>(obj);
    static thread_local QByteArray result;
    result = mo->getValue(QString::fromUtf8(name)).toString().toUtf8();
    return result.constData();
}

int mocha_object_has_pending_calls(void* obj) {
    return static_cast<MochaDynamicObject*>(obj)->hasPendingCalls() ? 1 : 0;
}

int mocha_object_drain_pending_calls(void* obj, char* buf, int max) {
    auto* mo = static_cast<MochaDynamicObject*>(obj);
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

} // extern "C"

// Include moc-generated code for MochaDynamicObject
#include "qt_bridge.moc"
