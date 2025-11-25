"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'bg-white border border-gray-200 shadow-lg',
          title: 'text-gray-900',
          description: 'text-gray-600',
          success: 'border-l-4 border-l-green-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };