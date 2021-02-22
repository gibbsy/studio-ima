import * as PIXI from "pixi.js";
import bus from "../events/eventBus";
import Slide from "./Slide";
import imageUrlBuilder from "@sanity/image-url";
import sanity from "../data/sanity";
const urlBuilder = imageUrlBuilder(sanity);

Math.radians = function(degrees) {
  return (degrees * Math.PI) / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};

function urlFor(source) {
  return urlBuilder.image(source);
}

export default class Slideshow extends PIXI.Application {
  constructor(projects, slideDuration, isMobile) {
    const domElement = document.getElementById("slideshow");
    const initWidth = domElement.offsetWidth;
    const initHeight = domElement.offsetHeight;

    super({
      width: initWidth,
      height: initHeight,
      transparent: true,
      autoResize: true,
      resolution: 2
    });
    Object.assign(this, { domElement, initWidth, initHeight, isMobile });
    this.loaded = 0;
    this.animating = false;
    this.resizing = false;
    this.transitioning = false;
    this.events = bus;
    this.slides = [];
    this.currentIndex = 0;
    this.numSlides = 0;
    this.slideDuration = slideDuration || 12;

    // let imgRes = this.isMobile ? "mob" : "hd";

    projects.forEach(project => {
      console.log(project);
      let hero = {
        id: project._id,
        name: project.title,
        path: `/project/${project.id}`,
        url: urlFor(project.heroImage)
          .width(initWidth)
          .height(initHeight)
          .dpr(2)
          .format("jpg")
          .quality(40)
          .url()
      };
      this.slides.push(hero);

      this.numSlides = this.slides.length;
    });
    // let manifest = [...this.slides];
    /* this.load(manifest, () => {
      setTimeout(() => {
        bus.emit("IMAGES_LOADED");
        bus.emit("PLAY_SLIDESHOW")
      }, 3000);
    })
 */
    this.init();
  }
  init() {
    const { stage, view } = this;
    stage.interactive = true;
    this.domElement.appendChild(view);
    window.addEventListener("resize", () => {
      let delay = 500;
      // debounce the resize event
      if (this.resizing) {
        window.clearTimeout(this.resizing);
      }
      this.resizing = window.setTimeout(this.onResize.bind(this), delay);
    });

    //ticker.add(this.animate, this);
    this.initEvents();
    this.initSlides();
  }
  initEvents() {
    const { events } = this;
    events.on("SLIDE_LOADED", i => {
      if (i == 0) {
        setTimeout(() => {
          events.emit("IMAGES_LOADED");
          this.play();
        }, 2200);
      }
    });
    events.on("PLAY_SLIDESHOW", this.play.bind(this));
    events.on("PAUSE_SLIDESHOW", this.pause.bind(this));
    events.on("NEXT_SLIDE", this.nextSlide.bind(this));
    events.on("PREV_SLIDE", this.prevSlide.bind(this));
  }
  initSlides() {
    const { slides } = this;
    slides.forEach((slide, i) => {
      //slide.resource = loader.resources[slide.name];
      slide.slide = new Slide(this, slide, i, this.slideDuration);
    });
    this.currentSlide = this.slides[this.currentIndex].slide;
  }
  play() {
    // const { events } = this;
    if (this.animating) {
      return;
    }
    if (this.started) {
      this.tl_slideshow.play();
      let currentSlide = this.slides[this.currentIndex].slide;
      currentSlide.play();
      this.paused = false;
      this.animating = true;
      return;
    }
    console.log("PLAY");

    this.started = true;
    this.animating = true;
    this.currentSlide.enter();
    this.tl_slideshow = new gsap.timeline().add(() => {
      this.nextSlide();
    }, this.slideDuration);
  }
  pause() {
    if (this.animating) {
      this.tl_slideshow.pause();
      let currentSlide = this.slides[this.currentIndex].slide;
      currentSlide.pause();
      this.paused = true;
      this.animating = false;
    }
  }
  prevSlide() {
    const { events } = this;
    if (this.currentIndex == 0) {
      return;
    }
    if (this.transitioning) {
      return;
    }
    this.transitioning = true;
    let prev = this.currentIndex - 1;
    this.currentIndex = prev % this.numSlides;
    events.emit("SLIDE_CHANGE", this.currentIndex);
    this.tl_slideshow.restart();
    events.on("ALLOW_SKIP", () => {
      this.transitioning = false;
    });
  }
  nextSlide() {
    const { events } = this;
    if (this.transitioning) {
      return;
    }
    this.transitioning = true;
    let next = this.currentIndex + 1;
    this.currentIndex = next % this.numSlides;
    events.emit("SLIDE_CHANGE", this.currentIndex);
    this.tl_slideshow.restart();
    events.on("ALLOW_SKIP", () => {
      this.transitioning = false;
    });
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
    this.events.emit("animate", delta);
  }
}
