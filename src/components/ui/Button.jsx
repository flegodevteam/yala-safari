import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
}) => {
  const baseStyles = "px-4 py-2 rounded font-semibold transition";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-200",
    primary: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
