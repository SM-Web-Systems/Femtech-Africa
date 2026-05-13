'use client';

export const Loading = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);
