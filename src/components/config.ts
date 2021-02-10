type BoundItem = {
  min: number,
  max: number
}
type Bound = {
  x: BoundItem,
  y: BoundItem
}

export const bound: Bound = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 }}