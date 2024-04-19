import React from "react";
import { ApiData, Post, Product } from "./types";

export const defaultApiData: ApiData = {
  countries: undefined,
};
export const defaultApiContext = {
  apiLoading: false,
  setApiLoading: (loading: boolean) => {},
  apiData: defaultApiData,
  setApiData: (apiData: ApiData) => {},
};
export const ApiContext = React.createContext(defaultApiContext);

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

const BASE_URL = "https://coverage-mapper-2rca5acexa-uc.a.run.app";
const DEFAULT_DATA: any = {
  method: "GET",
  mode: "cors",
  withCredentials: true,
  headers: {
    "X-API-Key": process.env.X_API_KEY,
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
};

//POST requests
export const createPost = async (post: Post) => {
  const body = JSON.stringify({ ...post, id: uuidv4() });

  const response = await fetch(`${BASE_URL}/posts`, {
    ...DEFAULT_DATA,
    method: "POST",
    body,
  });

  return response.json();
};

export const editPost = async (post: Post) => {
  const body = JSON.stringify({ score: post.score, comment: post.comment });

  const response = await fetch(`${BASE_URL}/posts/${post.id}`, {
    ...DEFAULT_DATA,
    method: "PUT",
    body,
  });

  return response.json();
};

export const deletePost = async (post: Post) => {
  const response = await fetch(`${BASE_URL}/posts/${post.id}`, {
    ...DEFAULT_DATA,
    method: "DELETE",
  });

  return response.json();
};

export const getPosts = async (product: Product, country: string) => {
  const response = await fetch(
    `${BASE_URL}/posts?` +
      new URLSearchParams({ product: product.code, country }),
    DEFAULT_DATA
  );

  return response.json();
};

//SCORE requests
export const getScores = async (product: Product, country?: string) => {
  const searchParams = new URLSearchParams({ product: product.code });
  if (country) searchParams.append("country", country);

  const response = await fetch(
    `${BASE_URL}/scores?` + searchParams,
    DEFAULT_DATA
  );
  return response.json();
};

//COUNTRIES requests
export const getCountries = async () => {
  const response = await fetch(
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&returnEnvelope=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
  );

  return response.json();
};
