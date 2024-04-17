import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { Product } from "../types";
import { Products } from "../data";
import { ApiContext, getScores } from "../api";

export default function ProfileActions() {
  const apiContext = React.useContext(ApiContext);

  const [activeProduct, setActiveProduct] = useState<string>();

  const productChanged = (product: string) => {
    setActiveProduct(product);
    getScores(product).then((value) => {
      console.log(value);
    });
  };

  return (
    <div className="mt-3">
      <Select
        label="Select Product"
        value={activeProduct}
        onChange={productChanged}
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
