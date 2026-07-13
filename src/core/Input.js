export class Input {
  #canvas;
  #pressedKeys = new Set();
  #pointer = { x: 0, y: 0 };
  #dashRequested = false;
  #restartRequested = false;
  #isPrimaryHeld = false;

  constructor(canvas) {
    this.#canvas = canvas;
    window.addEventListener("keydown", this.#onKeyDown);
    window.addEventListener("keyup", this.#onKeyUp);
    window.addEventListener("blur", this.#onBlur);
    canvas.addEventListener("pointermove", this.#onPointerMove);
    canvas.addEventListener("pointerdown", this.#onPointerDown);
    window.addEventListener("pointerup", this.#onPointerUp);
  }

  destroy() {
    window.removeEventListener("keydown", this.#onKeyDown);
    window.removeEventListener("keyup", this.#onKeyUp);
    window.removeEventListener("blur", this.#onBlur);
    this.#canvas.removeEventListener("pointermove", this.#onPointerMove);
    this.#canvas.removeEventListener("pointerdown", this.#onPointerDown);
    window.removeEventListener("pointerup", this.#onPointerUp);
  }

  getMovementDirection() {
    const x = Number(this.#isDown("KeyD") || this.#isDown("ArrowRight")) - Number(this.#isDown("KeyA") || this.#isDown("ArrowLeft"));
    const y = Number(this.#isDown("KeyS") || this.#isDown("ArrowDown")) - Number(this.#isDown("KeyW") || this.#isDown("ArrowUp"));
    const length = Math.hypot(x, y);

    return length === 0 ? { x: 0, y: 0 } : { x: x / length, y: y / length };
  }

  getPointerPosition() {
    return this.#pointer;
  }

  consumeDashRequest() {
    const requested = this.#dashRequested;
    this.#dashRequested = false;
    return requested;
  }

  consumeRestartRequest() {
    const requested = this.#restartRequested;
    this.#restartRequested = false;
    return requested;
  }

  get isPrimaryHeld() {
    return this.#isPrimaryHeld;
  }

  #isDown(code) {
    return this.#pressedKeys.has(code);
  }

  #onKeyDown = (event) => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
      event.preventDefault();
    }

    if (event.code === "Space" && !event.repeat) {
      this.#dashRequested = true;
    }

    if (event.code === "KeyR" && !event.repeat) {
      this.#restartRequested = true;
    }

    this.#pressedKeys.add(event.code);
  };

  #onKeyUp = (event) => {
    this.#pressedKeys.delete(event.code);
  };

  #onBlur = () => {
    this.#pressedKeys.clear();
    this.#dashRequested = false;
    this.#restartRequested = false;
    this.#isPrimaryHeld = false;
  };

  #onPointerMove = (event) => {
    const bounds = this.#canvas.getBoundingClientRect();
    this.#pointer = {
      x: (event.clientX - bounds.left) * (this.#canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (this.#canvas.height / bounds.height),
    };
  };

  #onPointerDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    this.#onPointerMove(event);
    this.#isPrimaryHeld = true;
    this.#canvas.setPointerCapture?.(event.pointerId);
  };

  #onPointerUp = (event) => {
    if (event.button === 0) {
      this.#isPrimaryHeld = false;
    }
  };
}
