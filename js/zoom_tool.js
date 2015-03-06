+function(root, undefined) {
  "use strict";

  var OPT_KEY = 18;

  var ZoomTool = root.ZoomTool = function(el, opts) {
    this.el = el;
    this.el.classList.add('zoomable');
    this.initOptions(opts || {});
    this.initListeners();
    this.renderLabel();
  };

  ZoomTool.prototype = {
    constructor: ZoomTool,

    el: null,

    label: null,

    initOptions: function(opts) {
      this.zoomScale = opts.zoomScale || 1.0;
      this.prevZoomScale = this.zoomScale;
      this.zoomFactor = opts.zoomFactor || 1.1;
      this.minScale = opts.minScale || 1.0;
      this.maxScale = opts.maxScale || 32.0;
    },

    initListeners: function() {
      document.addEventListener("keydown", this.onKeyDown.bind(this));
      document.addEventListener("keyup", this.onKeyUp.bind(this));
      this.el.addEventListener("click", this.onFrameClick.bind(this));
    },

    _reverse: false,

    get reverse() {
      return this._reverse;
    },

    set reverse(val) {
      if (val) {
        this.el.classList.add('reverse');
      } else {
        this.el.classList.remove('reverse');
      }
      this._reverse = val;
    },

    onKeyDown: function(evt) {
      if (evt.which === OPT_KEY) {
        this.reverse = true;
      }
    },

    onKeyUp: function(evt) {
      if (evt.which === OPT_KEY) {
        this.reverse = false;
      }
    },

    onFrameClick: function(evt) {
      this.zoomToPoint({
        x: evt.pageX - this.el.offsetLeft,
        y: evt.pageY - this.el.offsetTop,
      });
    },

    zoomToPoint: function(point) {
      var scale;
      if (this.reverse) {
        scale = this.zoomScale / this.zoomFactor;
        if (scale < this.minScale) return;
      } else {
        scale = this.zoomScale * this.zoomFactor;
        if (scale > this.maxScale) return;
      }
      this.prevZoomScale = this.zoomScale;
      this.zoomScale = scale;
      this.renderZoom(point);
    },

    get image() {
      return this.el.children[0];
    },

    renderZoom: function(zoomPoint) {
      var anchorOrigin = {
        x: (zoomPoint.x + this.el.scrollLeft) / this.prevZoomScale,
        y: (zoomPoint.y + this.el.scrollTop) / this.prevZoomScale,
      },
      zoomedAnchor = {
        x: anchorOrigin.x * this.zoomScale,
        y: anchorOrigin.y * this.zoomScale,
      };

      this.image.style.transform = "scale("+this.zoomScale+")";
      this.setScrollOffset(zoomedAnchor.x - zoomPoint.x, zoomedAnchor.y - zoomPoint.y);
      this.updateLabel();
    },

    setScrollOffset: function(x, y) {
      this.el.scrollLeft = Math.floor(x);
      this.el.scrollTop = Math.floor(y);
    },

    renderLabel: function() {
      var label = document.createElement("strong");
      label.classList.add("label");
      this.el.appendChild(label);
      this.label = label;
      this.updateLabel();
    },

    updateLabel: function() {
      this.label.textContent = (this.zoomScale * 100) + "%";
    }

  };

}(window);