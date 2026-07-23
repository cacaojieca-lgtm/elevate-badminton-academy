/**
 * Elevate Badminton Academy — Main JavaScript
 * Handles navigation, animations, form validation, lightbox, and more.
 */

(function () {
  'use strict';

  /* ============================================================
     DOM REFERENCES
     ============================================================ */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const backToTop = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const accordionItems = document.querySelectorAll('.accordion__item');
  const revealElements = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stats__number');
  const rippleButtons = document.querySelectorAll('.btn--ripple');

  /* ============================================================
     MOBILE NAVIGATION
     ============================================================ */
  function toggleNav() {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
      updateActiveLink(link);
    });
  });

  /* ============================================================
     STICKY HEADER SHADOW ON SCROLL
     ============================================================ */
  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    /* Back to top visibility */
    if (scrollY > 400) {
      backToTop.classList.add('visible');
      backToTop.removeAttribute('hidden');
    } else {
      backToTop.classList.remove('visible');
      backToTop.setAttribute('hidden', '');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink(activeLink) {
    navLinks.forEach(function (link) {
      link.classList.remove('active');
    });
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        const matchingLink = document.querySelector('.nav__link[href="#' + id + '"]');
        if (matchingLink) {
          updateActiveLink(matchingLink);
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* ============================================================
     SECTION REVEAL ANIMATIONS (Intersection Observer)
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================================
     ANIMATED COUNTERS
     ============================================================ */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(function (stat) {
    counterObserver.observe(stat);
  });

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  accordionItems.forEach(function (item) {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    trigger.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      /* Close all other panels */
      accordionItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.accordion__panel').setAttribute('hidden', '');
        }
      });

      /* Toggle current panel */
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('hidden', '');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.removeAttribute('hidden');
      }
    });

    /* Keyboard support */
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  /* ============================================================
     GALLERY LIGHTBOX
     ============================================================ */
  let lastFocusedElement = null;

  function openLightbox(src, caption) {
    lastFocusedElement = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const src = item.getAttribute('data-lightbox');
      const caption = item.getAttribute('data-caption');
      openLightbox(src, caption);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    }
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

  /* ============================================================
     CONTACT FORM VALIDATION
     ============================================================ */
  const validators = {
    name: function (value) {
      if (!value.trim()) return 'Please enter your full name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function (value) {
      if (!value.trim()) return 'Please enter your email address.';
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(value)) return 'Please enter a valid email address.';
      return '';
    },
    phone: function (value) {
      if (!value.trim()) return 'Please enter your phone number.';
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10) return 'Please enter a valid phone number.';
      return '';
    },
    message: function (value) {
      if (!value.trim()) return 'Please enter a message.';
      if (value.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (message) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }
  }

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const error = validators[fieldId](input.value);
    showError(fieldId, error);
    return !error;
  }

  if (contactForm) {
    /* Real-time validation on blur */
    ['name', 'email', 'phone', 'message'].forEach(function (fieldId) {
      const input = document.getElementById(fieldId);
      input.addEventListener('blur', function () {
        validateField(fieldId);
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) {
          validateField(fieldId);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fields = ['name', 'email', 'phone', 'message'];
      let isValid = true;

      fields.forEach(function (fieldId) {
        if (!validateField(fieldId)) {
          isValid = false;
        }
      });

      if (isValid) {
        formSuccess.removeAttribute('hidden');
        contactForm.reset();
        fields.forEach(function (fieldId) {
          showError(fieldId, '');
        });

        /* Hide success message after 6 seconds */
        setTimeout(function () {
          formSuccess.setAttribute('hidden', '');
        }, 6000);
      } else {
        /* Focus first invalid field */
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }

  /* ============================================================
     BUTTON RIPPLE EFFECT
     ============================================================ */
  rippleButtons.forEach(function (button) {
    button.addEventListener('click', function (e) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      button.appendChild(ripple);

      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  });

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
