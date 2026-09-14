/** 静态透视壁面与掠射光；装饰单独裁剪，不影响标题的 Flip 几何。 */
export default function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-backdrop-wall" />
      <div className="hero-backdrop-floor" />
    </div>
  );
}
