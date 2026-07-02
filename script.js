(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var dark = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', dark);

  function paintToggleIcon() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (dark === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML = dark === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  paintToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', function () {
      dark = dark === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', dark);
      paintToggleIcon();
    });
  }

  var rail = document.getElementById('rail');
  var railToggle = document.getElementById('railToggle');
  var isMobile = function () { return window.innerWidth <= 900; };

  if (railToggle && rail) {
    railToggle.addEventListener('click', function () {
      if (isMobile()) {
        rail.classList.toggle('mobile-open');
        railToggle.setAttribute('aria-expanded', rail.classList.contains('mobile-open'));
      } else {
        rail.classList.toggle('collapsed');
        railToggle.setAttribute('aria-expanded', !rail.classList.contains('collapsed'));
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (isMobile() && rail && rail.classList.contains('mobile-open')) {
      if (!rail.contains(e.target) && e.target !== railToggle && !railToggle.contains(e.target)) {
        rail.classList.remove('mobile-open');
      }
    }
  });
})();
