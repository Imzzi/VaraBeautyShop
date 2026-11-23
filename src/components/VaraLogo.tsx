import React from 'react';

interface VaraLogoProps {
  className?: string;
  variant?: 'full' | 'wordmark' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
  showSubtitle?: boolean;
  subtitleFa?: string;
  subtitleEn?: string;
}

export const VaraLogo: React.FC<VaraLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  subtitleFa = 'ورا بیوتی شاپ',
  subtitleEn
}) => {
  const sizeStyles = {
    sm: {
      imgHeight: 'h-6 sm:h-7',
      titleSize: 'text-xs font-extrabold whitespace-nowrap',
      subSize: 'text-[8.5px]',
      containerGap: 'gap-1.5'
    },
    md: {
      imgHeight: 'h-7 sm:h-8',
      titleSize: 'text-[13px] sm:text-sm font-extrabold whitespace-nowrap',
      subSize: 'text-[9.5px]',
      containerGap: 'gap-2'
    },
    lg: {
      imgHeight: 'h-9 sm:h-11',
      titleSize: 'text-base font-extrabold',
      subSize: 'text-[11px]',
      containerGap: 'gap-2.5'
    },
    xl: {
      imgHeight: 'h-12 sm:h-16',
      titleSize: 'text-xl font-extrabold',
      subSize: 'text-xs',
      containerGap: 'gap-3'
    }
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  // Render the logo image asset
  const logoImage = (
    <img
      src="/vara-logo.svg"
      alt="ورا بیوتی"
      className={`${currentSize.imgHeight} w-auto object-contain select-none transition-transform duration-200`}
      loading="eager"
      decoding="async"
    />
  );

  if (variant === 'wordmark' || variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {logoImage}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${currentSize.containerGap} ${className}`}>
      {logoImage}
      
      {showSubtitle && (
        <div className="vara-logo-caption flex flex-col justify-center border-s border-[#F0E1E4] ps-2.5 ms-0.5 text-right select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-vazir font-semibold tracking-tight text-[#23191E] leading-tight ${currentSize.titleSize}`}>
              {subtitleFa}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C3B58] shrink-0" />
          </div>
          {subtitleEn && (
            <span className={`font-jakarta tracking-[0.12em] text-[#785E67] font-medium uppercase ${currentSize.subSize}`}>
              {subtitleEn}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
