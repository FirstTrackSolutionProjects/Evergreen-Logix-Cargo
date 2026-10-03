import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import styles from './ActionMenu.module.css';

interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
}

const VIEWPORT_PADDING = 8; // min gap from any viewport edge
const GAP = 4;              // gap between trigger and menu

export function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: 'bottom' | 'top';
  } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Compute the menu position from the trigger's current bounding rect.
   * Flips vertically if there's not enough room below and more room above,
   * and clamps horizontally so the menu stays inside the viewport.
   */
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu?.getBoundingClientRect();
    const menuWidth = menuRect?.width ?? 180;   // fallback
    const menuHeight = menuRect?.height ?? 0;   // 0 on first paint → prefer bottom

    const spaceBelow = window.innerHeight - triggerRect.bottom - GAP - VIEWPORT_PADDING;
    const spaceAbove = triggerRect.top - GAP - VIEWPORT_PADDING;

    // Flip up only if there's not enough room below AND more room above.
    const placement: 'bottom' | 'top' =
      menuHeight > spaceBelow && spaceAbove > spaceBelow ? 'top' : 'bottom';

    const top =
      placement === 'bottom'
        ? triggerRect.bottom + GAP
        : triggerRect.top - GAP - menuHeight;

    // Right-align the menu to the trigger's right edge, then clamp to viewport.
    let left = triggerRect.right - menuWidth;
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - menuWidth - VIEWPORT_PADDING),
    );

    setCoords({ top, left, placement });
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // First paint: measure, then position. Second paint: adjust if menu is clipped.
  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    reposition();
    // Re-measure on next frame in case the menu's height changed after first paint.
    const raf = requestAnimationFrame(reposition);
    return () => cancelAnimationFrame(raf);
  }, [open, reposition]);

  // Keep the menu anchored to the row through scroll, resize, and layout changes.
  useEffect(() => {
    if (!open) return;

    let rafId = 0;
    const scheduleReposition = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(reposition);
    };

    // capture: true catches scrolls inside the DataTable wrapper, not just window scrolls.
    window.addEventListener('scroll', scheduleReposition, true);
    window.addEventListener('resize', scheduleReposition);

    // Also watch for layout shifts (table height changes, sidebar toggles, etc.).
    const observer = new ResizeObserver(scheduleReposition);
    if (triggerRef.current) observer.observe(triggerRef.current);

    // And any scrollable ancestors (e.g. the DataTable wrapper).
    const scrollParents: HTMLElement[] = [];
    let el: HTMLElement | null = triggerRef.current?.parentElement ?? null;
    while (el) {
      const style = getComputedStyle(el);
      if (/(auto|scroll|overlay)/.test(style.overflowY + style.overflowX)) {
        scrollParents.push(el);
        el.addEventListener('scroll', scheduleReposition, { passive: true });
      }
      el = el.parentElement;
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleReposition, true);
      window.removeEventListener('resize', scheduleReposition);
      observer.disconnect();
      scrollParents.forEach((p) => p.removeEventListener('scroll', scheduleReposition));
    };
  }, [open, reposition]);

  if (items.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={`${styles.menu} ${coords?.placement === 'top' ? styles.menuUp : styles.menuDown}`}
            role="menu"
            style={{
              position: 'fixed',
              top: coords?.top ?? -9999,   // off-screen until measured
              left: coords?.left ?? -9999,
              // Hide on the very first frame to avoid a flash at (0,0)
              visibility: coords ? 'visible' : 'hidden',
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.item} ${item.danger ? styles.danger : ''}`}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}