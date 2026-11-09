import type { ReactNode } from 'react';
type Props = { title: string; message: string; icon?: ReactNode };
export function LoadingState({ title, message, icon }: Props) {
  return <section className="state-card" aria-live="polite"><span className="state-icon" aria-hidden="true">{icon ?? '◌'}</span><h2>{title}</h2><p>{message}</p></section>;
}