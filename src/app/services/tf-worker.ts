declare class OffscreenCanvas {
  constructor(n1: number, n2: number);
}

const ctx: any = self as any;

ctx.document = {
  createElement: () => {
    return new OffscreenCanvas(640, 480);
  },
};
ctx.window = {
  screen: {
    width: 640,
    height: 480,
  },
};
ctx.HTMLVideoElement = () => {};
ctx.HTMLImageElement = () => {};
ctx.HTMLCanvasElement = () => {};
