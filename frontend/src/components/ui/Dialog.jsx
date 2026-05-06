import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { X } from 'lucide-react';
import { Button } from './Button';

/* ── Sheet / Modal ─────────────────────────────────────── */
export function Modal({ open, onOpenChange, title, children, width = '520px' }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease' }}
        />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl focus:outline-none"
          style={{
            width,
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title
              className="text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-elevated)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ── Confirm Delete Dialog ─────────────────────────────── */
export function ConfirmDialog({ open, onOpenChange, onConfirm, loading, productName }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease' }}
        />
        <AlertDialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl focus:outline-none"
          style={{
            width: '420px',
            maxWidth: '95vw',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <AlertDialog.Title className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Delete Product
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{productName}</strong>? This action cannot be undone.
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="danger" loading={loading} onClick={onConfirm} className="!bg-red-600 !text-white hover:!bg-red-500">
                Delete
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
