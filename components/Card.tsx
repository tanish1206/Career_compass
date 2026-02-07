import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 ${
        hover ? 'hover:bg-[var(--card-hover)] hover:border-blue-500/30 transition-all cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
