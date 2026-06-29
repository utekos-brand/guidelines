import { ProductCard } from "@/components/product/ProductCard";

export function ProductCardPreview() {
  return (
    <section data-theme="havdyp" className="bg-background text-foreground p-6">
      <div className="max-w-sm">
        <ProductCard
          href="/"
          title="Utekos TechDown"
          description="Funksjonell varme for rolige øyeblikk ute."
          eyebrow="Utekos"
          price="3 990 kr"
          compareAtPrice="4 490 kr"
          image={{
            src: "/images/products/utekos-techdown.webp",
            alt: "Utekos TechDown i Maritime Blue",
          }}
          badges={[
            { label: "Nyhet", variant: "default" },
            { label: "TechDown", variant: "secondary" },
            { label: "Toveis YKK", variant: "outline" },
          ]}
          features={["Snorstramming i livet", "Snorstramming nederst", "Toveis YKK-glidelås"]}
        />
      </div>
    </section>
  );
}
