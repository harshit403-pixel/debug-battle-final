import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, LayoutGrid, List, Package, RefreshCw, Edit2, Trash2,
} from 'lucide-react';
import * as Separator from '@radix-ui/react-separator';
import { productService } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import { ConfirmDialog } from './ui/Dialog';
import { Pagination } from './Pagination';
import { Button } from './ui/Button';
import { CategorySelect } from './ui/CategorySelect';

const LIMIT = 12;

function StatBadge({ label, value, accent }) {
  return (
    <div
      className="flex flex-col gap-0.5 px-4 py-3 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-xl font-bold" style={{ color: accent || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export function Dashboard() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      const res = await productService.getAll(params);
      const { data, total, pages } = res.data;
      setProducts(data);
      setMeta({ total, page, pages });
    } catch {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, category, page, search]);

  useEffect(() => {
    const id = setTimeout(fetchProducts, search ? 400 : 0);
    return () => clearTimeout(id);
  }, [fetchProducts, search]);

  function handleEdit(product) {
    setEditProduct(product);
    setFormOpen(true);
  }

  function handleDelete(product) {
    setDeleteTarget(product);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await productService.delete(deleteTarget._id);
      addToast('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      addToast('Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleAddNew() {
    setEditProduct(null);
    setFormOpen(true);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent-muted)' }}
          >
            <Package size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>ProductHub</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Product Management</p>
          </div>
        </div>
        <Button onClick={handleAddNew}>
          <Plus size={15} />
          Add Product
        </Button>
      </header>

      <main className="px-6 py-6 max-w-screen-xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in">
          <StatBadge label="Total Products" value={meta.total} accent="var(--accent-hover)" />
          <StatBadge label="Page" value={`${meta.page} / ${meta.pages}`} />
          <StatBadge label="Showing" value={products.length} />
        </div>

        <Separator.Root
          className="mb-5"
          style={{ height: '1px', background: 'var(--border)' }}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm transition-all duration-200 focus:outline-none"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <CategorySelect
              value={category}
              onValueChange={(v) => { setCategory(v); setPage(1); }}
              placeholder="All Categories"
              includAll
            />
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => { setSearch(''); setCategory(''); setPage(1); }}
            title="Clear filters"
          >
            <RefreshCw size={14} />
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              const sortedProducts = [...products].sort((a, b) => Number(a.price) - Number(b.price));
              setProducts(sortedProducts);
            }}
            title="Sort by Price"
          >
            Sort
          </Button>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[{ v: 'grid', Icon: LayoutGrid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-2 transition-colors"
                style={{
                  background: view === v ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 border-t-transparent"
              style={{ borderColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }}
            />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <EmptyState onAdd={handleAddNew} />
        ) : view === 'grid' ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <ListView products={products} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <Pagination page={meta.page} pages={meta.pages} onPageChange={setPage} />
      </main>

      {/* Modals */}
      <ProductForm
        key={`${editProduct?._id || 'new'}-${formOpen ? 'open' : 'closed'}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        onSuccess={fetchProducts}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        productName={deleteTarget?.name}
      />
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-4 animate-fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <Package size={28} style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>No products found</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add your first product to get started</p>
      </div>
      <Button onClick={onAdd}>
        <Plus size={14} />
        Add Product
      </Button>
    </div>
  );
}

/* ── List view ───────────────────────────────────────────── */
function ListView({ products, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="grid text-xs font-medium px-4 py-2 rounded-lg"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
          color: 'var(--text-muted)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span className="text-right">Actions</span>
      </div>
      {products.map((p) => (
        <div
          key={p._id}
          className="grid items-center px-4 py-3 rounded-xl text-sm animate-fade-in"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center gap-3">
            {p.image ? (
              <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--bg-base)' }}
              >
                <Package size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            )}
            <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
          </div>
          <span style={{ color: 'var(--text-secondary)' }}>{p.category || '—'}</span>
          <span className="font-semibold" style={{ color: 'var(--accent-hover)' }}>${Number(p.price).toFixed(2)}</span>
          <span style={{ color: (p.stock ?? 0) === 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
            {p.stock ?? 0}
          </span>
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => onEdit(p)}
              className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ color: 'var(--accent)' }}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDelete(p)}
              className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ color: 'var(--danger)' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
