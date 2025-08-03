import { FC } from "react";
import { cn } from "@/lib/utils";

type ProductPriceProps = {
  value: number;
  className?: string;
};

const ProductPrice: FC<ProductPriceProps> = ({ value, className }) => {
  const stringValue = value.toFixed(2);
  const [integerPart, decimalPart] = stringValue.split(".");
  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {integerPart}
      <span className="text-xs align-super">.{decimalPart}</span>
    </p>
  );
};

export default ProductPrice;
