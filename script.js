(function () {
  "use strict";

  const STORAGE_KEY = "studioNorthSettings";

  const DEFAULT_SETTINGS = {
    theme: "light",
    navigationOpen: false
  };

  function readSettings() {
    const rawSettings =
      window.localStorage.getItem(STORAGE_KEY);

    if (!rawSettings) {
      return {
        ...DEFAULT_SETTINGS
      };
    }

    try {
      const parsedSettings =
        JSON.parse(rawSettings);

      return {
        theme:
          parsedSettings.theme === "dark"
            ? "dark"
            : DEFAULT_SETTINGS.theme,

        navigationOpen:
          parsedSettings.navigationOpen === true
      };
    } catch (error) {
      console.warn(
        "Saved settings were corrupt. Default settings were used.",
        error
      );

      return {
        ...DEFAULT_SETTINGS
      };
    }
  }

  function saveSettings(settings) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  }

  /*
    This runs immediately because script.js is loaded
    in the head. It prevents a wrong-theme flash.
  */
  const settings = readSettings();

  document.documentElement.dataset.theme =
    settings.theme;

  function renderProjects() {
    const projects = [
      {
        title: "Field Notes",
        description:
          "A calm research dashboard that turns observations into useful patterns.",
        tag: "Product design"
      },
      {
        title: "Common Ground",
        description:
          "A community platform designed to help neighbours share skills and resources.",
        tag: "Web development"
      },
      {
        title: "Clear Signal",
        description:
          "A visual identity and launch site for a more human technology conference.",
        tag: "Brand identity"
      }
    ];

    const projectList =
      document.querySelector("#project-list");

    projectList.innerHTML = projects
      .map(function (project, index) {
        return `
          <article class="project-card">
            <span class="project-number">
              0${index + 1}
            </span>

            <h3>${project.title}</h3>

            <p>${project.description}</p>

            <span class="tag">
              ${project.tag}
            </span>
          </article>
        `;
      })
      .join("");
  }

  function setTheme(theme, themeButton) {
    settings.theme = theme;

    document.documentElement.dataset.theme =
      theme;

    themeButton.setAttribute(
      "aria-pressed",
      String(theme === "dark")
    );

    themeButton.querySelector(
      ".theme-label"
    ).textContent =
      theme === "dark"
        ? "Light mode"
        : "Dark mode";

    saveSettings(settings);
  }

  function showFieldError(field, message) {
    const errorElement =
      document.querySelector(
        `#${field.id}-error`
      );

    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
  }

  function clearFieldError(field) {
    const errorElement =
      document.querySelector(
        `#${field.id}-error`
      );

    field.removeAttribute("aria-invalid");
    errorElement.textContent = "";
  }

  function validateForm(form) {
    const nameField = form.elements.name;
    const emailField = form.elements.email;
    const messageField = form.elements.message;

    const fields = [
      nameField,
      emailField,
      messageField
    ];

    let isValid = true;

    fields.forEach(clearFieldError);

    if (!nameField.value.trim()) {
      showFieldError(
        nameField,
        "Please enter your name."
      );

      isValid = false;
    }

    if (!emailField.value.trim()) {
      showFieldError(
        emailField,
        "Please enter your email address."
      );

      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailField.value.trim()
      )
    ) {
      showFieldError(
        emailField,
        "Please enter a valid email address, such as name@example.com."
      );

      isValid = false;
    }

    if (!messageField.value.trim()) {
      showFieldError(
        messageField,
        "Please tell us what you would like to discuss."
      );

      isValid = false;
    }

    if (!isValid) {
      const firstInvalidField =
        fields.find(function (field) {
          return field.getAttribute(
            "aria-invalid"
          ) === "true";
        });

      firstInvalidField.focus();
    }

    return isValid;
  }

  function initialise() {
    const navigation =
      document.querySelector(
        "#primary-navigation"
      );

    const menuButton =
      document.querySelector(
        ".menu-toggle"
      );

    const themeButton =
      document.querySelector(
        "#theme-toggle"
      );

    const form =
      document.querySelector(
        "#contact-form"
      );

    const successMessage =
      document.querySelector(
        "#form-success"
      );

    renderProjects();

    navigation.classList.toggle(
      "is-open",
      settings.navigationOpen
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(settings.navigationOpen)
    );

    themeButton.setAttribute(
      "aria-pressed",
      String(settings.theme === "dark")
    );

    themeButton.querySelector(
      ".theme-label"
    ).textContent =
      settings.theme === "dark"
        ? "Light mode"
        : "Dark mode";

    menuButton.addEventListener(
      "click",
      function () {
        settings.navigationOpen =
          !navigation.classList.contains(
            "is-open"
          );

        navigation.classList.toggle(
          "is-open",
          settings.navigationOpen
        );

        menuButton.setAttribute(
          "aria-expanded",
          String(settings.navigationOpen)
        );

        saveSettings(settings);
      }
    );

    themeButton.addEventListener(
      "click",
      function () {
        const newTheme =
          settings.theme === "dark"
            ? "light"
            : "dark";

        setTheme(newTheme, themeButton);
      }
    );

    navigation
      .querySelectorAll("a")
      .forEach(function (link) {
        link.addEventListener(
          "click",
          function () {
            settings.navigationOpen = false;

            navigation.classList.remove(
              "is-open"
            );

            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

            saveSettings(settings);
          }
        );
      });

    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        successMessage.textContent = "";

        if (validateForm(form)) {
          successMessage.textContent =
            "Thank you — your enquiry has been received.";

          form.reset();
          successMessage.focus();
        }
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialise
    );
  } else {
    initialise();
  }
})();