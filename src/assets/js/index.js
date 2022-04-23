const switchToLight = (body) => {
  body.dataset.theme = "light";
  localStorage.setItem("theme", "light");
};

const switchToDark = (body) => {
  body.dataset.theme = "dark";
  localStorage.setItem("theme", "dark");
};

let prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

let initialTheme = localStorage.getItem("theme");
if (!initialTheme) {
  initialTheme = prefersDark ? "dark" : "light";
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeSwitcher = document.getElementById("theme-switcher");

  body.dataset.theme = initialTheme;

  setTimeout(() => {
    body.classList.add("loaded");
    themeSwitcher.classList.add("loaded");
  }, 0);

  themeSwitcher && themeSwitcher.addEventListener("click", () => {
      body.dataset.theme === "dark" ? switchToLight(body) : switchToDark(body);
    });
});
