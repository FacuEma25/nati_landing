// Navegación responsive. No modifica ninguna fotografía ni logo.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
toggle?.addEventListener('click', () => {
  const opened = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(opened));
  toggle.setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}));
// TODO: reemplazar el enlace de contacto por el WhatsApp o agenda oficial de Nati.
// Se evita inventar números, URLs o un sistema de turnos.
const contactButton = document.getElementById('contact-button');
contactButton?.addEventListener('click', e => {
  if (contactButton.href.includes('CONTACTO_PENDIENTE')) {
    e.preventDefault();
    alert('Falta configurar el enlace oficial de reservas de Nati.');
  }
});




/* ==========================================
   TESTIMONIAL CAROUSEL
   ========================================== */

(() => {
  const carousel = document.querySelector(
    ".testimonial-carousel"
  );

  if (!carousel) return;

  const viewport = carousel.querySelector(
    ".testimonial-viewport"
  );
  const track = carousel.querySelector(
    ".testimonial-track"
  );
  const cards = Array.from(
    track.querySelectorAll(".testimonial-card")
  );

  const prev = carousel.querySelector(".testimonial-prev");
  const next = carousel.querySelector(".testimonial-next");
  const dotsContainer = carousel.querySelector(".testimonial-dots");

  if (!cards.length) return;

  let currentIndex = 0;
  let startX = null;

  function getVisibleCount() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 991) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();

    currentIndex = Math.min(
      Math.max(currentIndex, 0),
      maxIndex
    );

    const gap = parseFloat(
      getComputedStyle(track).gap
    ) || 0;

    const cardWidth = cards[0].getBoundingClientRect().width;

    track.style.transform =
      `translate3d(-${currentIndex * (cardWidth + gap)}px, 0, 0)`;

    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === maxIndex;

    dotsContainer.innerHTML = "";

    if (maxIndex === 0) {
      dotsContainer.hidden = true;
      return;
    }

    dotsContainer.hidden = false;

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute(
        "aria-label",
        `Ir a la posición ${i + 1}`
      );

      if (i === currentIndex) {
        dot.classList.add("is-active");
        dot.setAttribute("aria-current", "true");
      }

      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    }
  }

  prev.addEventListener("click", () => {
    currentIndex--;
    updateCarousel();
  });

  next.addEventListener("click", () => {
    currentIndex++;
    updateCarousel();
  });

  /* DESLIZAMIENTO TÁCTIL */

  viewport.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (event) => {
    if (startX === null) return;

    const endX = event.changedTouches[0].clientX;
    const distance = startX - endX;

    if (Math.abs(distance) > 45) {
      currentIndex += distance > 0 ? 1 : -1;
      updateCarousel();
    }

    startX = null;
  }, { passive: true });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
})();



/* ==========================================
   ANIMACIONES DE ENTRADA - AOS
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS === "undefined") {
    console.error("AOS no se cargó correctamente");
    return;
  }

  AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 50,
    delay: 0
  });
});
