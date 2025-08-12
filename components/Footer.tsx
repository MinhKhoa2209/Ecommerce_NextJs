import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import React from "react";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const categories = await getAllCategories();
  return <FooterClient categories={categories} />;
}
