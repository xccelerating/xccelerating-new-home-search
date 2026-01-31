document.addEventListener('DOMContentLoaded', () => {
  initFormSubmissions();
  initModalSubmissions();
});

function initFormSubmissions() {
  const forms = document.querySelectorAll('form[data-form]');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleSubmit(form.dataset.form, form);
    });
  });
}

function initModalSubmissions() {
  const buttons = document.querySelectorAll('[data-form-submit]');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const container = button.closest('[data-form]') || document.querySelector(button.getAttribute('data-form-target'));
      if (!container) return;
      handleSubmit(container.dataset.form, container, button);
    });
  });
}

function handleSubmit(formType, container, trigger) {
  if (!formType) return;
  const payload = collectFields(container);
  const statusEl = container.querySelector('[data-form-status]');

  setStatus(statusEl, 'Sending your request...');

  const integrations = window.XCCIntegrations;
  const submit = integrations?.submitForm;
  const context = buildContext(container, trigger);

  if (typeof submit !== 'function') {
    console.warn('Integrations not configured. Payload:', { formType, payload, context });
    setStatus(statusEl, 'Thanks! We received your request.');
    return;
  }

  submit(formType, payload, context)
    .then((result) => {
      if (result?.redirect) {
        window.location.href = result.redirect;
        return;
      }
      setStatus(statusEl, result?.message || 'Thanks! We received your request.');
      resetFields(container);
    })
    .catch((error) => {
      console.error('Form submission error:', error);
      setStatus(statusEl, 'Something went wrong. Please try again or contact us directly.');
    });
}

function collectFields(container) {
  const fields = container.querySelectorAll('input, select, textarea');
  const data = {};

  fields.forEach((field) => {
    if (field.disabled) return;

    const key = field.name || field.getAttribute('data-field') || field.id;
    if (!key) return;

    if (field.type === 'checkbox') {
      data[key] = field.checked;
      return;
    }

    if (field.type === 'radio') {
      if (field.checked) data[key] = field.value;
      return;
    }

    data[key] = field.value?.trim?.() ?? field.value;
  });

  return data;
}

function buildContext(container, trigger) {
  const body = document.body;
  const listingContext = body?.dataset?.address
    ? {
        address: body.dataset.address,
        price: body.dataset.price,
        beds: body.dataset.beds,
        baths: body.dataset.baths,
        sqft: body.dataset.sqft,
        highlights: body.dataset.highlights,
        status: body.dataset.status,
      }
    : null;

  return {
    page: window.location.pathname,
    timestamp: new Date().toISOString(),
    listing: listingContext,
    formContext: container?.dataset?.formContext || null,
    sourceTrigger: trigger?.textContent?.trim() || null,
  };
}

function resetFields(container) {
  container.querySelectorAll('input, textarea').forEach((field) => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      field.checked = false;
      return;
    }
    field.value = '';
  });
}

function setStatus(el, message) {
  if (!el) return;
  el.textContent = message;
}
