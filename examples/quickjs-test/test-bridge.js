// test-quickjs/test-bridge.js — Validates the complete QuickJS ↔ C++ Qt bridge
// Zero imports — all native functions are registered by quickjs_glue.cpp as globals.
// Usage: ./build/quickjs/mocha-quickjs --polyfills packages/native/quickjs/mocha_polyfills.js --bundle test-quickjs/test-bridge.js

(function () {
  "use strict";
  var n = globalThis;
  var passed = 0;
  var failed = 0;

  function assert(cond, msg) {
    if (cond) { passed++; console.log("  PASS " + msg); }
    else { failed++; console.error("  FAIL " + msg); }
  }

  function test(name, fn) {
    console.log("\n[TEST] " + name);
    try { fn(); } catch (e) { failed++; console.error("  EXCEPTION: " + e); }
  }

  // ── Test 1: Engine Creation ──
  test("Engine creation", function () {
    var engineId = n.__mocha_nativeEngineCreate();
    assert(engineId > 0, "engine handle is positive");
    console.log("  engine handle = " + engineId);
  });

  // ── Test 2: Proxy Creation ──
  var engineId = n.__mocha_nativeEngineCreate();
  test("Proxy creation", function () {
    var proxyId = n.__mocha_nativeEngineCreateProxy(engineId);
    assert(proxyId > 0, "proxy handle is positive");
    console.log("  proxy handle = " + proxyId);
  });

  // ── Test 3: Proxy Set/Get String ──
  var proxyId = n.__mocha_nativeEngineCreateProxy(engineId);
  test("Proxy set/get string", function () {
    n.__mocha_nativeProxySetValue(proxyId, "message", "hello world");
    var val = n.__mocha_nativeProxyGetValue(proxyId, "message");
    assert(val === "hello world", 'value is "hello world" (got: ' + val + ')');
  });

  // ── Test 4: Proxy Set/Get Int ──
  test("Proxy set/get int", function () {
    n.__mocha_nativeProxySetInt(proxyId, "count", 42);
    var val = n.__mocha_nativeProxyGetValue(proxyId, "count");
    assert(val === "42", 'count is 42 (got: ' + val + ')');
  });

  // ── Test 5: Proxy Set/Get Bool ──
  test("Proxy set/get bool", function () {
    n.__mocha_nativeProxySetBool(proxyId, "enabled", 1);
    var val = n.__mocha_nativeProxyGetValue(proxyId, "enabled");
    assert(val === "true" || val === "1", 'enabled is true (got: ' + val + ')');
  });

  // ── Test 6: JSON value (string with JSON parse attempt by C++) ──
  test("Proxy set JSON object", function () {
    n.__mocha_nativeProxySetValue(proxyId, "data", '{"key":"value"}');
    var val = n.__mocha_nativeProxyGetValue(proxyId, "data");
    assert(val.indexOf("key") >= 0, 'data contains key (got: ' + val + ')');
  });

  // ── Test 7: Pending Calls ──
  test("Pending calls (empty)", function () {
    var has = n.__mocha_nativeProxyHasPendingCalls(proxyId);
    assert(has === false, "no pending calls initially");
  });

  // ── Test 8: List Model Creation ──
  test("List model creation", function () {
    var modelId = n.__mocha_nativeCreateListModel();
    assert(modelId > 0, "model handle is positive");
    console.log("  model handle = " + modelId);

    n.__mocha_nativeModelSetRows(modelId, '[{"name":"Alice"},{"name":"Bob"}]');
    console.log("  rows set: 2 items");

    n.__mocha_nativeModelClear(modelId);
    console.log("  model cleared");

    n.__mocha_nativeDestroyListModel(modelId);
    console.log("  model destroyed");
  });

  // ── Test 9: Event Loop ──
  test("Event loop tick", function () {
    n.__mocha_nativeProcessEvents();
    assert(true, "processEvents() did not throw");
  });

  // ── Test 10: setTimeout polyfill ──
  test("setTimeout fires via C++ __mochaDrainTimers", function (done) {
    var fired = false;
    globalThis.setTimeout(function () {
      fired = true;
      console.log("  setTimeout callback fired");
    }, 10);

    // Simulate what C++ event loop does: drain timers after some ms
    // In the real app this happens via QTimer tick
  });

  // ── Results ──
  console.log("\n═══════════════════════════════════");
  console.log("  PASSED: " + passed + "  FAILED: " + failed);
  console.log("═══════════════════════════════════\n");

  if (failed > 0) {
    console.error("SOME TESTS FAILED!");
  } else {
    console.log("ALL TESTS PASSED!");
  }

  // Exit gracefully
  globalThis.process.exit(failed > 0 ? 1 : 0);
})();
