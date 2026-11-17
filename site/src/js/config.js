// Site configuration. Edit here, rebuild, deploy.
window.AMIMOTION_CONFIG = {
  // Where diagnostic and contact leads are sent. Leave empty to fall back to an email draft to salesEmail.
  //   HubSpot Forms API: https://api.hsforms.com/submissions/v3/integration/submit/<portalId>/<formGuid>
  //   or any HTTPS endpoint that accepts a JSON POST (set leadFormat: 'json').
  leadEndpoint: '',
  leadFormat: 'hubspot',
  salesEmail: 'sales@amimotion.com',
  // Analytics (measure.js). '' = nothing leaves the browser. 'plausible' = cookieless. 'ga4:G-FVENWVDLHE' = the
  // Google Analytics property the old amimotion.com uses (keeps history; needs a consent banner and a privacy-notice line).
  analytics: '',
};
