export const setDarkTheme = (dark?: boolean) =>{
  const cls = document.documentElement.classList;
  cls[(dark ??= !cls.contains('dark')) ? 'add' : 'remove']('dark');
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#2D2E32': '#FFFFFF');
}
// 跟随系统
if (window.matchMedia) {
  setDarkTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addListener(evt => setDarkTheme(evt.matches));
}

export const sleep = (t = 0) => new Promise(resolve => setTimeout(resolve, t))


export type AnyFunction<T> = (...args: any[]) => T
export function rafThrottle<T extends AnyFunction<any>>(fn: T): AnyFunction<void> {
  let locked = false
  return function(...args: any[]) {
    if (locked) return
    locked = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}
