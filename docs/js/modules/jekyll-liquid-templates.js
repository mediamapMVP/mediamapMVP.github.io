---
---
// Lines above are for Jekyll processing and should not be removed
// Module for Jekyll variables using Liquid templates in comments

// {% assign image_files = site.static_files | where: "image", true %}
export const IMAGE_FILES = [];
// {% for image in image_files %}
IMAGE_FILES.push("{{ image.path }}");
// {% endfor %}

export const FEATURED_NAMES = new Set();
// {% for item in site.featured %}
FEATURED_NAMES.add("{{ item.name }}");
// {% endfor %}
