"use client";

import { useState, useCallback, useEffect, useContext } from "react";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { VscCommentUnresolved, VscEyeClosed } from "react-icons/vsc";
import { LiaEyeSolid } from "react-icons/lia";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { categoryContext } from "@/app/context";
import { CTypeCategoryDescriptionTypes } from "../../../type";
import { MdReport } from "react-icons/md";

const ModalDescription = ({
  data,
}: {
  data: CTypeCategoryDescriptionTypes;
}) => {
  const { keyDescription } = useContext(categoryContext);
  const queryClient = useQueryClient();
  const router = useRouter();

  console.log(data);

  useEffect(() => {
    if (!queryClient.getQueryData(keyDescription)) {
      queryClient.setQueryData(keyDescription, data);
    }
  }, [keyDescription, queryClient, data]);

  //   const [selectedImage, setSelectedImage] =
  //     useState<SelectedImageState>(dummyProduct);
  const [isOpen, setIsOpen] = useState<string>("");

  const handleAction = useCallback(
    async (e: React.SyntheticEvent<HTMLButtonElement>, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "share":
        case "report":
        case "openComment":
          setIsOpen((prev) => (prev === actionType ? "" : actionType));
          break;
        default:
          console.log("Action", actionType);
          break;
      }
    },
    []
  );

  return (
    <div className="overlay backdrop-blur-sm">
      <>
        {Array.isArray(data) &&
          data.map((i) => (
            <div
              key={i.tarIuProduct}
              className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl flex flex-col md:flex-row overflow-hidden transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={() => router.back()}
              >
                <AiOutlineFullscreenExit size={22} />
              </button>

              {/* Image Section */}
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4">
                <Image
                  src={i.url}
                  alt="preview"
                  className="rounded-xl object-cover w-full h-auto max-h-[500px]"
                  width={400}
                  height={400}
                />

                {/* Expandable Sections */}
                {isOpen === "openComment" && (
                  <p className="mt-3 text-sm text-gray-600 italic">
                    💬 Komentar dibuka di sini
                  </p>
                )}
                {isOpen === "report" && (
                  <p className="mt-3 text-sm text-red-500 italic">
                    ⚠️ Form report dibuka di sini
                  </p>
                )}
                {isOpen === "share" && (
                  <p className="mt-3 text-sm text-blue-500 italic">
                    📤 Opsi share dibuka di sini
                  </p>
                )}
              </div>

              {/* Description + Actions */}
              <div className="flex-1 flex flex-col justify-between p-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={i.url}
                      alt="creator"
                      className="w-10 h-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {i?.description || "Untitled"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {new Date(i?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {i?.description}
                  </p>

                  {/* Hashtag */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {i?.hashtag?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Category */}
                  <div className="flex flex-wrap gap-2">
                    {i?.category?.map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 border-t pt-4">
                  <button
                    onClick={(e) => handleAction(e, "share")}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
                  >
                    📤 Share
                  </button>

                  <button
                    onClick={(e) => handleAction(e, "report")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    {isOpen === "report" ? (
                      <>
                        <VscEyeClosed /> Close
                      </>
                    ) : (
                      <>
                        <MdReport /> Report
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => handleAction(e, "openComment")}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <VscCommentUnresolved />
                    {isOpen === "openComment" ? "Close" : "Comment"}
                  </button>

                  <div className="flex justify-between items-center w-full text-gray-700 text-sm mt-3">
                    <button className="flex items-center gap-1 hover:text-green-600 transition">
                      👍 {data?.totalLike}
                    </button>
                    <button className="flex items-center gap-1 hover:text-pink-600 transition">
                      👎 {data?.totalDislike}
                    </button>
                    <div className="flex items-center gap-1">
                      <LiaEyeSolid /> 120 views
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </>
    </div>
  );
};

export default ModalDescription;
