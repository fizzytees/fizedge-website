/*
  FizEdge site settings — the only file you normally need to edit.

  COOLPREZ STATUS
    'in-development'  → "In development" badges, buttons go to the Coolprez page
    'launch-list'     → "Coming soon" badges + email sign-up form on the Coolprez page
    'live'            → "Now open" badges, buttons go to the Coolprez store (set storeUrl)
*/
window.FIZEDGE_CONFIG = {
  coolprez: {
    status: 'in-development',
    storeUrl: ''            // e.g. 'https://coolprez.com' — required when status is 'live'
  },
  // Formspree form that receives contact + launch-list messages (from the old site)
  formEndpoint: 'https://formspree.io/f/mgollpej'
};
