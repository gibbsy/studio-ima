import * as PIXI from "pixi.js"
import bus from "../events/eventBus"
import MouseService from "../events/MouseService"
import Slide from "./Slide"
import { Projects } from "../data/appData"

Math.radians = function (degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
  return radians * 180 / Math.PI;
};

export default class Slideshow extends PIXI.Application {
  constructor(slideDuration) {
    const domElement = document.getElementById('slideshow');
    const initWidth = domElement.offsetWidth;
    const initHeight = domElement.offsetHeight;
    /* let isIE = navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1) || (!!window.MSInputMethodContext && !!document.documentMode) || (navigator.appVersion.indexOf('MSIE 10') !== -1);
    let webGLSupport = PIXI.utils.isWebGLSupported();
    let isLegacy = (isIE || !webGLSupport); */

    super({
      width: initWidth,
      height: initHeight,
      transparent: true,
      autoResize: true,
      resolution: 2
    });
    Object.assign(this, {domElement, initWidth, initHeight})
    this.loaded = 0;
    this.animating = false;
    this.resizing = false;
    this.events = bus;
    this.slides = [];
    this.currentIndex = 0;
    this.numSlides = Projects.length;
    this.slideDuration = slideDuration || 12;

    Projects.forEach(project => {
      let filename = project.hero.url;
      let hero = {
        name: project.id,
        title: project.title,
        path: `/project/${project.id}`,
        url: `static/images/hero-images/${filename}.jpg`
      };
      this.slides.push(hero);
    });
    let stamp = {name: 'stamp', url: 'static/images/brand_stamp.svg'}
    let manifest = [...this.slides, stamp ];
    this.load(manifest, () => {
      setTimeout(() => {
        bus.emit("IMAGES_LOADED");
        bus.emit("PLAY_SLIDESHOW")
      }, 3000);
    })

  }
  load(manifest, callback) {
    this.loader.add(manifest).load(() => {
      callback();
      console.log(this.loader.resources)
      this.init();
    });
    this.loader.onProgress.add((e) => {
      bus.emit("LOAD_PROGRESS", e.progress);
    });
  }
  init() {
    // called after assets have loaded
    const { app, stage, view, ticker, events } = this;
    stage.interactive = true;
    this.domElement.appendChild(view);
    // init mouse listener
    //this.MouseService = new MouseService(stage);
    window.addEventListener("resize", () => {
      let delay = 500;
      // debounce the resize event
      if (this.resizing) {
        window.clearTimeout(this.resizing);
      }
      this.resizing = window.setTimeout(this.onResize.bind(this), delay)
    })
    
    //ticker.add(this.animate, this);
    this.initEvents();
    this.initSlides();
  }
  initEvents() {
    const { events } = this;
    events.on("PLAY_SLIDESHOW", this.play.bind(this));
    events.on("PAUSE_SLIDESHOW", this.pause.bind(this));
  }
  initSlides() {
    const { stage, loader, slides } = this;
    slides.forEach((slide, i) => {
      slide.resource = loader.resources[slide.name];
      slide.slide = new Slide(this, slide.resource.texture, i, this.slideDuration);
    })
    this.currentSlide = this.slides[this.currentIndex].slide;
  }
  play() {
    const { events } = this;
    if(this.animating) {
      return;
    }
    if(this.started) {
      this.tl_slideshow.play();
      let currentSlide = this.slides[this.currentIndex].slide;
      currentSlide.play();
      this.paused = false;
      this.animating = true;
      return;
    }
    this.started = true;
    this.animating = true;
    this.currentSlide.enter();
    this.tl_slideshow = new TimelineMax({repeat: -1})
    .add(() => {
      this.nextSlide() 
    }, this.slideDuration);
  }
  pause() {
    if( this.animating ) {
      this.tl_slideshow.pause();
      let currentSlide = this.slides[this.currentIndex].slide;
      currentSlide.pause();
      this.paused = true;
      this.animating = false;
    }
  }
  nextSlide() {
    const { events } = this;
    let next = this.currentIndex + 1;
    this.currentIndex = next % this.numSlides;
    events.emit("SLIDE_CHANGE", this.currentIndex);
  }
  onResize() {
    const { renderer, view, events } = this;
    const parent = view.parentNode;
    renderer.resize(parent.clientWidth, parent.clientHeight);
    events.emit("WINDOW_RESIZE");
  }
  getBounds() {
    const { screen } = this;
    let vw = screen.width;
    let vh = screen.height;
    let cx = vw / 2;
    let cy = vh / 2;
    return { vw, vh, cx, cy };
  }
  animate(delta) {
    this.events.emit('animate', delta);
  }
}