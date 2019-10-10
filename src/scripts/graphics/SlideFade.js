import bus from '../events/eventBus';
import { ShockwaveFilter } from '@pixi/filter-shockwave';

export default class SlideFade extends PIXI.Container {
  constructor(app, texture, order, slideDuration) {
    super();
    const { stage, view, events } = app;
    this.ready = false;
    this.onStage = false;   
    this.initScale = 0;
    this.leaving = false;
    this.slideDuration = slideDuration || 12;
    Object.assign(this, { app, stage, view, events, texture, order }); 
    this.init();
  }
  init() {
    this.initGraphics();
    this.initFilters();
    this.initEvents();
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
    const { cx, cy } = this.app.getBounds();
    this.blur = new PIXI.filters.BlurFilter(0);
    const waveOpts = {
      amplitude: 20,
      wavelength: 400,
      radius: -1
    }
    this.shockwave = new ShockwaveFilter([cx, cy], waveOpts );
    this.slideImg.filters = [this.blur, this.shockwave];
  }
  initEvents() {
    const { events, order } = this;
    events.on("SLIDE_CHANGE", (e) => {
      if (e == order) {
        this.enter();
        console.log("ENTER");

      } else if (this.onStage) {
          this.leave()
      }
    })
    bus.on("WINDOW_RESIZE", () => {
      if(this.onStage) {
        let currentBlur = this.blur.blur;
        let tlPaused = this.tl_slide.paused();
        let tlProgress = this.tl_slide.progress();
        this.tl_slide.kill();
        this.initAnimation();
        if(tlPaused) {
          this.tl_slide.progress(tlProgress);
          this.blur.blur = currentBlur;
        } else {
          this.tl_slide.progress(tlProgress).play();
        }
        console.log('Slide reposition');
      }
    })
  }
  initAnimation() {
    const { slideImg, blur } = this;
    this.positionSelf();
    this.shockwave.time = 0;
    let that = this;
    this.tl_slide = new TimelineMax({ paused: true, onUpdate: that.onAnimate, onUpdateScope: that })
      .set(slideImg, {alpha: 0})
      .set(slideImg.scale, { x: this.initScale, y: this.initScale })
      .set(blur, { blur: 0 })
      .to(slideImg, 1, {alpha: 1}, 0)
      .to(slideImg.scale, this.slideDuration + 3, { x: "+=0.2", y: "+=0.2" }, 0)
      .to(blur, 4, { blur: 4 }, this.slideDuration - 2)
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
    this.shockwave.center = {x: cx, y: cy};
  }
  enter() {
    const { stage } = this;
    if (this.onStage) {
      return;
    }
    this.onStage = true;
    this.initAnimation();
    stage.addChild(this);
    this.tl_slide.restart();    
  }
  leave() {
    const { stage } = this;
    this.leaving = setTimeout(() => {
      console.log(this);
      stage.removeChild(this);
      this.onStage = false;     
      this.tl_slide.kill(); 
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
  onAnimate() {
    if (this.shockwave.time < 5) {
      this.shockwave.time += 0.02;
    }    
  }
}