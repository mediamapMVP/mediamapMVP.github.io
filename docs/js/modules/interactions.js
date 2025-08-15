// Module for add form, follow, and search inteactions

const SAVE_SEARCH_MODULE = await import("./save-search.js");
function saveSearchBarText() { SAVE_SEARCH_MODULE.saveSearchBarText(); }


export function createEventListeners () {
  const ADD_BTN = document.getElementById("addBtn");
  const FOLLOW_BTN = document.getElementById("followBtn");

  const ADD_FORM = document.getElementById("addForm");
  const TITLE_FORM_FIELD = document.getElementById("title");
  const DESCRIPTION_FORM_FIELD = document.getElementById("description");
  const EMAIL_FORM_FIELD = document.getElementById("addEmail");

  const SEARCH_BAR_DIV = document.getElementById("filterTitleDiv");
  const SEARCH_BAR = document.getElementById("filterTitle");

  // Hide elements so theres no overlap with accordions
  ADD_BTN.addEventListener("mouseover", () => {
    saveSearchBarText();
    ADD_BTN.focus();
  });

  FOLLOW_BTN.addEventListener("mouseover", () => {
    saveSearchBarText();
  });
  SEARCH_BAR_DIV.addEventListener("mouseover", () => {
    ADD_BTN.blur();
    TITLE_FORM_FIELD.blur();
    DESCRIPTION_FORM_FIELD.blur();
    EMAIL_FORM_FIELD.blur();

    // Reset style if width explicitly set to 0;
    SEARCH_BAR.style = "";

    // Wait for search bar animation to finish, focus to show suggestions bar
    setTimeout(() => {
      if (SEARCH_BAR.value != "" && SEARCH_BAR.style.width !== "0px")
        SEARCH_BAR.focus();
    }, 900);
  });

  // Keep form focused
  ADD_FORM.addEventListener("mouseleave", () => {
    ADD_BTN.focus();
  });

  // Listener for add form sizing to adjust smoothly with description field expanding
  DESCRIPTION_FORM_FIELD.addEventListener("input", () => {
    if (this.scrollHeight < 6 * parseFloat(getComputedStyle(document.documentElement).fontSize)) {
      this.style.height = "auto";
      this.style.height = `${this.scrollHeight}px`;
    }
  });
}