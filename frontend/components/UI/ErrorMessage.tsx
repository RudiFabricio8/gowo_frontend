import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className={styles.wrapper} id="error-message">
      <p className={styles.text}>{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry} id="error-retry">
          Reintentar
        </button>
      )}
    </div>
  );
}
