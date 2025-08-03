"use client";

import { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductImagesProps = {
  images: string[];
};

const ProductImages: FC<ProductImagesProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="Product Image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-4">
        {images?.map((image, index) => (
          <div
            key={index}
            className={cn("cursor-pointer transition hover:ring-2 hover:ring-blue-400", {
              "ring-2 ring-blue-500": current === index,
            })}
            onClick={() => setCurrent(index)}
          >
            <Image
              src={image}
              alt={`Product Image ${index + 1}`}
              width={100}
              height={100}
              className="min-h-[100px] object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
