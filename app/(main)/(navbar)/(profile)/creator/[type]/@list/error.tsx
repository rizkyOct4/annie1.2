"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorBoundary = ({ error, reset }: ErrorProps) => {
  return (
    <div className="bg-red-100 p-4 rounded">
      <h1 className="text-red-600 font-bold">Error!</h1>
      <p>{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorBoundary;
