document.addEventListener('DOMContentLoaded', () => {
  console.log('Xccelerating Home Search: DOM ready');
});

const utils = {
  formatPhone(value) {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const parts = [digits.slice(0,3), digits.slice(3,6), digits.slice(6,10)].filter(Boolean);
    return parts.length > 2 ? `(${parts[0]}) ${parts[1]}-${parts[2]}` : parts.join('-');
  },
  formatCurrency(value) {
    const number = Number(value || 0);
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  },
  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
  getTimestamp() {
    return new Date().toISOString();
  }
};

window.utils = utils;
