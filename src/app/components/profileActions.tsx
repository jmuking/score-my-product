import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { lookupProduct, Products } from "../data";
import { ApiContext, getScores } from "../api";
import { Product } from "../types";

export default function ProfileActions() {
  const apiContext = React.useContext(ApiContext);

  const [activeProduct, setActiveProduct] = useState<Product>();

  const productChanged = (productCode: string | undefined) => {
    if (productCode) {
      const product = lookupProduct(productCode);

      if (product) {
        setActiveProduct(product);
        apiContext.setApiData({ ...apiContext.apiData, product });

        getScores(product).then((value) => {
          console.log(value.scores);
        });
      }
    }
  };

  return (
    <div className="mt-2">
      <p className="mb-4 text-base">
        Select a product, and then click on a country to get scoring.
      </p>
      <Select
        label="Select Product"
        value={activeProduct?.code}
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
