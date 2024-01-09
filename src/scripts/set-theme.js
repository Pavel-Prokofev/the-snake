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

  const themeButtons = document.querySelector('.theme-color').querySelectorAll('.fieldset__radio');

  themeButtons.forEach((button) => {
    button.onclick = () => {
      changeTheme(button.getAttribute('id'));
    };
  });
});
})();