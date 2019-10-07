import ScreenFilter from "./ScreenFilter"

export default class SlideFade extends PIXI.Container {
  constructor(app, texture, order) {
    super();
    const { stage, view, events } = app;
    this.ready = false;
    this.onStage = false;   
    this.initScale = 0;
    this.leaving = false;
    Object.assign(this, { app, stage, view, events, texture, order }); 
    this.init();
  }
  // init the slide
  init() {
    this.initGraphics();
    this.initFilters();
    this.initEvents();
    this.initAnimation();  
    this.ready = true;
  }
  initGraphics() {
    let slideImg = new PIXI.Sprite(this.texture);
    slideImg.anchor.set(0.5);
    slideImg.alpha = 0;
    this.addChild(slideImg);
    Object.assign(this, { slideImg });
  }
  initFilters() {
    this.blur = new PIXI.filters.BlurFilter(0);
    this.slideImg.filters = [this.blur];
  }
  initEvents() {
    const { events, order } = this;
    events.on("SLIDE_CHANGE", (e) => {
      if (e == order) {
        this.enter();
        console.log("ENTER");

      } else {
        window.setTimeout(() => {
          this.leave()
        })
      }
    })
  }
  initAnimation() {
    const { vw, vh, cx, cy } = this.app.getBounds();
    const { slideImg, blur } = this;
    this.positionSelf();
    this.tl_slide = new TimelineMax({ paused: true })
      .set(slideImg, {alpha: 0})
      .set(slideImg.scale, { x: this.initScale, y: this.initScale })
      .set(blur, { blur: 0 })
      .to(slideImg, 1, {alpha: 1}, 0)
      .to(slideImg.scale, 15, { x: "+=0.25", y: "+=0.25" }, 0)
      .to(blur, 4, { blur: 4 }, 10)
  }
  positionSelf() {
    const { slideImg } = this;
    const { vw, vh, cx, cy } = this.app.getBounds();
    slideImg.width = vw;
    this.initScale = slideImg.scale.y = slideImg.scale.x;
    if(slideImg.height < vh) {
      slideImg.height = vh;
      this.initScale =  slideImg.scale.x = slideImg.scale.y;
    }
    this.x = cx;
    this.y = cy;
  }
  // the enter animation
  enter() {
    const { stage } = this;
    if (this.onStage) {
      return;
    }
    this.onStage = true;
    this.positionSelf();
    stage.addChild(this);
    this.tl_slide.restart();    
  }
  // the leave animation
  leave() {
    const { stage } = this;
    this.leaving = setTimeout(() => {
      stage.removeChild(this);
      this.onStage = false;      
    }, 2000);
  }
  play() {
    this.tl_slide.resume();
    TweenMax.to(this.blur, 1, { blur: 0 });
  }
  pause() {
    this.tl_slide.pause();
    TweenMax.to(this.blur, 1, { blur: 6 });
  }
}