"use client";

import { useState, useCallback } from "react";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { VscCommentUnresolved, VscEyeClosed } from "react-icons/vsc";
import { LiaEyeSolid } from "react-icons/lia";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SelectedImageState {
  idUniqueProduct: number | null;
  creatorIdUnique: number | null;
  imageUrl: string;
  description: string;
  createdAt: string;
  creator_picture: string;
  total_like?: number;
  total_dislike?: number;
  total_comment?: number;
  total_read?: number;
  status_follow?: number;
  bookmark_status?: number;
  creator_id_unique?: number;
}

// dummy product
const dummyProduct: SelectedImageState = {
  idUniqueProduct: 1,
  creatorIdUnique: 2,
  imageUrl: "/photo/6.webp",
  description: "Beautiful Waterfall in Nature",
  createdAt: "2025-09-29",
  creator_picture: "/photo/2.webp",
  total_like: 10,
  total_dislike: 2,
  total_comment: 3,
  total_read: 42,
  status_follow: 0,
  bookmark_status: 0,
  creator_id_unique: 2,
};

const Description = ({
  params,
  searchParams,
}: {
  params: string;
  searchParams: string;
}) => {
  const router = useRouter();

  const [selectedImage, setSelectedImage] =
    useState<SelectedImageState>(dummyProduct);
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

  if (!selectedImage) return null;

  return (
    <div
      className="overlay backdrop-blur-sm"
      onClick={() => setSelectedImage(null as any)}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={() =>
            router.push(`http://localhost:3000/category/${params}`)
          }
        >
          <AiOutlineFullscreenExit size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="flex-1">
            <Image
              src={selectedImage.imageUrl}
              alt="#"
              className="rounded-xl w-full h-auto object-cover"
              width={300}
              height={500}
              // fill
            />
            {isOpen === "openComment" && (
              <div className="mt-3 text-sm text-gray-600">
                Komentar dibuka di sini
              </div>
            )}
            {isOpen === "report" && (
              <div className="mt-3 text-sm text-red-500">
                Form report dibuka di sini
              </div>
            )}
            {isOpen === "share" && (
              <div className="mt-3 text-sm text-blue-500">
                Opsi share dibuka di sini
              </div>
            )}
          </div>

          {/* Desc + Actions */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={selectedImage.creator_picture}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
                width={40}
                height={80}
                // fill
              />
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedImage.description || "Untitled"}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedImage.createdAt}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Follow */}
              {selectedImage.status_follow === 1 ? (
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded-lg"
                  onClick={(e) => handleAction(e, "unfollow")}
                >
                  👤 Unfollow Creator
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg"
                  onClick={(e) => handleAction(e, "follow")}
                >
                  👤 Follow Creator
                </button>
              )}

              {/* Bookmark */}
              {selectedImage.bookmark_status === 1 ? (
                <button
                  className="bg-yellow-100 hover:bg-yellow-200 py-2 px-3 rounded-lg"
                  onClick={(e) => handleAction(e, "updateBookmark")}
                >
                  🔖 Delete Bookmark
                </button>
              ) : (
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-3 rounded-lg"
                  onClick={(e) => handleAction(e, "addBookmark")}
                >
                  🔖 Add Bookmark
                </button>
              )}

              {/* Share */}
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-3 rounded-lg"
                onClick={(e) => handleAction(e, "share")}
              >
                📤 Share
              </button>

              {/* Report */}
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                onClick={(e) => handleAction(e, "report")}
              >
                {isOpen !== "report" ? (
                  <>⚠️ Report</>
                ) : (
                  <>
                    <VscEyeClosed /> Close
                  </>
                )}
              </button>

              {/* Comment */}
              <button
                className="col-span-2 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                onClick={(e) => handleAction(e, "openComment")}
              >
                {isOpen !== "openComment" ? (
                  <>
                    <VscCommentUnresolved />{" "}
                    {`${selectedImage.total_comment || 0}`}
                  </>
                ) : (
                  <>
                    <VscCommentUnresolved />
                    Close
                  </>
                )}
              </button>

              {/* Like */}
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                onClick={(e) => handleAction(e, "like")}
              >
                👍 <span>{selectedImage.total_like || 0}</span>
              </button>

              {/* Dislike */}
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                onClick={(e) => handleAction(e, "dislike")}
              >
                👎 <span>{selectedImage.total_dislike || 0}</span>
              </button>

              {/* Total read */}
              <div className="col-span-2 flex items-center justify-center gap-1 text-gray-700">
                <LiaEyeSolid /> {selectedImage.total_read || 0} views
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
