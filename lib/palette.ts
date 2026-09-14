/** Read the CSS source of truth only when setting up browser-side rendering. */
export function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const color = (name: string) => style.getPropertyValue(`--color-${name}`).trim();
  return {
    paper: color("paper"), ink: color("ink"), stage: color("stage"),
    accent: color("accent-500"), pop: color("pop-500"), warm: color("warm-500"),
  };
}
