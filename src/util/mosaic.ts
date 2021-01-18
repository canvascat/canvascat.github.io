type Point = [number, number];

export interface MosaicOptions {
  mosaicSize?: number;
  brushWidth?: number;
}

export default class Mosaic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  originalImgData: Nullable<ImageData> = null;
  downPoint: Nullable<Point> = null;
  points: Array<Point> = [];
  ops = [];
  // mosaicCount = 4
  mosaicSize = 3;
  brushWidth = 40; // 笔刷宽度

  constructor(canvas: HTMLCanvasElement, options: MosaicOptions = {}) {
    Object.assign(this, options);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.documentMouseMoveHandle = this.documentMouseMoveHandle.bind(this);
    this.documentMouseUpHandle = this.documentMouseUpHandle.bind(this);
    canvas.addEventListener('mousedown', this.mouseDownHandler);
  }

  async init(file: Blob) {
    await drawImageToCanvas(this.canvas, file);
    const { width, height } = this.canvas;
    this.originalImgData = this.ctx.getImageData(0, 0, width, height);
  }

  destroy() {
    this.canvas.onmousedown = null;
    this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
  }

  mouseDownHandler(e: MouseEvent) {
    e.stopImmediatePropagation();
    document.onselectstart = () => false;
    this.downPoint = [
      e.pageX - this.canvas.offsetLeft,
      e.pageY - this.canvas.offsetTop,
    ];
    this.points = [];
    document.addEventListener('mousemove', this.documentMouseMoveHandle);
    document.addEventListener('mouseup', this.documentMouseUpHandle);
  }

  documentMouseMoveHandle(e: MouseEvent) {
    if (!this.downPoint) return;
    e.stopImmediatePropagation();
    const point: Point = [
      e.pageX - this.canvas.offsetLeft,
      e.pageY - this.canvas.offsetTop,
    ];
    this.dealMosaicXY(point);
  }
  documentMouseUpHandle(e: MouseEvent) {
    this.downPoint = null;
    document.removeEventListener('mousemove', this.documentMouseMoveHandle);
    document.removeEventListener('mouseup', this.documentMouseUpHandle);
    document.onselectstart = null;
    // this.ops.push({
    //   action: 'mosaic',
    //   attribute: {
    //     size: this.mosaicSize,
    //     num: this.mosaicCount,
    //     brushWidth: this.brushWidth
    //   },
    //   path: this.points
    // })
    this.points = [];
  }
  dealMosaicXY(point: Point) {
    const offSet =
      this.brushWidth -
      ~~(this.brushWidth / this.mosaicSize / 2) * this.mosaicSize * 2;
    let [x0, y0] = point;
    // 将坐标偏移到最近的网格上
    x0 = +Math.round((x0 - offSet) / this.mosaicSize / 2) * this.mosaicSize * 2;
    y0 = +Math.round((y0 - offSet) / this.mosaicSize / 2) * this.mosaicSize * 2;
    point = [x0, y0];
    // 记录像素轨迹
    const lastXY = this.points.slice(-1)[0];
    if (lastXY && lastXY[0] === x0 && lastXY[1] === y0) return;
    if (this.points.findIndex((xy) => xy[0] === x0 && xy[1] === y0) !== -1)
      return;
    this.points.push(point);
    this.drawMosaic(point);
  }
  // 马赛克方格宽 2*MOSAIC_SIZE
  drawMosaic(point: Point) {
    const { mosaicSize: size, brushWidth } = this;
    const num = ~~(brushWidth / size / 2);
    const offSet = brushWidth - num * size * 2;
    // canvas 宽高
    const { width, height } = this.canvas;
    // 源文件像素数据
    const originalPxData = (this.originalImgData as ImageData).data;

    // 复制一份进行计算
    const modifyImgData = this.ctx.getImageData(0, 0, width, height);
    let modifyPxData = modifyImgData.data;
    const [x0, y0] = point;
    for (
      var x1 = x0 - size * num, maxX1 = x0 + size * num + offSet;
      x1 < maxX1;
      x1 += 2 * size
    ) {
      for (
        var y1 = y0 - size * num, maxY1 = y0 + size * num + offSet;
        y1 < maxY1;
        y1 += 2 * size
      ) {
        // (x1, y1) 为每个像素点的基准坐标
        // 计算出已 (x1, y1) 为基准坐标的马赛克块内的平均 RGB 值
        let [sumR, sumG, sumB] = [0, 0, 0];
        let pixelIndexList = [];
        for (let x = x1, maxX = x1 + 2 * size; x < maxX; x++) {
          for (let y = y1, maxY = y1 + 2 * size; y < maxY; y++) {
            const pixelIndex = (y * width + x) * 4;
            // 圆形边界判断条件，可以让笔触边缘为圆角，之后只给圆内的像素点调整颜色
            if (
              (y - y0 + offSet / 2) ** 2 + (x - x0 + offSet / 2) ** 2 <=
              (brushWidth / 2) ** 2
            ) {
              pixelIndexList.push(pixelIndex);
            }
            sumR += originalPxData[pixelIndex];
            sumG += originalPxData[pixelIndex + 1];
            sumB += originalPxData[pixelIndex + 2];
          }
        }
        const pixelTotlal = (2 * size) ** 2; // pixelIndexList.length // 单个马赛克的像素点数量
        const [avgR, avgG, avgB] = [
          sumR / pixelTotlal,
          sumG / pixelTotlal,
          sumB / pixelTotlal,
        ];

        for (let x = 0; x < pixelIndexList.length; x++) {
          const pixelIndex = pixelIndexList[x];
          modifyPxData[pixelIndex] = avgR;
          modifyPxData[pixelIndex + 1] = avgG;
          modifyPxData[pixelIndex + 2] = avgB;
        }
      }
    }
    this.ctx.putImageData(modifyImgData, 0, 0, 0, 0, width, height);
  }
}

export const loadLocalImage = () =>
  new Promise((resolve: (file: File) => void, reject: () => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const { files } = input;
      if (!files || files.length <= 0) reject();
      const file = Array.from(files as FileList)[0];
      file.type.startsWith('image/') ? resolve(file) : reject();
    };
    input.click();
  });

export const drawImageToCanvas = (canvas: HTMLCanvasElement, file: Blob) =>
  new Promise((resolve: (canvas: HTMLCanvasElement) => void, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      Object.assign(canvas, { width, height });
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = (event) => {
      reject(event);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });