import React from "react";

const Loading = () => {
  return (
    <div className="w-full py-10 flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loading;
