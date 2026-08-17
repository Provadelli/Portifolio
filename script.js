(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------
     HEADER: blur + shrink on scroll, progress thread
  --------------------------------------------- */
  const header = document.getElementById("header");
  const progressFill = document.querySelector(".progress-thread__fill");

  function onScroll(){
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------
     MOBILE MENU
  --------------------------------------------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (burger && mobileMenu){
    burger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------------------------------------
     SCROLL REVEAL
  --------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal, .timeline__item");

  if ("IntersectionObserver" in window && !reduceMotion){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------
     CUSTOM CURSOR (desktop only, non-touch)
  --------------------------------------------- */
  const cursorDot = document.querySelector(".cursor-dot");
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (cursorDot && !isTouch && !reduceMotion){
    let cx = 0, cy = 0, tx = 0, ty = 0;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cursorDot.classList.add("is-active");
    });

    function raf(){
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursorDot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    }
    raf();

    document.querySelectorAll("a, button, .magnetic, [data-tilt]").forEach(el => {
      el.addEventListener("mouseenter", () => cursorDot.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursorDot.classList.remove("is-hover"));
    });
  }

  /* ---------------------------------------------
     MAGNETIC BUTTONS
  --------------------------------------------- */
  if (!isTouch && !reduceMotion){
    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.22}px, ${relY * 0.32}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------------------------------------
     PROJECT CARD TILT + GLOW FOLLOW
  --------------------------------------------- */
  if (!isTouch && !reduceMotion){
    document.querySelectorAll("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const rotateX = (0.5 - py) * 8;
        const rotateY = (px - 0.5) * 10;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty("--x", `${px * 100}%`);
        card.style.setProperty("--y", `${py * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }

  /* ---------------------------------------------
     HERO PORTRAIT PARALLAX
  --------------------------------------------- */
  const frame = document.getElementById("portraitFrame");
  if (frame && !isTouch && !reduceMotion){
    window.addEventListener("mousemove", (e) => {
      const relX = (e.clientX / window.innerWidth - 0.5) * 2;
      const relY = (e.clientY / window.innerHeight - 0.5) * 2;
      frame.style.transform = `translate(${relX * 8}px, ${relY * 8}px) rotate(${relX * 1.4}deg)`;
    });
  }

})();
