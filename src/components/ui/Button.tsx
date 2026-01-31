"use client";

import { forwardRef } from "react";

/* FreeUp Button — Style Guide 08
   Padding: horizontal 5× font size, vertical 1× font size
   Primary button color: #FF7EA3 (logo pink)
   Variants: solid (default), outline, icon-text, icon-only
*/

const sizeClasses = {
  small: "text-sm px-5 py-1.5 rounded-md",
  normal: "text-base px-5 py-2 rounded-md",
  medium: "text-lg px-6 py-2.5 rounded-lg",
  large: "text-xl px-7 py-3 rounded-lg",
} as const;

type ButtonVariant = "solid" | "outline" | "icon-text" | "icon-only";
type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "normal",
      fullWidth = false,
      leftIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-logo-pink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70";

    const variantClasses: Record<ButtonVariant, string> = {
      solid:
        "bg-logo-pink text-white hover:bg-[#e86d8f] active:bg-[#ff92b0] disabled:bg-disabled-bg disabled:text-disabled",
      outline:
        "border-2 border-logo-pink text-logo-pink bg-transparent hover:bg-logo-pink hover:text-white hover:border-[#e86d8f] active:bg-[#ff92b0] active:border-[#ff92b0] disabled:border-disabled disabled:text-disabled disabled:bg-transparent",
      "icon-text":
        "bg-logo-pink text-white hover:bg-[#e86d8f] active:bg-[#ff92b0] disabled:bg-disabled-bg disabled:text-disabled",
      "icon-only":
        "rounded-full bg-logo-pink text-white hover:bg-[#e86d8f] active:bg-[#ff92b0] disabled:bg-disabled-bg disabled:text-disabled p-2",
    };

    const widthClass = fullWidth ? "w-full" : "";
    const sizeClass =
      variant === "icon-only"
        ? "p-2 rounded-full"
        : sizeClasses[size];

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`${base} ${variantClasses[variant]} ${sizeClass} ${widthClass} ${className}`}
        {...props}
      >
        {variant === "icon-only" ? (
          leftIcon ?? children
        ) : (
          <>
            {leftIcon}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
