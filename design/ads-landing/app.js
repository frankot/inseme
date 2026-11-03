// Behaviour for the prototype: header bars, mobile menu, call bar,
// contact-path tabs, FAQ accordion, reveal-on-scroll and a fake form submit.
document.documentElement.classList.add("js");

(() => {
  const body = document.body;
  const compact = document.querySelector(".header-compact");
  const hasHero = Boolean(document.querySelector(".hero"));
  const callbar = document.querySelector(".callbar");

  // Compact bar slides in past 70% of the viewport; call bar past 85%.
  const onScroll = () => {
    const y = window.scrollY;
    const h = window.innerHeight;
    if (compact && hasHero) compact.classList.toggle("is-shown", y > h * 0.7);
    if (callbar) callbar.classList.toggle("is-shown", y > h * 0.85);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Mobile menu: every burger toggles the same panel.
  const burgers = document.querySelectorAll(".burger");
  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    burgers.forEach((b) => b.setAttribute("aria-expanded", String(open)));
  };
  burgers.forEach((b) =>
    b.addEventListener("click", () => setMenu(!body.classList.contains("menu-open"))),
  );
  document.querySelectorAll(".menu-panel a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false)),
  );
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // Contact paths: two tabs, one panel each, plus the lead in the masthead.
  const tabs = [...document.querySelectorAll(".path")];
  const select = (id, focus) => {
    tabs.forEach((t) => {
      const on = t.dataset.path === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
      const foot = t.querySelector(".path__foot-label");
      if (foot) foot.textContent = on ? t.dataset.selected : t.dataset.choose;
    });
    document.querySelectorAll("[data-panel]").forEach((p) => {
      p.hidden = p.dataset.panel !== id;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.path));
    t.addEventListener("keydown", (e) => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      select(tabs[(i + step + tabs.length) % tabs.length].dataset.path, true);
    });
  });
  document.querySelectorAll("[data-goto-path]").forEach((a) =>
    a.addEventListener("click", () => select(a.dataset.gotoPath)),
  );
  if (tabs.length) select(tabs[0].dataset.path);

  // FAQ: one open at a time.
  const qs = [...document.querySelectorAll(".faq__q")];
  qs.forEach((q) =>
    q.addEventListener("click", () => {
      const open = q.getAttribute("aria-expanded") === "true";
      qs.forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.classList.remove("is-open");
        other.nextElementSibling.inert = true;
      });
      if (!open) {
        q.setAttribute("aria-expanded", "true");
        q.nextElementSibling.classList.add("is-open");
        q.nextElementSibling.inert = false;
      }
    }),
  );

  // Reveal on scroll, staggered by data-delay.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
        el.classList.add("is-in");
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Prototype only: the form shows a confirmation instead of sending.
  document.querySelectorAll("form[data-fake]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const ok = document.createElement("p");
      ok.className = "form__ok";
      ok.textContent =
        "Dziękujemy. Odezwiemy się w wybrany sposób, zwykle tego samego dnia. (Prototyp — nic nie zostało wysłane.)";
      form.replaceWith(ok);
    }),
  );
})();
