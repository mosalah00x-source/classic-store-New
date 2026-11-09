import type { ReactNode } from 'react';
type Props = { locale: 'ar' | 'en'; messageAr: string; messageEn: string; title: string; icon?: ReactNode };
export function ErrorState({ locale, messageAr, messageEn, title, icon }: Props) {
  const message = locale === 'ar' ? messageAr : messageEn;
  return <section className="state-card state-error" role="alert"><span className="state-icon" aria-hidden="true">{icon ?? '!'}</span><h2>{title}</h2><p>{message}</p></section>;
}