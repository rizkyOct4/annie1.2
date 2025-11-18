"use client";

import React from "react";
import Image from "next/image";
import { useContext } from "react";
import { categoryContext } from "@/app/context";
import { ListCategoryType } from "../type";
import { useRouter } from "next/navigation";
import { FaBoxOpen } from "react-icons/fa6";

const CategoryList = ({ params }: { params: string }) => {
  const { listCategoryData } = useContext(categoryContext);

  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      {Array.isArray(listCategoryData) &&
        listCategoryData.map((i: ListCategoryType, index: number) => (
          <div
            key={index}
            className="flex flex-col w-72 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <Image
                width={200}
                height={320}
                src={i.url}
                alt={"#"}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {i.iuProduct}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(i.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <button
                onClick={() => router.push(`/category/${params}?id=${i.iuProduct}`)}
              >
                <FaBoxOpen />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CategoryList;
