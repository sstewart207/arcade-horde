import { Arena } from "./Constants.js";

const referenceWidth = 1280;
const referenceHeight = 720;
const maximumPixelRatio = 2;

export class Viewport {
  #canvas;
  #scale = 1;
  #pixelRatio = 1;

  constructor(canvas) {
    this.#canvas = canvas;
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
  }

  get scale() {
    return this.#scale;
  }

  get pixelRatio() {
    return this.#pixelRatio;
  }

  toWorldPoint(clientX, clientY) {
    const bounds = this.#canvas.getBoundingClientRect();
    return {
      x: Arena.left + (clientX - bounds.left) / this.#scale,
      y: Arena.top + (clientY - bounds.top) / this.#scale,
    };
  }

  resize = () => {
    const cssWidth = Math.max(1, window.innerWidth);
    const cssHeight = Math.max(1, window.innerHeight);
    this.#scale = Math.min(cssWidth / referenceWidth, cssHeight / referenceHeight);
    this.#pixelRatio = Math.min(window.devicePixelRatio || 1, maximumPixelRatio);

    Arena.width = cssWidth / this.#scale;
    Arena.height = cssHeight / this.#scale;
    Arena.left = (referenceWidth - Arena.width) / 2;
    Arena.top = (referenceHeight - Arena.height) / 2;
    Arena.right = Arena.left + Arena.width;
    Arena.bottom = Arena.top + Arena.height;
    Arena.centerX = (Arena.left + Arena.right) / 2;
    Arena.centerY = (Arena.top + Arena.bottom) / 2;
    this.#canvas.width = Math.round(cssWidth * this.#pixelRatio);
    this.#canvas.height = Math.round(cssHeight * this.#pixelRatio);
  };
}
