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



/* ==========================================
   TESTIMONIAL CAROUSEL
   ========================================== */

(() => {
  const carousel = document.querySelector(".testimonial-carousel");

  if (!carousel) return;

  const viewport = carousel.querySelector(".testimonial-viewport");
  const track = carousel.querySelector(".testimonial-track");
  const prev = carousel.querySelector(".testimonial-prev");
  const next = carousel.querySelector(".testimonial-next");
  const dotsContainer = carousel.querySelector(".testimonial-dots");

  if (!viewport || !track || !prev || !next || !dotsContainer) return;

  const cards = Array.from(
    track.querySelectorAll(".testimonial-card")
  );

  if (!cards.length) return;

  let currentIndex = 0;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let pointerId = null;

  /* CANTIDAD DE TARJETAS VISIBLES */

  function getVisibleCount() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;

    if (!cardWidth) return 1;

    return Math.max(
      1,
      Math.min(
        cards.length,
        Math.floor(
          (viewport.clientWidth + gap + 1) / (cardWidth + gap)
        )
      )
    );
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  /* ACTUALIZACIÓN DEL CARRUSEL */

  function updateCarousel() {
    const maxIndex = getMaxIndex();

    currentIndex = Math.min(
      Math.max(currentIndex, 0),
      maxIndex
    );

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = cards[0].getBoundingClientRect().width;

    track.style.transform =
      `translate3d(-${currentIndex * (cardWidth + gap)}px, 0, 0)`;

    prev.disabled = maxIndex === 0;
    next.disabled = maxIndex === 0;

    /* INDICADORES */

    dotsContainer.innerHTML = "";
    dotsContainer.hidden = maxIndex === 0;

    if (maxIndex === 0) return;

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

  /* NAVEGACIÓN CIRCULAR */

  function goNext() {
    const maxIndex = getMaxIndex();

    if (maxIndex === 0) return;

    currentIndex =
      currentIndex >= maxIndex ? 0 : currentIndex + 1;

    updateCarousel();
  }

  function goPrev() {
    const maxIndex = getMaxIndex();

    if (maxIndex === 0) return;

    currentIndex =
      currentIndex <= 0 ? maxIndex : currentIndex - 1;

    updateCarousel();
  }

  prev.addEventListener("click", goPrev);
  next.addEventListener("click", goNext);

  /* ARRASTRE CON MOUSE Y DEDO */

  viewport.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || getMaxIndex() === 0) return;

    if (event.pointerType === "mouse" && event.button !== 0) return;

    if (event.target.closest("a, button")) return;

    startX = event.clientX;
    startY = event.clientY;

    isDragging = true;
    pointerId = event.pointerId;

    viewport.setPointerCapture(pointerId);
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointerup", (event) => {
    if (!isDragging || event.pointerId !== pointerId) return;

    const distanceX = startX - event.clientX;
    const distanceY = startY - event.clientY;

    if (
      Math.abs(distanceX) > 45 &&
      Math.abs(distanceX) > Math.abs(distanceY)
    ) {
      if (distanceX > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    stopDragging();
  });

  function stopDragging() {
    isDragging = false;

    if (
      pointerId !== null &&
      viewport.hasPointerCapture(pointerId)
    ) {
      viewport.releasePointerCapture(pointerId);
    }

    pointerId = null;
    viewport.classList.remove("is-dragging");
  }

  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("lostpointercapture", stopDragging);

  viewport.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  /* ACTUALIZACIÓN RESPONSIVE */

  window.addEventListener("resize", updateCarousel);

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(updateCarousel);
    observer.observe(viewport);
  }

  updateCarousel();
})();


