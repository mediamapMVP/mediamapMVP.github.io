// Module for saving search

const SEARCH_BAR = document.getElementById("filterTitle");
const SUGGESTIONS_BOX = document.getElementById("suggestions");

export function saveSearchBarText() {
  SEARCH_BAR.style = "";
  SUGGESTIONS_BOX.style = "display: none;";
  if (SEARCH_BAR.value != "") {
    SEARCH_BAR.blur();
    SEARCH_BAR.style.width = "0px";
  }
}