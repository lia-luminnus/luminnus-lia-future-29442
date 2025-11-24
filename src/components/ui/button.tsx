import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-[var(--transition)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#7B2FF7] text-white hover:bg-[#9F57FF] shadow-[0_4px_20px_rgba(123,47,247,0.25)] hover:shadow-[0_8px_32px_rgba(123,47,247,0.35)] hover:-translate-y-0.5 rounded-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md rounded-xl",
        outline:
          "border-2 border-[#7B2FF7] bg-transparent text-[#7B2FF7] hover:bg-[#7B2FF7]/10 hover:border-[#9F57FF] rounded-xl",
        secondary:
          "bg-[#F3EEFF] text-[#7B2FF7] hover:bg-[#E8DBFF] dark:bg-[#7B2FF7]/20 dark:text-[#C7A4FF] dark:hover:bg-[#7B2FF7]/30 rounded-xl",
        ghost:
          "hover:bg-[#7B2FF7]/10 hover:text-[#7B2FF7] rounded-xl",
        link:
          "text-[#7B2FF7] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
