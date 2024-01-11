export const setTheme = (() => {
  const changeTheme = (theme) => {
    document.documentElement.className = '';
    document.documentElement.classList.add(`snake-theme-${theme}`);
    document.querySelector(`#${theme}`).checked = 1;
    localStorage.setItem('snake-theme', theme);
  }

  const initTheme = ( () => {
    const theme = localStorage.getItem('snake-theme');
    if (theme) {
      changeTheme(theme);
    }
  })();

  document.addEventListener('DOMContentLoaded', () => {

    const themeChecks = document.querySelector('.theme-color').querySelectorAll('.fieldset__radio');

    themeChecks.forEach((check) => {
      check.onclick = () => {
        changeTheme(check.getAttribute('id'));
      };
    });
  });
})();