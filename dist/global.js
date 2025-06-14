(() => {
  window.Webflow || (window.Webflow = []);
  window.Webflow.push(() => {
    let u = document.getElementById('exit-intent');
    if (!(window.sessionStorage.getItem(`hasFiredPopup_${window.location}`) == 'true') && u) {
      let i = function (r) {
        s ||
          ((u.style.display = 'flex'),
          S(u, 250),
          dataLayer.push({ event: 'show_exit_intent', dlv_01: r }),
          (s = !0),
          window.sessionStorage.setItem(`hasFiredPopup_${window.location}`, 'true'));
      };
      (u.style.display = 'none'),
        (u.style.opacity = 0),
        document.addEventListener('mouseleave', (r) => {
          r.clientY < 0 && o > 8e3 && i('exit_page');
        });
      let t = 0.5,
        e = 5e3,
        o = 0,
        s = !1,
        m = setInterval(() => {
          (o += e), o >= t * 6e4 && !s && (i('time_on_page'), (s = !0), clearInterval(m));
        }, e);
    }
    let g = new Map([
        ['utm_source', ''],
        ['utm_medium', ''],
        ['utm_campaign', ''],
        ['utm_term', ''],
        ['utm_content', ''],
      ]),
      n = new URLSearchParams(window.location.search),
      l = {},
      a = {},
      p = (t) => {
        let e = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        };
        return new Intl.DateTimeFormat('en-US', e).format(t);
      };
    for (let [t, e] of g)
      if (n.has(t)) {
        let o = n.get(t);
        (l[t] = o), localStorage.getItem(`first_${t}`) || (a[`first_${t}`] = o);
      }
    if (n.has('gclid')) {
      let t = n.get('gclid');
      (l.gclid = t), localStorage.getItem('first_gclid') || (a.first_gclid = t);
    }
    localStorage.getItem('first_page_url') || (a.first_page_url = window.location.href);
    let c = ((t) => (t ? new URL(t).hostname : ''))(document.referrer),
      h = () =>
        n.has('utm_source')
          ? n.get('utm_source')
          : c
            ? ['google', 'bing', 'yahoo'].some((t) => c.includes(t))
              ? c.split('.')[1]
              : c
            : 'direct',
      I = () =>
        n.has('utm_medium')
          ? n.get('utm_medium')
          : n.has('gclid')
            ? 'cpc'
            : c
              ? ['google', 'bing', 'yahoo'].some((t) => c.includes(t))
                ? 'organic'
                : 'referral'
              : '',
      d = h(),
      _ = I();
    if (
      ((l.utm_source = d),
      (l.utm_medium = _),
      localStorage.getItem('first_utm_source') || (a.first_utm_source = d),
      localStorage.getItem('first_utm_medium') || (a.first_utm_medium = _),
      !localStorage.getItem('first_touch_timestamp'))
    ) {
      let t = new Date();
      a.first_touch_timestamp = p(t);
    }
    Object.entries(l).forEach(([t, e]) => {
      sessionStorage.setItem(t, e);
    }),
      Object.entries(a).forEach(([t, e]) => {
        localStorage.setItem(t, e);
      });
    let w = (t) => {
      g.forEach((m, i) => {
        let r = t.querySelector(`input[name=${i}]`);
        r && (r.value = sessionStorage.getItem(i) ?? '');
        let f = t.querySelector(`input[name=first_${i}]`);
        f && (f.value = localStorage.getItem(`first_${i}`) ?? '');
      });
      let e = t.querySelector('input[name=gclid]');
      e && (e.value = sessionStorage.getItem('gclid') ?? '');
      let o = t.querySelector('input[name=first_gclid]');
      o && (o.value = localStorage.getItem('first_gclid') ?? '');
      let s = t.querySelector('input[name=first_touch_timestamp]');
      s && (s.value = localStorage.getItem('first_touch_timestamp') ?? '');
    };
    (() => {
      document.querySelectorAll('form').forEach(w);
    })();
    function F(t) {
      let { top: e, bottom: o } = t.getBoundingClientRect();
      return o <= window.innerHeight && e >= 0;
    }
    function S(t, e) {
      y(t, 0, 1, e);
    }
    function y(t, e, o, s, m) {
      let i = e,
        r = ((o - e) * 50) / s,
        f = setInterval(() => {
          (i += r),
            ((r > 0 && i >= o) || (r < 0 && i <= o)) && (clearInterval(f), (i = o), m && m()),
            (t.style.opacity = i);
        }, 50);
    }
  });
})();
