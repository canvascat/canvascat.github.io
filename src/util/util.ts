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