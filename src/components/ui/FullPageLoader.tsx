import styles from './FullPageLoader.module.css';

export function FullPageLoader() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={styles.spinner} />
      <span className={styles.text}>Loading…</span>
    </div>
  );
}