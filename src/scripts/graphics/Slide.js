import ScreenFilter from "./ScreenFilter"

export default class Slide extends PIXI.Container {
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
    const { vw, vh, cx, cy } = this.app.getBounds();
    const mask = new PIXI.Graphics();
    mask.beginFill(0xff3300);
    mask.drawRect(0, -20, 1, vh*1.2);
    mask.skew.set(Math.radians(-22),0);
    //mask.setTransform(cx*1.1,-20,1,1,0,Math.radians(-22),0, 0, 0); 
    
    let slideImg = new PIXI.Sprite(this.texture);
    slideImg.anchor.set(0.5);
    slideImg.mask = mask;
    this.addChild(slideImg);
    Object.assign(this, { slideImg, mask });
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
    const { mask, slideImg, blur } = this;
    this.positionSelf();
    this.tl_slide = new TimelineMax({ paused: true })
      .set(mask, { width: 1 })
      .set(slideImg.scale, { x: this.initScale, y: this.initScale })
      .set(blur, { blur: 0 })
      .to(mask, 2, { x: -20, width: vw*1.4, ease: Power2.easeInOut }, 0)
      .to(slideImg.scale, 15, { x: "+=0.25", y: "+=0.25" }, 0)
      .to(blur, 4, { blur: 4 }, 10)
  }
  positionSelf() {
    const { slideImg, mask } = this;
    const { vw, vh, cx, cy } = this.app.getBounds();
   /*  if (vh >= vw) {
      slideImg.height = vh+50;
      this.initScale = slideImg.scale.x = slideImg.scale.y;
    } else {
      slideImg.width = vw;
      this.initScale = slideImg.scale.y = slideImg.scale.x;
    } */
    slideImg.width = vw;
    this.initScale = slideImg.scale.y = slideImg.scale.x;
    if(slideImg.height < vh) {
      slideImg.height = vh;
      this.initScale = slideImg.scale.x = slideImg.scale.y;
    }
    this.x = cx;
    this.y = cy;
  }
  // the enter animation
  enter() {
    const { stage, mask } = this;
    const { vw } = this.app.getBounds();
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
    const { stage, mask, blur } = this;
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