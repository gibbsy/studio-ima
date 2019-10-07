import bus from "./eventBus.js";

function absToRel(coords, w, h) {
  // convert absolute position point to a relative value
  let c = {};
  c.x = coords.x / w;
  c.y = coords.y / h;
  return c;
}

export default class MouseService {
  constructor(stage) {
    const _stage = stage;
    this.mouseData = {
      x: 0,
      y: 0,
      vX: 0,
      vY: 0
    };
    this.vTimeout = -1;
    _stage.on("mousemove", eventData => {
      if (this.vTimeout) {
        window.clearTimeout(this.vTimeout);
      }
      let prevMouse = this.mouseData;
      let relCoords = absToRel(eventData.data.global, _stage.width, _stage.height);
      TweenMax.to(this.mouseData, 1, {
        x: eventData.data.global.x,
        y: eventData.data.global.y,
        relX: relCoords.x,
        relY: relCoords.y,
        vX: Math.abs(prevMouse.x - eventData.data.global.x) / 60,
        vY: Math.abs(prevMouse.y - eventData.data.global.y) / 60,
        ease: Power2.easeOut
      });

      this.vTimeout = window.setTimeout(() => {
        TweenMax.to(this.mouseData, 3, {
          vX: 0,
          vY: 0,
          ease: Power2.easeInOut
        });
      }, 1000);
    });
  }
  emitEvent() {
    bus.emit("MOUSE_UPDATE", this.mouseData);
  }
}