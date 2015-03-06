+function(root, undefined) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    var zoom = new ZoomTool(document.querySelector('.frame'), {
      zoomFactor: 2.0,
    });
  });
}(window);
