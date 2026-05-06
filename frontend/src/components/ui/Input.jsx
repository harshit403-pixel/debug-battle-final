import { clsx } from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
          'bg-[var(--bg-base)] border border-[var(--border)]',
          'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
          'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30',
          error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});
