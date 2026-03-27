/**
 * ====================================================
 * ROTISERÍA LA CAMPESINA — SCRIPT.JS
 * Versión:    1.0
 * Descripción: JavaScript vanilla para la landing page
 *
 * FUNCIONALIDADES:
 *  1. Menú hamburguesa (mobile)
 *  2. Sombra dinámica en el header al hacer scroll
 *  3. Animaciones fade-in con IntersectionObserver
 *  4. Smooth scroll para links de ancla (#)
 *  5. Ocultar botón flotante WhatsApp cuando el CTA hero es visible
 *  6. Año dinámico en el footer
 * ====================================================
 */

'use strict';

/* ======================================================
   UTILIDAD: ejecutar código solo cuando el DOM esté listo
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ====================================================
     1. MENÚ HAMBURGUESA (MOBILE)
     ==================================================== */
  const navToggle = document.getElementById('navToggle');
  const navList   = document.getElementById('navList');

  if (navToggle && navList) {

    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar menú al hacer clic en cualquier link interno
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar menú al hacer clic fuera del nav
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        closeMenu();
      }
    });

    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    function closeMenu() {
      navList.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }


  /* ====================================================
     2. SOMBRA DINÁMICA EN EL HEADER
     ==================================================== */
  const header = document.getElementById('header');

  if (header) {
    const updateHeaderShadow = () => {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,.18)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)';
      }
    };

    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow(); // ejecutar al cargar por si ya está scrolleado
  }


  /* ====================================================
     3. ANIMACIONES FADE-IN CON IntersectionObserver
     ==================================================== */
  /**
   * Más eficiente que el evento scroll:
   * el navegador notifica cuando un elemento cruza el viewport,
   * en lugar de calcular posiciones en cada frame.
   */
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {

    // Agregar delay escalonado a los elementos dentro de grillas
    // (ej. las tarjetas aparecen una después de la otra)
    const grids = document.querySelectorAll('.cards-grid, .blog__grid, .recetas-grid, .historia__values');
    grids.forEach(grid => {
      grid.querySelectorAll('.fade-in').forEach((el, index) => {
        el.dataset.delay = String(index * 110); // 110ms entre cada elemento
      });
    });

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const delay = parseInt(entry.target.dataset.delay || '0', 10);

        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);

        // Dejar de observar una vez que ya se animó
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.10,            // Activar cuando el 10% del elemento entra
      rootMargin: '0px 0px -40px 0px' // 40px antes del borde inferior
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

  } else {
    // Fallback para navegadores sin soporte (IE, etc.)
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }


  /* ====================================================
     4. SMOOTH SCROLL PARA ANCLAS
     (Polyfill para Safari que no soporta scroll-behavior: smooth en JS)
     ==================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop    = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });


  /* ====================================================
     5. OCULTAR BOTÓN FLOTANTE WHATSAPP
     cuando el CTA principal del hero está visible
     (mejora UX: no hay dos botones WhatsApp visibles a la vez)
     ==================================================== */
  const heroWhatsappBtn = document.querySelector('.hero__actions .btn--whatsapp');
  const floatBtn        = document.querySelector('.whatsapp-float');

  if (heroWhatsappBtn && floatBtn && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // El CTA del hero es visible → ocultamos el flotante
          floatBtn.style.opacity       = '0';
          floatBtn.style.pointerEvents = 'none';
          floatBtn.style.transform     = 'scale(0.75)';
        } else {
          // El CTA del hero salió del viewport → mostramos el flotante
          floatBtn.style.opacity       = '1';
          floatBtn.style.pointerEvents = 'auto';
          floatBtn.style.transform     = '';
        }
      });
    }, { threshold: 0.5 });

    heroObserver.observe(heroWhatsappBtn);
  }


  /* ====================================================
     6. AÑO DINÁMICO EN EL FOOTER
     ==================================================== */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

}); // fin DOMContentLoaded
