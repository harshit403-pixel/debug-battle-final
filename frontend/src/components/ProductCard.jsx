import { useState, useEffect } from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { clsx } from 'clsx';

const CATEGORY_COLORS = {
  Electronics: 'text-blue-400 bg-blue-400/10',
  Clothing: 'text-pink-400 bg-pink-400/10',
  Books: 'text-yellow-400 bg-yellow-400/10',
  Food: 'text-green-400 bg-green-400/10',
  Sports: 'text-orange-400 bg-orange-400/10',
  Home: 'text-purple-400 bg-purple-400/10',
  Other: 'text-slate-400 bg-slate-400/10',
};

function stockBadge(stock) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'text-red-400 bg-red-400/10' };
  if (stock <= 10) return { label: `Low (${stock})`, cls: 'text-yellow-400 bg-yellow-400/10' };
  return { label: `${stock} in stock`, cls: 'text-emerald-400 bg-emerald-400/10' };
}

export function ProductCard({ product, onEdit, onDelete }) {
  const { label: stockLabel, cls: stockCls } = stockBadge(product.stock ?? 0);
  const catCls = CATEGORY_COLORS[product.category] || CATEGORY_COLORS.Other;

  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (clicks > 0) {
        console.log(`Product clicked ${clicks} times`);
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [clicks]);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Image */}
      <div 
        className="relative h-44 flex items-center justify-center overflow-hidden" 
        style={{ background: 'var(--bg-base)', cursor: 'pointer' }}
        onClick={() => setClicks(clicks + 1)}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={clsx(
            'absolute inset-0 flex-col items-center justify-center gap-2',
            product.image ? 'hidden' : 'flex'
          )}
        >
          <Package size={36} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No image</span>
        </div>

        {/* Action overlay on hover */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(product)}
            className="rounded-lg p-1.5 shadow transition-all hover:scale-110"
            style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="rounded-lg p-1.5 shadow transition-all hover:scale-110"
            style={{ background: 'var(--bg-card)', color: 'var(--danger)' }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
          {product.category && (
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap', catCls)}>
              {product.category}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold" style={{ color: 'var(--accent-hover)' }}>
            ${Number(product.price).toFixed(2)}
          </span>
          {product.stock !== undefined && product.stock !== null && (
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', stockCls)}>
              {stockLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
