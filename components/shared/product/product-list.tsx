import { FC } from "react";

type ProductListProps = {
    data: any;
    title?: string;
    limit?: number;
}

const ProductList: FC<ProductListProps> = ({ data, title, limit }) => {
    const limitedData = limit ? data.slice(0, limit) : data;
    return (<div className="my-10">
        <h2 className="font-bold mb-4">{title}</h2>
        {data && data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {limitedData.map((product: any, index: number) => (
                    <div key={index} className="border p-4">
                        <h3 className="font-bold">{product.name}</h3>
                    </div>
                ))}
            </div>
        ) : (
            <p>No products found.</p>
        )}
    </div>);
}
 
export default ProductList;