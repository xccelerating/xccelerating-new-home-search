document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initModals();
  initChatWidget();
  initCounters();
  initFilterToggles();
});

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle], .menu-toggle, .nav-toggle');
  const menu = document.querySelector('[data-mobile-menu], .mobile-menu, #mobile-menu');
  if (!toggle || !menu) return;

  const body = document.body;
  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-active');
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  };

  const openMenu = () => {
    menu.classList.add('is-open');
    toggle.classList.add('is-active');
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  };

  toggle.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isOpen = menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initModals() {
  const openers = document.querySelectorAll('[data-modal-open], [data-modal-target]');
  const modals = document.querySelectorAll('[data-modal], .modal');
  if (!openers.length && !modals.length) return;

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const focusTarget = modal.querySelector('input, button, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusTarget) focusTarget.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  openers.forEach((opener) => {
    opener.addEventListener('click', (event) => {
      event.preventDefault();
      const target = opener.getAttribute('data-modal-open') || opener.getAttribute('data-modal-target');
      const modal = document.querySelector(target) || document.getElementById(target?.replace('#', ''));
      openModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.setAttribute('aria-hidden', 'true');

    modal.addEventListener('click', (event) => {
      const closeBtn = event.target.closest('[data-modal-close], .modal__close');
      if (closeBtn) {
        event.preventDefault();
        closeModal(modal);
        return;
      }

      if (event.target === modal && modal.hasAttribute('data-modal')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openModalEl = document.querySelector('[data-modal].is-open, .modal.is-open');
    closeModal(openModalEl);
  });
}

function initChatWidget() {
  const root = document.getElementById('chat-widget');
  if (!root) return;

  if (!root.children.length) {
    root.innerHTML = `
      <div class="chat-widget" data-chat-widget>
        <button class="chat-toggle" type="button" data-chat-toggle aria-expanded="false" aria-label="Open chat">
          💬
        </button>
        <div class="chat-box" data-chat-panel aria-hidden="true">
          <div class="chat-header">
            <span>Chat with Own It Gyrl</span>
            <button class="chat-close" type="button" data-chat-close aria-label="Close chat">×</button>
          </div>
          <div class="chat-messages" data-chat-messages>
            <div class="chat-message chat-message--agent">Hi! How can we help with your home search today?</div>
          </div>
          <div class="chat-quick-replies">
            <button class="btn btn-secondary btn-sm" type="button" data-chat-cta="tour">Schedule a tour</button>
            <button class="btn btn-secondary btn-sm" type="button" data-chat-cta="prequal">Pre‑qualify</button>
            <button class="btn btn-secondary btn-sm" type="button" data-chat-cta="question">Ask a question</button>
          </div>
          <div class="chat-input-area">
            <input class="form-input" type="text" placeholder="Type a message" />
            <button class="btn btn-primary btn-sm" type="button">Send</button>
          </div>
        </div>
      </div>
    `;
  }

  const toggle = root.querySelector('[data-chat-toggle]');
  const panel = root.querySelector('[data-chat-panel]');
  const close = root.querySelector('[data-chat-close]');
  const messages = root.querySelector('[data-chat-messages]');
  if (!toggle || !panel) return;

  const getListingData = () => {
    const body = document.body;
    if (body?.dataset?.address) {
      return {
        address: body.dataset.address,
        price: body.dataset.price,
        beds: body.dataset.beds,
        baths: body.dataset.baths,
        sqft: body.dataset.sqft,
        highlights: body.dataset.highlights,
        status: body.dataset.status,
      };
    }
    try {
      return JSON.parse(localStorage.getItem('selectedListing'));
    } catch (e) {
      return null;
    }
  };

  const injectListingMessage = () => {
    if (!messages) return;
    const data = getListingData();
    if (!data || messages.querySelector('[data-listing-message]')) return;
    const block = document.createElement('div');
    block.className = 'chat-message chat-message--agent';
    block.setAttribute('data-listing-message', 'true');
    block.innerHTML = `I can help you with <strong>${data.address}</strong> (${data.status}). It’s listed at <strong>${data.price}</strong> with ${data.beds} beds, ${data.baths} baths, and ${data.sqft} sq ft. Highlights: ${data.highlights}. Want me to book a tour?`;
    messages.appendChild(block);
  };

  const openChat = () => {
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    injectListingMessage();
  };

  const closeChat = () => {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    isOpen ? closeChat() : openChat();
  });

  if (close) {
    close.addEventListener('click', closeChat);
  }

  document.querySelectorAll('[data-listing-card]').forEach((card) => {
    card.addEventListener('click', () => {
      const data = {
        address: card.dataset.address,
        price: card.dataset.price,
        beds: card.dataset.beds,
        baths: card.dataset.baths,
        sqft: card.dataset.sqft,
        highlights: card.dataset.highlights,
        status: card.dataset.status,
      };
      localStorage.setItem('selectedListing', JSON.stringify(data));
      openChat();
    });
  });

  root.querySelectorAll('[data-chat-cta]')?.forEach((btn) => {
    btn.addEventListener('click', () => openChat());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeChat();
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter], .counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const targetValue = Number(el.getAttribute('data-counter')) || Number(el.textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const duration = Number(el.getAttribute('data-counter-duration')) || 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(targetValue * progress);
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const formatted = Number.isNaN(value) ? 0 : value.toLocaleString('en-US');
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => observer.observe(counter));
}

function initFilterToggles() {
  const toggles = document.querySelectorAll('[data-filter-toggle]');
  const panels = document.querySelectorAll('[data-filter-panel]');
  const filterButtons = document.querySelectorAll('[data-filter-option]');

  toggles.forEach((toggle) => {
    const targetSelector = toggle.getAttribute('data-filter-target') || '[data-filter-panel]';
    const panel = document.querySelector(targetSelector);
    if (!panel) return;

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      panel.classList.toggle('is-open');
      toggle.classList.toggle('is-active');
      toggle.setAttribute('aria-expanded', panel.classList.contains('is-open') ? 'true' : 'false');
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      button.classList.toggle('is-active');
    });
  });

  panels.forEach((panel) => {
    panel.addEventListener('click', (event) => {
      const clear = event.target.closest('[data-filter-clear]');
      if (!clear) return;
      event.preventDefault();
      filterButtons.forEach((button) => button.classList.remove('is-active'));
    });
  });
}
