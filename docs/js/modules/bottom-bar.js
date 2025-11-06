// Module for showing/hiding bottom bar

const FEATURED_BAR = document.getElementById("featured-wrapper");
const FEATURED_BAR_GRADIENT = document.getElementById("featured-bar-gradient");
const FILTER_BAR_CONTAINER = document.getElementById("filter-bar-container");

export function hideBottomBar() {
  FEATURED_BAR.classList.add("featured-bar-hidden");
  FEATURED_BAR_GRADIENT.classList.add("featured-bar-gradient-hidden");
  FILTER_BAR_CONTAINER.style.bottom = "0px";
}

export function showBottomBar() {
  FEATURED_BAR.classList.remove("featured-bar-hidden");
  FEATURED_BAR_GRADIENT.classList.remove("featured-bar-gradient-hidden");
  FILTER_BAR_CONTAINER.style = "";
}
