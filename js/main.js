/* ============================================================
   Chamod Chandrapala – Portfolio JavaScript
   ============================================================ */

'use strict';

// ============================================================
//  NAV: Sticky style on scroll
// ============================================================
const navbar = document.getElementById('navbar');
function updateNav() {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ============================================================
//  NAV: Mobile hamburger toggle
// ============================================================
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navOverlay  = document.getElementById('navOverlay');

function openNav() {
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeNav();
  } else {
    openNav();
  }
});

navOverlay.addEventListener('click', closeNav);

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

// ============================================================
//  NAV: Active section highlighting on scroll
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link[data-section]');

function highlightNav() {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

// ============================================================
//  SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
//  SCROLL ANIMATIONS (Intersection Observer)
// ============================================================
const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach(el => {
  animObserver.observe(el);
});

// ============================================================
//  CONTACT FORM Validation
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  // Real-time clearing of errors on input
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      clearError(input);
    });
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameEl    = document.getElementById('contactName');
    const emailEl   = document.getElementById('contactEmail');
    const messageEl = document.getElementById('contactMessage');

    const nameValid    = validateField(nameEl);
    const emailValid   = validateField(emailEl);
    const messageValid = validateField(messageEl);

    if (nameValid && emailValid && messageValid) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Redirecting to WhatsApp...';

      // Format the WhatsApp message
      const whatsappNumber = "94763481859"; // Sri Lanka country code +94
      const text = `Hello Chamod! I'm ${nameEl.value}.%0AEmail: ${emailEl.value}%0A%0A${messageEl.value}`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Reset form and show success state
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';
        formSuccess.classList.add('visible');
        contactForm.reset();

        setTimeout(() => {
          formSuccess.classList.remove('visible');
        }, 6000);
      }, 1500);
    }
  });
}

function validateField(input) {
  const id    = input.id;
  const value = input.value.trim();
  let   isValid = true;

  if (id === 'contactName') {
    if (!value) {
      showError(input, 'nameError', 'Please enter your name.');
      isValid = false;
    } else if (value.length < 2) {
      showError(input, 'nameError', 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(input);
    }
  }

  if (id === 'contactEmail') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      showError(input, 'emailError', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(value)) {
      showError(input, 'emailError', 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(input);
    }
  }

  if (id === 'contactMessage') {
    if (!value) {
      showError(input, 'messageError', 'Please enter your message.');
      isValid = false;
    } else if (value.length < 10) {
      showError(input, 'messageError', 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearError(input);
    }
  }

  return isValid;
}

function showError(input, errorId, message) {
  input.classList.add('error');
  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('visible');
  }
}

function clearError(input) {
  input.classList.remove('error');
  // Find the associated error span
  const group  = input.closest('.form-group');
  if (group) {
    const errEl = group.querySelector('.form-error');
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.remove('visible');
    }
  }
}

// ============================================================
//  FOOTER: Dynamic year
// ============================================================
const yearEl = document.getElementById('footerYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
