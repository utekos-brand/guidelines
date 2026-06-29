import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const brandHeaderButtonVariants = cva(
  "inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-full px-6 text-base leading-none font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-expanded:bg-foreground/5 dark:aria-expanded:bg-foreground/10 [&_svg]:size-[18px] [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "bg-header-nav-active text-header-nav-active-foreground hover:opacity-90",
        false: "bg-transparent text-foreground hover:bg-foreground/5 dark:hover:bg-foreground/10",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export function BrandHeaderButton({
  className,
  active = false,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof brandHeaderButtonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="brand-header-button"
      data-active={active ? "" : undefined}
      className={cn(brandHeaderButtonVariants({ active }), className)}
      {...props}
    />
  );
}
