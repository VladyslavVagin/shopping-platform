import { FC } from "react";
import ProductCard from "./product-card";
import type { Product } from "@/types";

type ProductListProps = {
    data: Product[];
    title?: string;
}

const ProductList: FC<ProductListProps> = ({ data, title }) => {
    return (<div className="my-10">
        <h2 className="font-bold mb-4">{title}</h2>
        {data && data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((product: Product) => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </div>
        ) : (
            <p>No products found.</p>
        )}
    </div>);
}
 
export default ProductList;