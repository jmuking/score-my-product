import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { Product } from "../types";
import { Products } from "../data";

export default function ProfileActions() {
  const [activeProduct, setActiveProduct] = useState<string>();

  return (
    <div className="mt-3">
      <Select
        label="Select Product"
        value={activeProduct}
        onChange={(product: Product) => {
          setActiveProduct(product.code);
        }}
      >
        {Products.map((product) => {
          return (
            <Option key={product.code} value={product.code}>
              {product.label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
