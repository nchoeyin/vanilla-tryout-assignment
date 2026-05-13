// ===== Mobile nav toggle =====
const menuToggle = document.querySelector('.site-header__menu-toggle');
const mobileNav  = document.querySelector('#mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', function() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.hidden = isOpen;
  });
}

// ===== Mobile products submenu =====
const mobileProductsBtn = document.querySelector('.mobile-nav__link--button');
const mobileSubmenu     = document.querySelector('.mobile-nav__submenu');

if (mobileProductsBtn && mobileSubmenu) {
  mobileProductsBtn.addEventListener('click', function() {
    const isOpen = mobileProductsBtn.getAttribute('aria-expanded') === 'true';
    mobileProductsBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileSubmenu.classList.toggle('mobile-nav__submenu--open', !isOpen);
  });
}

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item__trigger').forEach(function(trigger) {
  trigger.addEventListener('click', function() {
    var answer = document.getElementById(trigger.getAttribute('aria-controls'));
    var isOpen = trigger.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-item__trigger').forEach(function(t) {
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
