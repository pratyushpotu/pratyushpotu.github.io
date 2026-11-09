/*
  Light / dark switch.

  A page starts in the reader's system setting. Pressing the switch flips the
  theme and remembers the choice on that device; without a remembered choice
  the page keeps following the system setting, even if it changes while the
  page is open. The small script in each page's <head> applies a remembered
  choice before the page is drawn, so there is no flash of the wrong theme.
*/
(function () {
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var button = document.querySelector('.theme-toggle');

  function remembered() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (button) {
      button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  apply(root.getAttribute('data-theme') || (media && media.matches ? 'dark' : 'light'));

  if (button) {
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) { /* private browsing: not remembered */ }
      apply(next);
    });
  }

  if (media) {
    var follow = function (e) {
      var t = remembered();
      if (t !== 'light' && t !== 'dark') apply(e.matches ? 'dark' : 'light');
    };
    if (media.addEventListener) media.addEventListener('change', follow);
    else if (media.addListener) media.addListener(follow);
  }
})();
