type Point = [number, number]

const ARROW_ANGLE = Math.PI / 6;

export function drawArrow(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, width: number, fillStyle: CanvasFillStrokeStyles["fillStyle"]) {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;
  const alpha = Math.atan((y1 - y1) / (x1 - x2));
  const minArrowHeight = Math.abs((x2 - x1) / (Math.cos(alpha) * Math.cos(ARROW_ANGLE)));
  const arrowHeight = Math.min(minArrowHeight, 10 + width * 5)
  const d = x2 < x1 ? -1 : 1;
  const [x3, y3] = [
    x2 - Math.cos(alpha - ARROW_ANGLE) * arrowHeight * d,
    y2 - Math.sin(alpha - ARROW_ANGLE) * arrowHeight * d
  ];
  const [x4, y4] = [
    x2 - Math.cos(alpha + ARROW_ANGLE) * arrowHeight * d,
    y2 - Math.sin(alpha + ARROW_ANGLE) * arrowHeight * d
  ]
  const [xa, ya] = [(x4 - x3) / 3, (y4 - y3) / 3];
  const [x5, y5] = [x3 + xa, y3 + ya];
  const [x6, y6] = [x3 - xa, y3 - ya];
  const paths: Array<Point> = [[x1, y1], [x5, y5], [x3, y3], [x2, y2], [x4, y4], [x6, y6]]
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  paths.slice(1).forEach(point => ctx.lineTo(...point))
  ctx.closePath()
  ctx.fillStyle = fillStyle
  ctx.fill()
}

export function drawLine(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, lineWidth: number, strokeStyle: CanvasFillStrokeStyles["strokeStyle"]) {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.lineCap = 'round'
  ctx.beginPath();
  ctx.moveTo(...startPoint);
  ctx.lineTo(...endPoint);
  ctx.stroke()
}

export function drawRect(ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, lineWidth: number, strokeStyle: CanvasFillStrokeStyles["strokeStyle"]) {
  const [[x1, y1], [x2, y2]] = [startPoint, endPoint]
  const paths: Array<Point> = [startPoint, [x1, y2], endPoint, [x2, y1]]
  ctx.moveTo(...startPoint)
  paths.slice(1).forEach(point => ctx.lineTo(...point))
  ctx.closePath()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = strokeStyle
  ctx.stroke()
}

export function drawEllipse (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point, lineWidth: number, strokeStyle: CanvasFillStrokeStyles["strokeStyle"]) {
  const [[x1, y1], [x2, y2]] = [startPoint, endPoint];
  const [r1, r2] = [x1 - x2, y1 - y2].map(n => Math.abs(n / 2));
  const [x0, y0] = [(x1 + x2) / 2, (y1 + y2) / 2];
  const r = Math.max(r1, r2)
  const [rx, ry] = [r1 / r, r2 / r]
  ctx.save()
  ctx.scale(rx, ry)
  ctx.beginPath()
  ctx.arc(x0 / rx, y0 / ry, r, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.restore()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = strokeStyle
  ctx.stroke()
}

export function drawCurve(ctx: CanvasRenderingContext2D, paths: Array<Point>, lineWidth: number, strokeStyle: CanvasFillStrokeStyles["strokeStyle"]) {
  if (paths.length < 2) return
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.lineCap = 'round'
  ctx.beginPath();
  let startPoint = paths[0]
  ctx.moveTo(...startPoint)
  for (let i = 1; i < paths.length - 1; i++) {
    const [controlPoint, nextPoint] = paths.slice(i, i + 2)
    const endPoint: Point = [(nextPoint[0] - controlPoint[0]) / 2, (nextPoint[1] - controlPoint[1]) / 2];
    ctx.quadraticCurveTo(...controlPoint, ...endPoint);
    startPoint = endPoint
  }
  ctx.lineTo(...paths.slice(-1)[0])
  ctx.stroke()
  ctx.closePath()
}
