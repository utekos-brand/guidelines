import Image from "next/image";

<article className="border-border bg-card text-card-foreground overflow-hidden rounded-xl border">
  <div className="bg-muted">
    <Image src="/images/product-card-image.jpg" alt="Product Card Image" width={100} height={100} />
  </div>

  <div className="space-y-3 p-4">
    <div className="flex items-center gap-2">
      <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs">
        TechDown
      </span>

      <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
        Nyhet
      </span>
    </div>

    <h3 className="text-card-foreground font-semibold">Utekos TechDown</h3>

    <p className="text-muted-foreground text-sm">Funksjonell varme for rolige øyeblikk ute.</p>

    <div className="flex items-center justify-between">
      <span className="text-foreground font-semibold">3 990 kr</span>
      <button className="bg-primary text-primary-foreground rounded-md px-4 py-2">
        Velg størrelse
      </button>
    </div>
  </div>
</article>;
