const { isArray: e } = Array,
  t = new Map(),
  s = (e) => {
    e.stopImmediatePropagation(), e.preventDefault();
  };
var n = Object.freeze({
  __proto__: null,
  activate: (e) => e.waitUntil(clients.claim()),
  fetch: (e) => {
    const { request: n } = e;
    "POST" === n.method &&
      n.url === `${location.href}?sabayon` &&
      (s(e),
      e.respondWith(
        n.json().then(async (e) => {
          const { promise: s, resolve: o } = Promise.withResolvers(),
            a = e.join(",");
          t.set(a, o);
          for (const t of await clients.matchAll()) t.postMessage(e);
          return s.then((e) => new Response(`[${e.join(",")}]`, n.headers));
        }),
      ));
  },
  install: () => skipWaiting(),
  message: (n) => {
    const { data: o } = n;
    if (e(o) && 4 === o.length) {
      const [e, a, i, r] = o,
        l = [e, a, i].join(",");
      t.has(l) && (s(n), t.get(l)(r), t.delete(l));
    }
  },
});
for (const e in n) addEventListener(e, n[e]);
