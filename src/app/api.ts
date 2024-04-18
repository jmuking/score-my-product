import React from "react";
import { ApiData, Post, Product } from "./types";

export const defaultApiData: ApiData = {};
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
