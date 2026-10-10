// src/components/ui/ApkDownloadPanel.tsx
import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Smartphone } from 'lucide-react';
import { CARGO_APK_URL, CARGO_WEBSITE_URL } from '@/constants/links';
import { cn } from '@/utils/cn';
import styles from './ApkDownloadPanel.module.css';

interface ApkDownloadPanelProps {
  /** 'floating' = big top-right pill that expands on hover (login page) */
  /** 'subtle'  = small icon in a toolbar that expands on hover/click (top bar) */
  variant?: 'floating' | 'subtle';
}

export function ApkDownloadPanel({ variant = 'floating' }: ApkDownloadPanelProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside (for touch / keyboard users on the subtle variant)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDownload = () => {
    if (state === 'loading') return;
    setState('loading');

    // Cross-origin `download` attribute is ignored by browsers; open in a new tab
    const a = document.createElement('a');
    a.href = CARGO_APK_URL;
    a.rel = 'noopener noreferrer';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.setTimeout(() => {
      setState('done');
      window.setTimeout(() => setState('idle'), 1600);
    }, 600);
  };

  const isFloating = variant === 'floating';

  return (
    <div
      ref={wrapperRef}
      className={cn(
        styles.wrapper,
        isFloating ? styles.wrapperFloating : styles.wrapperSubtle,
        open && styles.wrapperOpen,
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        className={cn(styles.trigger, open && styles.triggerOpen)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Download the Delivery Partner app"
      >
        <Smartphone size={isFloating ? 18 : 16} />
        {isFloating && <span className={styles.triggerLabel}>Get the App</span>}
      </button>

      {/* Expanded panel */}
      {open && (
        <div className={cn(styles.panel, isFloating ? styles.panelFloating : styles.panelSubtle)}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Delivery Partner App</span>
            <span className={styles.panelSubtitle}>v1.0.0 · Android</span>
          </div>

          <div className={styles.panelBody}>
            <div className={styles.qrBox}>
              <QRCodeSVG value={CARGO_APK_URL} size={108} level="M" />
            </div>

            <div className={styles.panelActions}>
              <button
                type="button"
                className={cn(
                  styles.downloadBtn,
                  state === 'loading' && styles.downloadBtnLoading,
                  state === 'done' && styles.downloadBtnDone,
                )}
                onClick={handleDownload}
                disabled={state === 'loading'}
              >
                {state === 'idle' && (
                  <>
                    <Download size={15} />
                    Download APK
                  </>
                )}
                {state === 'loading' && (
                  <>
                    <span className={styles.spinner} />
                    Preparing…
                  </>
                )}
                {state === 'done' && (
                  <>
                    <Download size={15} />
                    Downloading
                  </>
                )}
              </button>

              <a
                href={CARGO_WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                Visit Cargo site →
              </a>
            </div>
          </div>

          <div className={styles.panelHint}>Scan the QR with your phone to install</div>
        </div>
      )}
    </div>
  );
}