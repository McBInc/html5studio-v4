/**
 * universal-init.js
 * Single entry-point bootstrap for HTML5STUDIO:
 * - Detect platform host/runtime
 * - Initialize platform SDK bridges when available
 * - Provide a consistent handshake/event bus for Unity/WebGL (or any engine)
 *
 * Drop into index.html <head> BEFORE Unity loader script.
 *
 * Global exposed:
 *   window.HTML5STUDIO = {
 *     version,
 *     env,                 // detected runtime capsule
 *     state,               // handshake lifecycle state
 *     on(event, fn), off, emit,
 *     ready(),             // resolves when init completes
 *     requestOrientation(orientation),
 *     requestFullscreen(enabled),
 *     requestAuth(opts),   // best-effort auth call if supported
 *     getContext(),        // returns env capsule
 *   }
 *
 * Unity integration pattern:
 *   - In a tiny JS plugin, poll window.HTML5STUDIO.ready().then(...)
 *   - Or listen for window event: "HTML5STUDIO_READY"
 */

(function universalInit() {
  "use strict";

  // ---- config ---------------------------------------------------------------
  const VERSION = "1.0.0";
  const DEFAULT_TIMEOUT_MS = 7000;

  // You can hard-set via <script>window.__HTML5STUDIO_PLATFORM_TARGET="DISCORD"</script>
  const FORCE_TARGET = safeString(window.__HTML5STUDIO_PLATFORM_TARGET);

  // Optional debug toggle via localStorage
  const DEBUG =
    safeBool(window.__HTML5STUDIO_DEBUG) ||
    safeBool(getLocalStorage("HTML5STUDIO_DEBUG"));

  const log = (...args) => DEBUG && console.log("[HTML5STUDIO]", ...args);
  const warn = (...args) => DEBUG && console.warn("[HTML5STUDIO]", ...args);

  // ---- tiny utilities -------------------------------------------------------
  function safeString(v) {
    return typeof v === "string" && v.trim() ? v.trim() : "";
  }
  function safeBool(v) {
    return v === true || v === "true" || v === 1 || v === "1";
  }
  function getLocalStorage(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  }
  function nowMs() {
    return Date.now();
  }
  function timeout(ms, label) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ok: false, label, timedOut: true }), ms)
    );
  }
  function once(fn) {
    let called = false;
    return function (...args) {
      if (called) return;
      called = true;
      return fn.apply(this, args);
    };
  }

  // ---- Event Bus ------------------------------------------------------------
  const listeners = new Map(); // event -> Set(fn)

  function on(event, fn) {
    if (!event || typeof fn !== "function") return;
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
  }
  function off(event, fn) {
    if (!event || !listeners.has(event)) return;
    if (!fn) {
      listeners.delete(event);
      return;
    }
    listeners.get(event).delete(fn);
  }
  function emit(event, payload) {
    try {
      // Custom DOM event
      window.dispatchEvent(
        new CustomEvent(event, { detail: payload, bubbles: false })
      );
    } catch {
      // ignored
    }

    const set = listeners.get(event);
    if (!set) return;
    for (const fn of set) {
      try {
        fn(payload);
      } catch (e) {
        warn("Listener error:", event, e);
      }
    }
  }

  // ---- Environment detection ------------------------------------------------
  function detectEnv() {
    const ua = navigator.userAgent || "";
    const href = safeString(location && location.href);
    const host = safeString(location && location.host);
    const ref = safeString(document && document.referrer);

    // Telegram: window.Telegram.WebApp is official surface
    const hasTelegram = !!(window.Telegram && window.Telegram.WebApp);

    // Discord Embedded App SDK:
    // - if loaded via unpkg script, typically global "DiscordSDK"
    // - if bundled, you might set window.discordSdk yourself
    const hasDiscordGlobals =
      !!window.DiscordSDK ||
      !!window.discordSdk ||
      !!(window.Discord && window.Discord.sdk);

    // Meta Instant Games often exposes FBInstant (in real runtime)
    const hasFBInstant = !!window.FBInstant;

    // TikTok / YouTube / LinkedIn: often iframe hosts with postMessage contracts.
    // We treat them as "EMBEDDED" unless explicit SDK globals exist.
    const isFramed = isInIframe();

    // Android/iOS (mobile web baseline)
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

    // Heuristics from URL/referrer/host
    const hintFromUrl = (() => {
      const h = `${href} ${ref} ${host}`.toLowerCase();
      if (h.includes("discord")) return "DISCORD";
      if (h.includes("tiktok")) return "TIKTOK";
      if (h.includes("youtube") || h.includes("ytimg") || h.includes("google"))
        return "YOUTUBE_PLAYABLES";
      if (h.includes("linkedin")) return "LINKEDIN_GAMES";
      if (h.includes("facebook") || h.includes("fb")) return "META";
      if (h.includes("telegram")) return "TELEGRAM";
      return "";
    })();

    let target = FORCE_TARGET || "";
    if (!target) {
      if (hasTelegram) target = "TELEGRAM";
      else if (hasDiscordGlobals) target = "DISCORD";
      else if (hasFBInstant) target = "META";
      else if (hintFromUrl) target = hintFromUrl;
      else if (isMobileUA) target = "MOBILE_WEB";
      else target = "WEB";
    }

    const env = {
      version: VERSION,
      detectedAt: new Date().toISOString(),
      target, // WEB | MOBILE_WEB | TELEGRAM | META | DISCORD | TIKTOK | YOUTUBE_PLAYABLES | LINKEDIN_GAMES
      isFramed,
      isMobileUA,
      userAgent: ua,
      url: href,
      host,
      referrer: ref,
      capabilities: {
        telegram: hasTelegram,
        discord: hasDiscordGlobals,
        meta: hasFBInstant,
        postMessage: typeof window.postMessage === "function" && isFramed,
        fullscreen: !!document.documentElement?.requestFullscreen,
        screenOrientation:
          !!(screen && screen.orientation && screen.orientation.lock),
      },
    };

    return env;
  }

  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch {
      return true; // cross-origin access throws, so yes
    }
  }

  // ---- SDK Bridges (best-effort, non-fatal) --------------------------------
  async function initTelegram(env) {
    if (!(window.Telegram && window.Telegram.WebApp)) return { ok: false };
    const WebApp = window.Telegram.WebApp;
    try {
      // Telegram recommends calling ready() and expand()
      if (typeof WebApp.ready === "function") WebApp.ready();
      if (typeof WebApp.expand === "function") WebApp.expand();

      // Make some safe adjustments
      // (do not assume theme params exist)
      const tg = {
        platform: safeString(WebApp.platform),
        version: safeString(WebApp.version),
        colorScheme: safeString(WebApp.colorScheme),
        initDataUnsafe: WebApp.initDataUnsafe || null,
      };

      log("Telegram initialized", tg);
      emit("HTML5STUDIO_TELEGRAM_READY", { telegram: tg });
      return { ok: true, telegram: tg };
    } catch (e) {
      warn("Telegram init failed", e);
      return { ok: false, error: String(e) };
    }
  }

  async function initDiscord(env) {
    // Support both global DiscordSDK (unpkg) and user-provided window.discordSdk
    let sdk = null;

    try {
      if (window.discordSdk) sdk = window.discordSdk;
      else if (window.DiscordSDK) {
        // If using global build, user must provide clientId somewhere.
        // We will try window.__DISCORD_CLIENT_ID first.
        const clientId = safeString(window.__DISCORD_CLIENT_ID);
        if (!clientId) {
          return {
            ok: false,
            error:
              "DiscordSDK present but missing window.__DISCORD_CLIENT_ID. Provide it before universal-init.js runs.",
          };
        }
        sdk = new window.DiscordSDK(clientId);
        window.discordSdk = sdk; // cache
      } else if (window.Discord && window.Discord.sdk) {
        sdk = window.Discord.sdk;
        window.discordSdk = sdk;
      }

      if (!sdk) return { ok: false };

      // handshake: instanceId indicates embedded environment; some SDKs set it after init
      // Many setups require await sdk.ready(); or sdk.connect(); depending on version.
      // We'll probe gently.
      if (typeof sdk.ready === "function") {
        await promiseWithTimeout(sdk.ready(), DEFAULT_TIMEOUT_MS, "discord.ready");
      } else if (typeof sdk.connect === "function") {
        await promiseWithTimeout(
          sdk.connect(),
          DEFAULT_TIMEOUT_MS,
          "discord.connect"
        );
      }

      const discordCapsule = {
        hasInstanceId: !!sdk.instanceId,
        instanceId: safeString(sdk.instanceId),
        platform: "discord",
      };

      log("Discord initialized", discordCapsule);
      emit("HTML5STUDIO_DISCORD_READY", { discord: discordCapsule });

      return { ok: true, discord: discordCapsule, sdk };
    } catch (e) {
      warn("Discord init failed", e);
      return { ok: false, error: String(e) };
    }
  }

  async function initMeta(env) {
    if (!window.FBInstant) return { ok: false };
    try {
      // FBInstant.initializeAsync() is required in many flows.
      // We won’t hard-require it (some wrappers run it elsewhere).
      const fb = window.FBInstant;
      if (typeof fb.initializeAsync === "function") {
        await promiseWithTimeout(
          fb.initializeAsync(),
          DEFAULT_TIMEOUT_MS,
          "meta.initializeAsync"
        );
      }

      const metaCapsule = {
        platform: "meta",
        locale: safeString(fb.getLocale && fb.getLocale()),
        platformInfo: safeString(fb.getPlatform && fb.getPlatform()),
      };

      log("Meta initialized", metaCapsule);
      emit("HTML5STUDIO_META_READY", { meta: metaCapsule });
      return { ok: true, meta: metaCapsule };
    } catch (e) {
      warn("Meta init failed", e);
      return { ok: false, error: String(e) };
    }
  }

  // Generic embedded host bridge via postMessage (TikTok/YT/LinkedIn or unknown iframe)
  function initPostMessageBridge(env) {
    if (!env.isFramed || typeof window.postMessage !== "function") return null;

    const BRIDGE_CHANNEL = "HTML5STUDIO_BRIDGE";
    const pending = new Map(); // id -> {resolve, reject, t}

    function post(type, payload) {
      const id = `${type}:${Math.random().toString(16).slice(2)}:${Date.now()}`;
      const msg = {
        channel: BRIDGE_CHANNEL,
        id,
        type,
        payload: payload || null,
        ts: Date.now(),
      };

      // Try parent first
      try {
        window.parent.postMessage(msg, "*");
      } catch (e) {
        warn("postMessage to parent failed", e);
      }

      return new Promise((resolve, reject) => {
        const t = setTimeout(() => {
          pending.delete(id);
          resolve({ ok: false, timeout: true, id, type });
        }, 1500);
        pending.set(id, { resolve, reject, t });
      });
    }

    function onMessage(ev) {
      const data = ev && ev.data;
      if (!data || data.channel !== BRIDGE_CHANNEL) return;

      if (data.replyTo && pending.has(data.replyTo)) {
        const entry = pending.get(data.replyTo);
        clearTimeout(entry.t);
        pending.delete(data.replyTo);
        entry.resolve({ ok: true, reply: data.payload, replyTo: data.replyTo });
        return;
      }

      // Host -> app events
      if (data.type) {
        emit(`HTML5STUDIO_HOST_${data.type}`, data.payload);
      }
    }

    window.addEventListener("message", onMessage);

    return {
      channel: BRIDGE_CHANNEL,
      post,
      destroy() {
        window.removeEventListener("message", onMessage);
        for (const [, entry] of pending) clearTimeout(entry.t);
        pending.clear();
      },
    };
  }

  // ---- Request helpers ------------------------------------------------------
  async function requestOrientation(orientation, env, bridges) {
    const o = safeString(orientation).toLowerCase();
    if (!o) return { ok: false, error: "Missing orientation" };

    // Discord: setOrientation exists on sdk.commands in some versions
    if (bridges.discordSdk?.commands?.setOrientation) {
      try {
        await promiseWithTimeout(
          bridges.discordSdk.commands.setOrientation(o),
          1500,
          "discord.setOrientation"
        );
        return { ok: true, via: "discord" };
      } catch (e) {
        return { ok: false, via: "discord", error: String(e) };
      }
    }

    // Screen Orientation API (mobile web / browser)
    if (env.capabilities.screenOrientation) {
      try {
        await promiseWithTimeout(
          screen.orientation.lock(o),
          1500,
          "screen.orientation.lock"
        );
        return { ok: true, via: "screen.orientation" };
      } catch (e) {
        return { ok: false, via: "screen.orientation", error: String(e) };
      }
    }

    // Host postMessage bridge fallback
    if (bridges.hostBridge) {
      return bridges.hostBridge.post("SET_ORIENTATION", { orientation: o });
    }

    return { ok: false, error: "Orientation control not supported" };
  }

  async function requestFullscreen(enabled, env, bridges) {
    const en = !!enabled;

    // Telegram has expand(), but fullscreen is browser-driven.
    // Discord/YT/TikTok/etc. generally disallow/limit fullscreen without user gesture.
    if (en && document.documentElement?.requestFullscreen) {
      try {
        await promiseWithTimeout(
          document.documentElement.requestFullscreen(),
          1500,
          "requestFullscreen"
        );
        return { ok: true, via: "browser" };
      } catch (e) {
        return { ok: false, via: "browser", error: String(e) };
      }
    }

    if (!en && document.exitFullscreen) {
      try {
        await promiseWithTimeout(document.exitFullscreen(), 1500, "exitFullscreen");
        return { ok: true, via: "browser" };
      } catch (e) {
        return { ok: false, via: "browser", error: String(e) };
      }
    }

    // Host bridge fallback
    if (bridges.hostBridge) {
      return bridges.hostBridge.post("SET_FULLSCREEN", { enabled: en });
    }

    return { ok: false, error: "Fullscreen not supported" };
  }

  async function requestAuth(opts, env, bridges) {
    // Discord authorize hook (best-effort)
    if (bridges.discordSdk?.commands?.authorize) {
      const payload = opts && typeof opts === "object" ? opts : {};
      try {
        const res = await promiseWithTimeout(
          bridges.discordSdk.commands.authorize(payload),
          DEFAULT_TIMEOUT_MS,
          "discord.authorize"
        );
        return { ok: true, via: "discord", result: res };
      } catch (e) {
        return { ok: false, via: "discord", error: String(e) };
      }
    }

    // Meta login could be done via FBInstant.player.getSignedPlayerInfoAsync, etc.
    // Not standardized here; prefer host bridge
    if (bridges.hostBridge) {
      return bridges.hostBridge.post("AUTH", { opts: opts || null });
    }

    return { ok: false, error: "Auth not supported for this target" };
  }

  function promiseWithTimeout(promise, ms, label) {
    return Promise.race([Promise.resolve(promise), timeout(ms, label)]).then(
      (res) => {
        // If timeout() won, it returns {ok:false,timedOut:true}
        if (res && res.timedOut) throw new Error(`Timed out: ${label}`);
        return res;
      }
    );
  }

  // ---- Init lifecycle -------------------------------------------------------
  const state = {
    status: "booting", // booting | initializing | ready | error
    startedAtMs: nowMs(),
    readyAtMs: null,
    errors: [],
  };

  const env = detectEnv();
  log("Detected env:", env);

  // Bridges container
  const bridges = {
    hostBridge: null,
    discordSdk: null,
    telegram: null,
    meta: null,
  };

  // Create host bridge early (for embedded hosts)
  bridges.hostBridge = initPostMessageBridge(env);

  // Promise that resolves when init completes
  let readyResolve;
  let readyReject;
  const readyPromise = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  const finalizeReady = once((ok, extra) => {
    state.status = ok ? "ready" : "error";
    state.readyAtMs = nowMs();

    const detail = {
      ok,
      env,
      state: { ...state },
      bridges: summarizeBridges(),
      extra: extra || null,
    };

    if (ok) {
      emit("HTML5STUDIO_READY", detail);
      try {
        window.dispatchEvent(new Event("HTML5STUDIO_READY"));
      } catch {
        // ignore
      }
      readyResolve(detail);
    } else {
      emit("HTML5STUDIO_ERROR", detail);
      readyReject(detail);
    }
  });

  function summarizeBridges() {
    return {
      hostBridge: !!bridges.hostBridge,
      discord: !!bridges.discordSdk,
      telegram: !!bridges.telegram,
      meta: !!bridges.meta,
    };
  }

  async function initAll() {
    state.status = "initializing";

    // Initialize target SDKs best-effort in parallel, but only for likely targets
    const tasks = [];

    if (env.capabilities.telegram || env.target === "TELEGRAM") {
      tasks.push(
        initTelegram(env).then((r) => {
          if (r.ok) bridges.telegram = r.telegram;
          else if (r.error) state.errors.push({ sdk: "telegram", error: r.error });
          return r;
        })
      );
    }

    if (env.capabilities.discord || env.target === "DISCORD") {
      tasks.push(
        initDiscord(env).then((r) => {
          if (r.ok) bridges.discordSdk = r.sdk || window.discordSdk || null;
          else if (r.error) state.errors.push({ sdk: "discord", error: r.error });
          return r;
        })
      );
    }

    if (env.capabilities.meta || env.target === "META") {
      tasks.push(
        initMeta(env).then((r) => {
          if (r.ok) bridges.meta = r.meta;
          else if (r.error) state.errors.push({ sdk: "meta", error: r.error });
          return r;
        })
      );
    }

    // Always do: announce to host bridge (if present)
    if (bridges.hostBridge) {
      tasks.push(
        bridges.hostBridge
          .post("HELLO", {
            version: VERSION,
            target: env.target,
            url: env.url,
            ts: Date.now(),
          })
          .catch((e) => {
            state.errors.push({ sdk: "hostBridge", error: String(e) });
            return { ok: false, error: String(e) };
          })
      );
    }

    // Wait for all tasks; none are required to succeed to proceed,
    // because this file must not block plain WEB usage.
    try {
      await Promise.allSettled(tasks);

      // Put a compact capsule somewhere Unity can read
      window.__HTML5STUDIO_ENV__ = {
        ...env,
        init: {
          ok: true,
          errors: state.errors.slice(0, 10),
          bridges: summarizeBridges(),
          tookMs: state.readyAtMs
            ? state.readyAtMs - state.startedAtMs
            : nowMs() - state.startedAtMs,
        },
      };

      finalizeReady(true);
    } catch (e) {
      state.errors.push({ sdk: "initAll", error: String(e) });
      finalizeReady(false, { error: String(e) });
    }
  }

  // ---- Public API -----------------------------------------------------------
  const api = {
    version: VERSION,
    env,
    state,
    on,
    off,
    emit,
    ready: () => readyPromise,
    requestOrientation: (orientation) =>
      requestOrientation(orientation, env, bridges),
    requestFullscreen: (enabled) => requestFullscreen(enabled, env, bridges),
    requestAuth: (opts) => requestAuth(opts, env, bridges),
    getContext: () => ({ env, state: { ...state }, bridges: summarizeBridges() }),
  };

  // Expose immediately (even before init completes)
  window.HTML5STUDIO = api;

  
  // Start ASAP but after DOM is minimally available
  // (we don't need DOMContentLoaded to init SDKs)
  initAll();

  // Optional: if Unity or something wants to "ping" readiness
  // it can dispatch HTML5STUDIO_PING and we reply with HTML5STUDIO_PONG
  window.addEventListener("HTML5STUDIO_PING", () => {
    emit("HTML5STUDIO_PONG", api.getContext());
  });
})();