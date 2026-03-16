import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
