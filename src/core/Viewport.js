import { Arena } from "./Constants.js";

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
      x: (clientX - bounds.left) / this.#scale,
      y: (clientY - bounds.top) / this.#scale,
    };
  }

  resize = () => {
    const cssWidth = Math.max(1, window.innerWidth);
    const cssHeight = Math.max(1, window.innerHeight);
    this.#scale = cssHeight / referenceHeight;
    this.#pixelRatio = Math.min(window.devicePixelRatio || 1, maximumPixelRatio);

    Arena.width = cssWidth / this.#scale;
    Arena.height = referenceHeight;
    this.#canvas.width = Math.round(cssWidth * this.#pixelRatio);
    this.#canvas.height = Math.round(cssHeight * this.#pixelRatio);
  };
}
