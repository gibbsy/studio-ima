import { ShockwaveFilter } from "@pixi/filter-shockwave";
// import { getRandomInt, radians } from "../utils";

export default class Slide extends PIXI.Container {
  constructor(app, slideData, index, slideDuration) {
    super();
    const { stage, view, events } = app;
    //const { id, name, path, url } = slideData;
    this.loader = new PIXI.Loader();
    this.ready = false;
    this.loading = false;
    this.onStage = false;
    this.initScale = 0;
    this.leaving = false;
    this.tlReady = false;
    this.slideDuration = slideDuration || 12;
    Object.assign(this, { app, stage, view, events, slideData, index });
    this.initEvents();
    if (index == 0 || index == 1) {
      this.load();
    }
  }
  initEvents() {
    const { events, index } = this;
    console.log(this);
    events.on("SLIDE_CHANGE", e => {
      if (e == index - 1 && !this.loading && !this.ready) {
        this.load();
        console.log("LOAD " + this.slideData.name);
      }
      if (e == index) {
        console.log("hello");
        this.enter();
      } else if (this.onStage) {
        this.leave();
      }
    });
    events.on("WINDOW_RESIZE", () => {
      if (this.onStage) {
        let currentBlur = this.blur.blur;
        let tlPaused = this.tl_slide.paused();
        let tlProgress = this.tl_slide.progress();
        this.tl_slide.kill();
        this.initAnimation();
        if (tlPaused) {
          this.tl_slide.progress(tlProgress);
          this.blur.blur = currentBlur;
        } else {
          this.tl_slide.progress(tlProgress).play();
        }
        console.log("Slide reposition");
      }
    });
  }
  load() {
    const { slideData, index, loader } = this;
    const { events } = this.app;
    this.loading = true;
    loader.add(slideData);
    if (index == 0) {
      loader.onProgress.add(e => {
        events.emit("LOAD_PROGRESS", e.progress);
      });
    }
    loader.onError.add(() => {
      console.log("ERROR LOADING FILE " + slideData.name);
    });
    loader.load((loader, resources) => {
      console.log("LOADED " + resources[slideData.name], index);
      this.resource = resources[slideData.name];
      this.texture = this.resource.texture;
      this.init();
    });
  }
  init() {
    const { events } = this.app;
    this.initGraphics();
    this.initFilters();
    this.initAnimation();
    this.ready = true;
    this.loading = false;
    events.emit("SLIDE_LOADED", this.index);
  }
  initGraphics() {
    const slideImg = new PIXI.Sprite(this.texture);
    slideImg.anchor.set(0.5);
    slideImg.alpha = 0;
    this.addChild(slideImg);
    Object.assign(this, { slideImg });
  }
  initFilters() {
    const { cx, cy } = this.app.getBounds();
    this.blur = new PIXI.filters.BlurFilter(0);
    this.colorMatrix = new PIXI.filters.ColorMatrixFilter();
    this.saturation = -1;
    this.colorMatrix.saturate(this.saturation, false);
    const waveOpts = {
      amplitude: 20,
      wavelength: 400,
      radius: -1
    };
    this.shockwave = new ShockwaveFilter([cx, cy], waveOpts);
    this.slideImg.filters = [this.blur, this.colorMatrix, this.shockwave];
  }
  initAnimation() {
    const { slideImg, blur, events } = this;
    this.positionSelf();
    // this.shockwave.time = 0;
    let that = this;
    this.tl_slide = new gsap.timeline({
      paused: true,
      onUpdate: that.onAnimate,
      callbackScope: that
    })
      .add(() => {
        this.shockwave.time = 0;
        this.saturation = -1;
        this.colorMatrix.saturate(this.saturation, false);
      })
      .set(slideImg, { alpha: 0 })
      .set(slideImg.scale, { x: this.initScale, y: this.initScale })
      .set(blur, { blur: 0 })
      .to(slideImg, 1, { alpha: 1 }, 0)
      .add(() => events.emit("SHOW_CAPTION"), 1.5)
      .add(() => events.emit("ALLOW_SKIP"), 1.6)
      .to(slideImg.scale, this.slideDuration + 3, { x: "+=0.2", y: "+=0.2" }, 0)
      .to(blur, 4, { blur: 4 }, this.slideDuration - 2);
    this.tlReady = true;
  }
  positionSelf() {
    const { slideImg } = this;
    const { vw, vh, cx, cy } = this.app.getBounds();
    slideImg.width = vw;
    this.initScale = slideImg.scale.y = slideImg.scale.x;
    if (slideImg.height < vh) {
      slideImg.height = vh;
      this.initScale = slideImg.scale.x = slideImg.scale.y;
    }
    this.x = cx;
    this.y = cy;
    this.shockwave.center = { x: cx, y: cy };
  }
  enter() {
    const { stage } = this;
    console.log("enter");
    if (this.onStage) {
      return;
    }
    if (this.loading == false && this.ready == false) {
      console.log("LOAD NOT STARTED");
      this.load();
      setTimeout(() => {
        this.enter();
      }, 2000);
      return;
    }
    if (this.loading == true && this.ready == false) {
      console.log("SLIDE NOT READY - LOADING");
      setTimeout(() => {
        this.enter();
      }, 1000);
      return;
    }
    this.onStage = true;
    /*  if (!this.tlReady) {
      this.initAnimation();
    } */
    stage.addChild(this);
    this.tl_slide.restart();
    console.log("ENTER " + this.slideData.name);
  }
  leave() {
    const { stage, index } = this;
    const nextSlide = this.app.slides[index].slide;
    if (nextSlide.ready == false) {
      setTimeout(() => {
        this.leave();
      }, 1000);
      return;
    }
    gsap.to(this.slideImg, 1.2, {
      alpha: 0,
      onComplete: () => {
        console.log(this);
        stage.removeChild(this);
        this.onStage = false;
      }
    });
    /*   this.leaving = setTimeout(() => {
      // this.tl_slide.kill();
    }, 1000); */
  }
  play() {
    this.tl_slide.resume();
    gsap.to(this.blur, 1, { blur: 0 });
  }
  pause() {
    this.tl_slide.pause();
    gsap.to(this.blur, 1, { blur: 6 });
  }
  onAnimate() {
    let progress = this.tl_slide.progress();
    if (this.shockwave.time < 5) {
      this.shockwave.time += 0.02;
    }
    if (progress > 0.05 && this.saturation < 0) {
      this.saturation += 0.05;
      this.colorMatrix.saturate(this.saturation, false);
    }
  }
}
