/* ==========================================================================
   elan1 app boot. Loads last. The public home ('/') is owned by another
   screen file; if it is not registered, '#/' lands on /work/today.
   ========================================================================== */
(function () {
  'use strict';
  function boot() {
    if (!E1.hasRoute('/')) {
      E1.route('/', { title: 'Home', redirect: '/work/today', palette: false });
    }
    E1.start({ fallback: '/work/today' });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
