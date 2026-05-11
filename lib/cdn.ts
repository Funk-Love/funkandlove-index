/**
 * 阿里云 OSS 图片处理:URL 后挂处理参数,
 * 限宽 3840(原图 6000+ 浪费带宽)+ Q100 webp(无视觉损失,体积仍小于原 jpg)。
 *
 * 本地 dev:Next 静态服务器忽略未知 query,直接吐回原图,无副作用。
 * 生产 OSS:命中 image processing,¥0.025/千次,结果端缓存。
 *
 * 不处理:外部 URL、ico/svg/webp、空字符串、已含 x-oss-process 的路径。
 * (LQIP 占位走 scripts/gen-lqip.mjs 预生成的 .webp 静态文件,不进 OSS 处理。)
 */
const SUFFIX = '?x-oss-process=image/resize,w_3840,limit_1/format,webp/quality,Q_100';

export function asset(path?: string): string | undefined {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;

  const queryIndex = path.indexOf('?');
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : path.slice(queryIndex);
  const encodedPathname = pathname
    .split('/')
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join('/');

  return encodedPathname + query;
}

export function oss(path?: string): string | undefined {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (/\.(svg|ico|webp)$/i.test(path)) return path;
  if (path.includes('x-oss-process=')) return path;
  return asset(path + SUFFIX);
}
