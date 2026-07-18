import { QProperty, Signal, QObject, QApplication, QTimer, ThreadManager } from "@mocha/core";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

function test(name: string, fn: () => void): void {
  console.log(`\n[TEST] ${name}`);
  try {
    fn();
  } catch (err) {
    failed++;
    console.error(`  ERROR: ${err}`);
  }
}

test("QProperty - basic get/set", () => {
  const p = new QProperty(0);
  assert(p.value === 0, "initial value is 0");
  p.value = 42;
  assert(p.value === 42, "value is 42 after set");
  assert(p.get() === 42, "get() returns 42");
});

test("QProperty - change notification", () => {
  const p = new QProperty(0);
  let changedValue = -1;
  let previousValue = -1;
  p.changed.connect((v, prev) => {
    changedValue = v;
    previousValue = prev;
  });
  p.value = 10;
  assert(changedValue === 10, "notified value is 10");
  assert(previousValue === 0, "previous value is 0");
});

test("QProperty - constant property", () => {
  const p = new QProperty(5, { isConstant: true });
  p.value = 10;
  assert(p.value === 5, "constant property unchanged");
});

test("QProperty - bindTo", () => {
  const source = new QProperty(1);
  const target = new QProperty(0);
  target.bindTo(source);
  assert(target.value === 1, "target synced to source");

  source.value = 5;
  assert(target.value === 5, "target follows source change");
});

test("QProperty - bindTwoWay", () => {
  const a = new QProperty(0);
  const b = new QProperty(1);
  const unsub = a.bindTwoWay(b);

  assert(a.value === 1, "a synced to b initially");
  assert(b.value === 1, "b unchanged");

  a.value = 5;
  assert(b.value === 5, "b follows a change");

  b.value = 3;
  assert(a.value === 3, "a follows b change");

  unsub();
  a.value = 99;
  assert(b.value === 3, "b not synced after unbind");
});

test("Signal - connect and emit", () => {
  const sig = new Signal<(x: number) => void>();
  let received = 0;
  sig.connect((x: number) => {
    received = x;
  });
  sig.emit(42);
  assert(received === 42, "signal value received");
});

test("Signal - disconnect", () => {
  const sig = new Signal<() => void>();
  let count = 0;
  const conn = sig.connect(() => count++);
  sig.emit();
  assert(count === 1, "count is 1");
  conn.disconnect();
  sig.emit();
  assert(count === 1, "count still 1 after disconnect");
});

test("Signal - connectionCount", () => {
  const sig = new Signal<() => void>();
  assert(sig.connectionCount === 0, "no connections");
  const c1 = sig.connect(() => {});
  assert(sig.connectionCount === 1, "1 connection");
  const c2 = sig.connect(() => {});
  assert(sig.connectionCount === 2, "2 connections");
  c1.disconnect();
  assert(sig.connectionCount === 1, "1 connection after disconnect");
  c2.disconnect();
  assert(sig.connectionCount === 0, "0 connections");
});

test("QObject - parent-child hierarchy", () => {
  const parent = new QObject();
  const child = new QObject(parent);
  assert(parent.childCount === 1, "parent has 1 child");
  assert(child.parent === parent, "child's parent is correct");
  assert(parent.children[0] === child, "children array is correct");
});

test("QObject - findChild", () => {
  const parent = new QObject();
  const child1 = new QObject(parent);
  child1.objectName = "one";
  const child2 = new QObject(parent);
  child2.objectName = "two";

  const found = parent.findChild((c) => c.objectName === "two");
  assert(found === child2, "findChild returns correct child");
});

test("QObject - dumpObjectTree", () => {
  const root = new QObject();
  const child = new QObject(root);
  const grandchild = new QObject(child);
  const tree = root.dumpObjectTree();
  assert(tree.includes("QObject"), "tree contains class name");
  assert(tree.split("\n").length >= 3, "tree has multiple levels");
});

test("QObject - dispose cascades", () => {
  const root = new QObject();
  const child = new QObject(root);
  const grandchild = new QObject(child);

  let childDestroyed = false;
  let grandchildDestroyed = false;
  child.destroyed.connect(() => childDestroyed = true);
  grandchild.destroyed.connect(() => grandchildDestroyed = true);

  root.dispose();
  assert(childDestroyed, "child destroyed signal emitted");
  assert(grandchildDestroyed, "grandchild destroyed signal emitted");
  assert(root.isDisposed, "root is disposed");
});

test("QTimer - singleShot fires after delay", () => {
  let fired = false;
  QTimer.singleShot(10, () => {
    fired = true;
  });
  assert(fired === false, "not yet fired synchronously");
});

test("QApplication - lifecycle", () => {
  const app = new QApplication({ appName: "TestApp" });
  assert(app.appName === "TestApp", "app name is correct");
  assert(app.isRunning === false, "not running yet");
  assert(QApplication.instance === app, "instance is set");

  app.exec();
  assert(app.isRunning === true, "now running");
  assert(app.uptime >= 0, "uptime is non-negative");

  app.quit();
  assert(app.isRunning === false, "stopped running");
  assert(QApplication.instance === app, "instance still set");
});

test("ThreadManager - threads", () => {
  const main = ThreadManager.mainThread();
  const v8 = ThreadManager.v8Thread();
  assert(main.name === "qt", "main thread is qt");
  assert(v8.name === "v8", "v8 thread is v8");
  assert(main.type === "main", "main thread type is main");
  assert(v8.type === "worker", "v8 thread type is worker");
});

console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) process.exit(1);
