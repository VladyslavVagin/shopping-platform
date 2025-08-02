import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";

const ProductCard: FC<{ product: any }> = ({ product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/products/${product.slug}`}>
          <Image src={product.images[0]} alt={product.name} width={300} height={300} />
        </Link>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
