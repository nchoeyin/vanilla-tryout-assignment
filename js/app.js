// ===== Sticky header (appears after first fold, hides on scroll back up) =====
(function () {
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero-section');
  if (!header || !hero) return;

  // Clone the existing header so the sticky version mirrors the original markup/styles.
  var sticky = header.cloneNode(true);
  sticky.classList.add('site-header--sticky');
  // Avoid duplicate IDs from the cloned subtree (e.g. #mobile-nav)
  sticky.querySelectorAll('[id]').forEach(function (el) {
    el.id = el.id + '--sticky';
  });
  var stickyMobileToggle = sticky.querySelector('.site-header__menu-toggle');
  var stickyMobileNav = sticky.querySelector('.mobile-nav');
  if (stickyMobileToggle && stickyMobileNav) {
    stickyMobileToggle.setAttribute('aria-controls', stickyMobileNav.id);
    stickyMobileToggle.addEventListener('click', function () {
      var isOpen = stickyMobileToggle.getAttribute('aria-expanded') === 'true';
      stickyMobileToggle.setAttribute('aria-expanded', String(!isOpen));
      stickyMobileNav.hidden = isOpen;
    });
  }
  var stickyProductsBtn = sticky.querySelector('.mobile-nav__link--button');
  var stickySubmenu = sticky.querySelector('.mobile-nav__submenu');
  if (stickyProductsBtn && stickySubmenu) {
    stickyProductsBtn.addEventListener('click', function () {
      var isOpen = stickyProductsBtn.getAttribute('aria-expanded') === 'true';
      stickyProductsBtn.setAttribute('aria-expanded', String(!isOpen));
      stickySubmenu.classList.toggle('mobile-nav__submenu--open', !isOpen);
    });
  }
  document.body.appendChild(sticky);

  // Show sticky header when the hero section is no longer intersecting the viewport.
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sticky.classList.remove('is-visible');
        } else {
          sticky.classList.add('is-visible');
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    observer.observe(hero);
  } else {
    // Fallback: scroll-based check
    window.addEventListener('scroll', function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      sticky.classList.toggle('is-visible', heroBottom <= 0);
    }, { passive: true });
  }
})();

// ===== Mobile nav toggle =====
const menuToggle = document.querySelector('.site-header__menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', function () {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
  });
}

// ===== Mobile products submenu =====
const mobileProductsBtn = document.querySelector('.mobile-nav__link--button');
const mobileSubmenu = document.querySelector('.mobile-nav__submenu');

if (mobileProductsBtn && mobileSubmenu) {
  mobileProductsBtn.addEventListener('click', function () {
    const isOpen = mobileProductsBtn.getAttribute('aria-expanded') === 'true';
    mobileProductsBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileSubmenu.classList.toggle('mobile-nav__submenu--open', !isOpen);
  });
}

// ===== Applications carousel (horizontal scroll) =====
(function () {
  var track = document.getElementById('applications-carousel-track');
  var prevBtn = document.querySelector('.applications-carousel__btn--prev');
  var nextBtn = document.querySelector('.applications-carousel__btn--next');
  if (!track || !prevBtn || !nextBtn) return;
  var scroller = track.closest('.applications-carousel');
  if (!scroller) return;

  function slideStep() {
    var slide = track.querySelector('.applications-carousel__slide');
    if (!slide) return 0;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  prevBtn.addEventListener('click', function () {
    scroller.scrollBy({ left: -slideStep(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function () {
    scroller.scrollBy({ left: slideStep(), behavior: 'smooth' });
  });
})();

// ===== Reusable hover zoom preview (fine pointer only) =====
(function () {
  var preview = document.getElementById('applications-zoom-preview');
  if (!preview) return;
  var zoomImg = preview.querySelector('.applications-zoom-preview__img');
  var frame = preview.querySelector('.applications-zoom-preview__frame');
  if (!zoomImg || !frame) return;

  var mqHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var TRANSPARENT_PIXEL =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  var raf = null;
  var leaveTimer = null;
  var hideTimer = null;
  var openToken = 0;

  function cancelScheduledHide() {
    if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
  }
  function cancelHideTimer() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  function setFocalFromPointer(zone, clientX, clientY) {
    var zr = zone.getBoundingClientRect();
    var nx = (clientX - zr.left) / zr.width;
    var ny = (clientY - zr.top) / zr.height;
    nx = Math.max(0, Math.min(1, nx));
    ny = Math.max(0, Math.min(1, ny));
    zoomImg.style.transformOrigin = nx * 100 + '% ' + ny * 100 + '%';
  }

  function positionPreviewNearPointer(clientX, clientY) {
    var fr = frame.getBoundingClientRect();
    var pw = fr.width || frame.offsetWidth || 280;
    var ph = fr.height || frame.offsetHeight || 200;
    var pad = 14;
    var px = clientX + 18;
    var py = clientY + 18;
    if (px + pw > window.innerWidth - pad) px = clientX - pw - 18;
    if (py + ph > window.innerHeight - pad) py = clientY - ph - 18;
    px = Math.max(pad, Math.min(px, window.innerWidth - pw - pad));
    py = Math.max(pad, Math.min(py, window.innerHeight - ph - pad));
    preview.style.left = px + 'px';
    preview.style.top = py + 'px';
  }

  function hidePreview() {
    cancelHideTimer();
    preview.classList.remove('applications-zoom-preview--visible');
    var snapshot = openToken;
    var delay = mqReduce.matches || !mqHover.matches ? 0 : 280;
    hideTimer = setTimeout(function () {
      hideTimer = null;
      if (snapshot !== openToken) return;
      preview.hidden = true;
      preview.setAttribute('hidden', '');
      zoomImg.src = TRANSPARENT_PIXEL;
    }, delay);
  }
  function scheduleHide() {
    cancelScheduledHide();
    leaveTimer = setTimeout(function () {
      leaveTimer = null;
      hidePreview();
    }, 45);
  }

  function bindZone(zone, sourceImg) {
    if (!zone || !sourceImg) return;

    zone.addEventListener('mouseenter', function (e) {
      cancelScheduledHide();
      cancelHideTimer();
      openToken++;
      if (!mqHover.matches || mqReduce.matches) return;

      var url = sourceImg.currentSrc || sourceImg.src;
      zoomImg.src = url;
      zoomImg.alt = '';
      setFocalFromPointer(zone, e.clientX, e.clientY);
      preview.removeAttribute('hidden');
      preview.hidden = false;
      requestAnimationFrame(function () {
        positionPreviewNearPointer(e.clientX, e.clientY);
        requestAnimationFrame(function () {
          positionPreviewNearPointer(e.clientX, e.clientY);
          preview.classList.add('applications-zoom-preview--visible');
        });
      });
    });

    zone.addEventListener('mousemove', function (e) {
      if (!mqHover.matches || mqReduce.matches) return;
      if (preview.hidden) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        raf = null;
        setFocalFromPointer(zone, e.clientX, e.clientY);
        positionPreviewNearPointer(e.clientX, e.clientY);
      });
    });

    zone.addEventListener('mouseleave', function () {
      if (!mqHover.matches) return;
      scheduleHide();
    });
  }

  // Applications cards
  document.querySelectorAll('.applications-card').forEach(function (card) {
    bindZone(
      card.querySelector('.applications-card__media-zone'),
      card.querySelector('.applications-card__media')
    );
  });

  // Hero image (and any other element opting in via [data-zoom-source])
  document.querySelectorAll('[data-zoom-source]').forEach(function (zone) {
    bindZone(zone, zone.querySelector('img'));
  });
})();

// ===== Testimonials carousel (horizontal scroll) =====
(function () {
  var scroller = document.getElementById('testimonials-scroller');
  var prevBtn = document.querySelector('.testimonials-carousel__btn--prev');
  var nextBtn = document.querySelector('.testimonials-carousel__btn--next');
  if (!scroller || !prevBtn || !nextBtn) return;
  var track = scroller.querySelector('.testimonials-section__track');
  if (!track) return;

  function slideStep() {
    var slide = track.querySelector('.testimonials-section__slide');
    if (!slide) return 0;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }

  prevBtn.addEventListener('click', function () {
    scroller.scrollBy({ left: -slideStep(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function () {
    scroller.scrollBy({ left: slideStep(), behavior: 'smooth' });
  });
})();

// ===== HDPE manufacturing process: pills (tabs) + mobile prev/next =====
(function () {
  var pills = Array.prototype.slice.call(document.querySelectorAll('.hdpe-process-pill'));
  var titleEl = document.querySelector('.hdpe-process-detail__title');
  if (!pills.length) return;

  var stepDetails = [
    {
      title: 'High-Grade Raw Material Selection',
      body: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.'
    },
    {
      title: 'Precision Extrusion Process',
      body: 'Twin-screw extruders melt and shape PE100 resin at controlled temperatures and pressures for consistent flow and homogenous output.'
    },
    {
      title: 'Controlled Cooling Stage',
      body: 'Multi-stage cooling baths gradually bring pipes to ambient temperature, locking in dimensional stability and mechanical strength.'
    },
    {
      title: 'Vacuum Sizing for Dimensional Accuracy',
      body: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.'
    },
    {
      title: 'In-line Quality Control',
      body: 'Ultrasonic gauges and laser micrometers verify wall thickness, ovality, and diameter against tight ISO/IS tolerances in real time.'
    },
    {
      title: 'Permanent Pipe Marking',
      body: 'Pipes are marked with size, pressure rating, batch code, and standards information for full traceability throughout their service life.'
    },
    {
      title: 'Automated Cutting to Length',
      body: 'Servo-driven saws cut pipes to specified lengths with clean square edges, ready for coiling or palletized straight-length packaging.'
    },
    {
      title: 'Coiling, Stacking & Packaging',
      body: 'Coiled and straight lengths are packaged, labeled, and prepared for dispatch with strapping and end caps that protect during transit.'
    }
  ];

  function setActive(index) {
    if (index < 0) index = 0;
    if (index >= pills.length) index = pills.length - 1;
    pills.forEach(function (pill, i) {
      var isActive = i === index;
      pill.classList.toggle('hdpe-process-pill--active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    if (titleEl && stepDetails[index]) {
      titleEl.textContent = stepDetails[index].title;
      var bodyEl = titleEl.parentElement && titleEl.parentElement.querySelector('.hdpe-process-detail__body');
      if (bodyEl) bodyEl.textContent = stepDetails[index].body;
    }
  }

  function currentIndex() {
    for (var i = 0; i < pills.length; i++) {
      if (pills[i].classList.contains('hdpe-process-pill--active')) return i;
    }
    return 0;
  }

  pills.forEach(function (pill, i) {
    pill.addEventListener('click', function () { setActive(i); });
  });

  var prevBtn = document.querySelector('.hdpe-process-nav__btn--prev');
  var nextBtn = document.querySelector('.hdpe-process-nav__btn--next');
  if (prevBtn) prevBtn.addEventListener('click', function () { setActive(currentIndex() - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { setActive(currentIndex() + 1); });
})();

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item__trigger').forEach(function (trigger) {
  trigger.addEventListener('click', function () {
    var answer = document.getElementById(trigger.getAttribute('aria-controls'));
    var isOpen = trigger.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-item__trigger').forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      var icon = t.querySelector('.faq-item__icon');
      if (icon) icon.classList.remove('faq-item__icon--up');
      var regionId = t.getAttribute('aria-controls');
      if (regionId) {
        var region = document.getElementById(regionId);
        if (region) region.hidden = true;
      }
    });

    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      var openIcon = trigger.querySelector('.faq-item__icon');
      if (openIcon) openIcon.classList.add('faq-item__icon--up');
      if (answer) answer.hidden = false;
    }
  });
});
