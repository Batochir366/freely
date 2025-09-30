"use client";
import axiosInstance from "@/utils/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  icons: string;
};

type CategoryContextType = {
  categories: Category[];
};

const CategoryContext = createContext<CategoryContextType | null>(null);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategory must be used within CategoryProvider");
  return context;
};

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category/");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
};
