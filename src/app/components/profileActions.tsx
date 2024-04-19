import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { lookupProduct, Products } from "../data";
import { ApiContext, getScores } from "../api";
import { Product } from "../types";
import { MapContext } from "./productMap";
import { GeoJSONSource } from "react-map-gl";

export default function ProfileActions() {
  const apiContext = React.useContext(ApiContext);
  const mapContext = React.useContext(MapContext);

  const [activeProduct, setActiveProduct] = useState<Product>();

  const productChanged = (productCode: string | undefined) => {
    if (productCode) {
      const product = lookupProduct(productCode);

      if (product) {
        setActiveProduct(product);
        apiContext.setApiData({
          ...apiContext.apiData,
          ...{ product },
        });
        apiContext.setApiLoading(true);

        mapContext.reloadScores(product);
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
