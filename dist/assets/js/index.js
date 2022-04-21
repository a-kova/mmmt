document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeSwitcher = document.getElementById('theme-switcher');

    themeSwitcher && themeSwitcher.addEventListener('click', () => {
        if (body.dataset.theme == 'dark') {
            body.dataset.theme = 'light';
        } else {
            body.dataset.theme = 'dark';
        }
    });
});