import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { Products } from "../data";
import { ApiContext, getScores } from "../api";

export default function ProfileActions() {
  const apiContext = React.useContext(ApiContext);

  const [activeProduct, setActiveProduct] = useState<string>();

  const productChanged = (product: string) => {
    setActiveProduct(product);
    apiContext.setApiData({ ...apiContext.apiData, product });

    getScores(product).then((value) => {
      console.log(value.scores);
    });
  };

  return (
    <div className="mt-2">
      <p className="mb-4 text-base">
        Select a product, and then click on a country to get scoring.
      </p>
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
