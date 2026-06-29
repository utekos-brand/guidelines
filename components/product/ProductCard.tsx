import type { Route } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;
type CardSize = NonNullable<ComponentProps<typeof Card>["size"]>;

export type ProductCardBadge = {
  label: string;
  variant?: BadgeVariant;
};

export type ProductCardImage = {
  src: string | StaticImageData;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

export type ProductCardSecondaryAction = {
  label: string;
  href: Route;
};

export type ProductCardProps = {
  href: Route;
  title: string;
  description: string;
  image: ProductCardImage;
  price: string;
  compareAtPrice?: string;
  eyebrow?: string;
  badges?: ProductCardBadge[];
  features?: string[];
  ctaLabel?: string;
  secondaryAction?: ProductCardSecondaryAction;
  imageRatio?: number;
  size?: CardSize;
  className?: string;
};

const defaultImageSizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw";

export function ProductCard({
  href,
  title,
  description,
  image,
  price,
  compareAtPrice,
  eyebrow,
  badges = [],
  features = [],
  ctaLabel = "Velg størrelse",
  secondaryAction,
  imageRatio = 1,
  size = "default",
  className,
}: ProductCardProps) {
  const [primaryBadge, ...supportingBadges] = badges;

  return (
    <Card
      size={size}
      className={cn(
        "group/product-card hover:border-ring/40 focus-within:border-ring/50 h-full overflow-hidden transition-colors",
        className,
      )}
    >
      <CardContent className="-mx-(--card-spacing) -mt-(--card-spacing) px-0">
        <Link
          href={href}
          aria-label={`Se ${title}`}
          className="focus-visible:ring-ring focus-visible:ring-offset-background block focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <AspectRatio ratio={imageRatio} className="bg-muted relative overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={image.priority}
              sizes={image.sizes ?? defaultImageSizes}
              className="object-cover transition-transform duration-300 group-hover/product-card:scale-[1.02]"
            />
          </AspectRatio>
        </Link>
      </CardContent>

      <CardHeader>
        {eyebrow ? (
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}

        <CardTitle className="line-clamp-2 text-base">
          <Link
            href={href}
            className="focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {title}
          </Link>
        </CardTitle>

        <CardDescription className="line-clamp-2">{description}</CardDescription>

        {primaryBadge ? (
          <CardAction>
            <Badge variant={primaryBadge.variant ?? "secondary"}>{primaryBadge.label}</Badge>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {supportingBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {supportingBadges.map((badge) => (
              <Badge key={badge.label} variant={badge.variant ?? "outline"}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}

        {features.length > 0 ? (
          <ul className="text-muted-foreground grid gap-1.5 text-sm">
            {features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="bg-muted-foreground/40 mt-2 size-1.5 shrink-0 rounded-full"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-lg font-semibold tracking-tight">{price}</span>

          {compareAtPrice ? (
            <span className="text-muted-foreground text-sm line-through">{compareAtPrice}</span>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-2 sm:flex-row">
        <Link href={href} className={cn(buttonVariants({ className: "w-full" }))}>
          {ctaLabel}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>

        {secondaryAction ? (
          <Link
            href={secondaryAction.href}
            className={cn(
              buttonVariants({
                variant: "outline",
                className: "w-full sm:w-auto",
              }),
            )}
          >
            {secondaryAction.label}
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
