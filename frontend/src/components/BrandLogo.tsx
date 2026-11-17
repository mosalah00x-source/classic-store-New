import Link from 'next/link';

type BrandLogoProps = {
  locale: string;
  footer?: boolean;
};

export function BrandLogo({ locale, footer = false }: BrandLogoProps) {
  return (
    <Link href={`/${locale}`} aria-label="ClassicStore">
      <span className={footer ? 'logo-img logo-img-footer' : 'logo-img'} aria-hidden="true" />
    </Link>
  );
}
