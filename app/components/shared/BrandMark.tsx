/** 原始笔刷轮廓作透明蒙版，颜色继承品牌文字，不再维护逐色位图。 */
export default function BrandMark({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`brand-mark block shrink-0 ${className}`} />;
}
