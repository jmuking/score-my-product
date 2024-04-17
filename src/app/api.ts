import React from "react";
import { ApiData, Product } from "./types";

export const defaultApiData: ApiData = {};
export const defaultApiContext = {
  apiData: defaultApiData,
  setApiData: (apiData: ApiData) => {},
};
export const ApiContext = React.createContext(defaultApiContext);

const BASE_URL = "https://coverage-mapper-2rca5acexa-uc.a.run.app";
const DEFAULT_DATA: any = {
  method: "GET",
  mode: "cors",
  withCredentials: true,
  headers: {
    "X-API-Key": "Pp7GszmeMlnQXjLiKTpydva0pnSFIHOq",
    "Access-Control-Allow-Origin": "*",
  },
};

//POST requests
export const getPosts = async (product: Product, country: string) => {
  const response = await fetch(
    `${BASE_URL}/posts?` +
      new URLSearchParams({ product: product.code, country }),
    DEFAULT_DATA
  );

  return response.json();
};

//SCORE requests
export const getScores = async (product: string, country?: string) => {
  const searchParams = new URLSearchParams({ product });
  if (country) searchParams.append("country", country);

  console.log(DEFAULT_DATA);
  const response = await fetch(
    `${BASE_URL}/scores?` + searchParams,
    DEFAULT_DATA
  );
  return response.json();
};
