import * as PIXI from "pixi.js";
import bus from "../events/eventBus";
import MouseService from "../events/MouseService";

export default class AppGfx extends PIXI.Application {
  constructor() {
    const domEl = document.getElementById("app-graphics");
    const initWidth = document.offsetWidth;
    const initHeight = document.initHeight;

    super({
      width: initWidth,
      height: initHeight,
      backgroundColor: 0xf6f6f6,
      antialias: true,
      autoResize: true,
      legacy: isLegacy,
      transparent: true
    });
    this.events = bus;
  }
  load(manifest, callback) {
    this.loader.add(manifest).load(() => {
      callback();
      this.init();
    });
    this.loader.onProgress.add(e => {
      bus.emit("LOAD_PROGRESS", e.progress);
    });
  }
  init() {
    // called after assets have loaded
    const { stage, view, ticker, events } = this;
    stage.interactive = true;
    this.domElement.appendChild(view);
    // init mouse listener
    this.MouseService = new MouseService(stage);

    ticker.add(this.animate, this);
    window.addEventListener("resize", () => {
      let delay = 500;
      // debounce the resize event
      if (this.resizing) {
        window.clearTimeout(this.resizing);
      }
      this.resizing = window.setTimeout(this.onResize.bind(this), delay);
    });

    events.on("USER_ACTION", e => {
      this.userAction(e);
    });

    this.initScenes();
  }
  onResize() {
    const { renderer, view, events } = this;
    const parent = view.parentNode;
    renderer.resize(parent.clientWidth, parent.clientHeight);
    events.emit("WINDOW_RESIZE");
  }
  appBounds() {
    const { view } = this;
    let vw = view.width;
    let vh = view.height;
    let cx = vw / 2;
    let cy = vh / 2;
    return { vw, vh, cx, cy };
  }
  animate(delta) {
    this.events.emit("animate", delta);
    if (this.MouseService.mouseData.x > 0) {
      this.light.x = this.MouseService.mouseData.x;
      this.light.y = this.MouseService.mouseData.y;
    }
  }
}
