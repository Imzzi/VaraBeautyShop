import { useState, type ImgHTMLAttributes } from 'react';
import { DEFAULT_PRODUCT_IMAGE, isPackShot } from '../lib/productImages';

export function ProductImage({ src, alt, className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const image = !src || failedSrc === src ? DEFAULT_PRODUCT_IMAGE : src;
  const fallback = image === DEFAULT_PRODUCT_IMAGE;
  return (
    <img
      {...props}
      src={image}
      srcSet={fallback ? undefined : props.srcSet}
      alt={fallback ? 'تصویر محصول در دسترس نیست' : alt}
      className={`${className} ${fallback ? 'vara-image-fallback' : isPackShot(image) ? 'vara-packshot' : ''}`}
      onError={(event) => { setFailedSrc(src); props.onError?.(event); }}
    />
  );
}
