import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
      nums.push(i);
    } else if (nums[nums.length - 1] !== '…') {
      nums.push('…');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft size={14} />
      </Button>

      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm" style={{ color: 'var(--text-muted)' }}>…</span>
        ) : (
          <button
            onClick={() => onPageChange(n)}
            className="min-w-[32px] h-8 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: n === page ? 'var(--accent)' : 'var(--bg-elevated)',
              color: n === page ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${n === page ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {n}
          </button>
        )
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
      >
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}
