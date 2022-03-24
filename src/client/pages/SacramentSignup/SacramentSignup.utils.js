const calendlyId = 'calendlyScript';

export function buildCalendlyScript() {
  const isScript = document.getElementById(calendlyId);
  console.log('isScript:', isScript);

  if (!isScript) {
    const script = document.createElement('script');

    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.id = calendlyId;
    script.type = 'text/javascript';
    script.async = true;

    document.body.appendChild(script);
  }
}

export function removeCalendlyScript() {
  document.getElementById(calendlyId).remove();
}
