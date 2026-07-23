// mocha_polyfills.js — essential polyfills for the Mocha Framework on QuickJS/Hermes
// Loaded before the application bundle to provide Node.js-compatible APIs

(function () {
  "use strict";

  // ── queueMicrotask ──
  if (typeof globalThis.queueMicrotask !== "function") {
    const tasks = [];
    globalThis.queueMicrotask = function (fn) {
      tasks.push(fn);
    };
    globalThis.__mochaFlushMicrotasks = function () {
      while (tasks.length > 0) {
        const fn = tasks.shift();
        try { fn(); } catch (e) { console.error("[queueMicrotask]", e); }
      }
    };
  }

  // ── console ──
  if (typeof globalThis.console === "undefined") {
    globalThis.console = {};
  }
  if (typeof globalThis.console.log !== "function") {
    globalThis.console.log = function (...args) {
      const msg = args.map(function (a) {
        if (typeof a === "string") return a;
        try { return JSON.stringify(a); } catch (_) { return String(a); }
      }).join(" ");
      globalThis.__mocha_print(msg + "\n");
    };
  }
  if (typeof globalThis.console.warn !== "function") {
    globalThis.console.warn = globalThis.console.log;
  }
  if (typeof globalThis.console.error !== "function") {
    globalThis.console.error = globalThis.console.log;
  }
  if (typeof globalThis.console.info !== "function") {
    globalThis.console.info = globalThis.console.log;
  }
  if (typeof globalThis.console.debug !== "function") {
    globalThis.console.debug = globalThis.console.log;
  }

  // ── setTimeout (via C++ QTimer bridge) ──
  if (typeof globalThis.setTimeout !== "function") {
    const timers = {};
    var nextTimerId = 1;

    globalThis.setTimeout = function (fn, delay) {
      var id = nextTimerId++;
      timers[id] = { fn: fn, delay: delay || 0, fireAt: Date.now() + (delay || 0) };
      return id;
    };

    globalThis.clearTimeout = function (id) {
      delete timers[id];
    };

    globalThis.__mochaDrainTimers = function () {
      var now = Date.now();
      var ids = Object.keys(timers);
      for (var i = 0; i < ids.length; i++) {
        var t = timers[ids[i]];
        if (t && now >= t.fireAt) {
          delete timers[ids[i]];
          try { t.fn(); } catch (e) { console.error("[setTimeout]", e); }
        }
      }
    };
  }

  // ── process ──
  if (typeof globalThis.process === "undefined") {
    globalThis.process = {
      env: {},
      cwd: function () { return globalThis.__mocha_cwd || "/"; },
      versions: {},
      platform: "linux",
      arch: "x64",
      argv: ["mocha"],
      on: function () {},
      once: function () {},
      emit: function () {},
      exit: function (code) { globalThis.__mocha_exit(code || 0); },
    };
  }

  // ── __mocha_print — C++ will register this as a native function ──
  if (typeof globalThis.__mocha_print !== "function") {
    globalThis.__mocha_print = function (msg) {
      // Fallback: print uses the native host function registered by C++
      // If not yet registered, store messages for later
      if (!globalThis.__mochaPrintBuf) globalThis.__mochaPrintBuf = [];
      globalThis.__mochaPrintBuf.push(msg);
    };
  }

  // ── global GC hint for QuickJS ──
  if (typeof globalThis.gc === "function") {
    // QuickJS provides gc() if compiled with CONFIG_GPROF
  }
})();
