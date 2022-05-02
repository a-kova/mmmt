/** Dark mode switcher */

const switchToLight = (body) => {
  body.dataset.theme = "light";
  localStorage.setItem("theme", "light");
};

const switchToDark = (body) => {
  body.dataset.theme = "dark";
  localStorage.setItem("theme", "dark");
};

let prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

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

  themeSwitcher.addEventListener("click", () => {
    body.dataset.theme === "dark" ? switchToLight(body) : switchToDark(body);
  });
});

/** Fade in */

const observer = new IntersectionObserver(
  (entries, observer) => {
    let appearingElementCounter = 0;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.setAttribute("data-appeared", "true");
        }, appearingElementCounter * 200);

        observer.unobserve(entry.target);
        appearingElementCounter++;
      }
    });
  },
  { threshold: 0.1 }
);

document.addEventListener("DOMContentLoaded", () => {
  const elements = [...document.getElementsByClassName("fade-in")];
  const images = [...document.querySelectorAll(".fade-in img")];

  // Wait for all images to be downloaded from elements
  Promise.all(
    images.map(
      (image) =>
        new Promise((resolve) => {
          if (image.completed) {
            resolve();
          } else {
            image.onload = image.onerror = resolve;
          }
        })
    )
  ).then(() => {
    elements.forEach((element) => observer.observe(element));
  });
});
