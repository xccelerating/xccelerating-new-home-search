document.addEventListener('DOMContentLoaded', () => {
  window.XCCIntegrations?.injectEmbeds?.();
});

window.XCCIntegrations = (() => {
  const CONFIG = {
    convert: {
      apiKey: 'REPLACE_WITH_CONVERT_API_KEY',
      formId: 'REPLACE_WITH_CONVERT_FORM_ID',
      webhookUrl: 'REPLACE_WITH_CONVERT_WEBHOOK_URL',
      embedHtml: '',
    },
    ghl: {
      webhookUrl: 'REPLACE_WITH_GHL_WEBHOOK_URL',
      calendarEmbedUrl: 'REPLACE_WITH_GHL_CALENDAR_EMBED_URL',
      locationId: 'REPLACE_WITH_GHL_LOCATION_ID',
      pipelineId: 'REPLACE_WITH_GHL_PIPELINE_ID',
    },
    flow: {
      webhookUrl: 'REPLACE_WITH_FLOW_WEBHOOK_URL',
      formId: 'REPLACE_WITH_FLOW_FORM_ID',
      tagId: 'REPLACE_WITH_FLOW_TAG_ID',
    },
  };

  const ROUTES = {
    'home-search': {
      provider: 'ghl',
      webhook: CONFIG.ghl.webhookUrl,
    },
    'tour-request': {
      provider: 'ghl',
      webhook: CONFIG.ghl.webhookUrl,
      redirect: '/thank-you-tour.html',
    },
    'listing-tour': {
      provider: 'ghl',
      webhook: CONFIG.ghl.webhookUrl,
      redirect: '/thank-you-tour.html',
    },
    'offer-request': {
      provider: 'flow',
      webhook: CONFIG.flow.webhookUrl,
    },
    'preapproval-request': {
      provider: 'flow',
      webhook: CONFIG.flow.webhookUrl,
    },
    masterclass: {
      provider: 'convert',
      webhook: CONFIG.convert.webhookUrl,
      redirect: '/thank-you-masterclass.html',
    },
  };

  async function submitForm(formType, payload, context) {
    const route = ROUTES[formType];
    if (!route) {
      return { ok: false, message: 'We will reach out shortly.' };
    }

    const data = {
      formType,
      payload,
      context,
      provider: route.provider,
    };

    const result = await postWebhook(route.webhook, data);

    return {
      ok: !result?.error,
      redirect: route.redirect || null,
      message: result?.skipped
        ? 'Thanks! We received your request and will follow up soon.'
        : 'Thanks! We received your request and will follow up soon.',
    };
  }

  async function postWebhook(url, payload) {
    if (!url || url.includes('REPLACE_WITH')) {
      console.info('[Integrations] Webhook placeholder not configured.', payload);
      return { skipped: true };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return { error: true, status: response.status, body: text };
    }

    return { ok: true };
  }

  function injectEmbeds() {
    document.querySelectorAll('[data-embed]').forEach((slot) => {
      const key = slot.getAttribute('data-embed');
      if (key === 'ghl-calendar') {
        if (!CONFIG.ghl.calendarEmbedUrl || CONFIG.ghl.calendarEmbedUrl.includes('REPLACE_WITH')) return;
        slot.innerHTML = `<iframe src="${CONFIG.ghl.calendarEmbedUrl}" style="width: 100%; min-height: 520px; border: 0;" loading="lazy" title="Schedule a strategy call"></iframe>`;
        slot.style.display = 'block';
      }

      if (key === 'convert-masterclass') {
        if (!CONFIG.convert.embedHtml) return;
        slot.innerHTML = CONFIG.convert.embedHtml;
        slot.style.display = 'block';
      }
    });
  }

  return {
    config: CONFIG,
    routes: ROUTES,
    submitForm,
    injectEmbeds,
  };
})();
