import './ErrorAlert.css';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="error-alert" role="alert">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <p className="error-message">{message}</p>
      </div>
      <button
        className="error-close"
        onClick={onDismiss}
        aria-label="Fechar alerta"
      >
        ✕
      </button>
    </div>
  );
}
