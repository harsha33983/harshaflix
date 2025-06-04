import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-[#E50914] border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;