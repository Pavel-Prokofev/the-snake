export const setTheme = (() => {
  function changeTheme(theme) {
    document.documentElement.className = '';
    document.documentElement.classList.add(`snake-theme-${theme}`);
    localStorage.setItem('snake-theme', theme);
  }

  (function initTheme() {
    const theme = localStorage.getItem('snake-theme');

    if (theme) {
      changeTheme(theme);
    }
  })();

  document.addEventListener('DOMContentLoaded', () => {

    const themeChecks = document.querySelector('.theme-color').querySelectorAll('.fieldset__radio');

    themeChecks.forEach((check) => {
      if (check.getAttribute('id') === localStorage.getItem('snake-theme')) {
        check.checked = 1;
      }
      check.onclick = () => {
        changeTheme(check.getAttribute('id'));
      };
    });
  });
})();