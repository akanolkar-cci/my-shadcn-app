import React from "react";
import clsx from "clsx";
import { ButtonProps } from "../../types"; 

// Button component
export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
