'use client';

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export const Error = ({ message, onRetry }: ErrorProps) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
    <div className="text-4xl mb-3">❌</div>
    <p className="text-red-700 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Retry
      </button>
    )}
  </div>
);
