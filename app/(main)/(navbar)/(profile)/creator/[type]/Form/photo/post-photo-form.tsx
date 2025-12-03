"use client";

import { RandomId, LocalISOTime } from "@/_util/GenerateData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useCallback, useContext, memo, useState } from "react";
import { creatorContext } from "@/app/context";
import { zPostFormSchema } from "./schema";
import { ToggleStateType } from "../../type/interface";
import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";

type PostFormSchema = z.infer<typeof zPostFormSchema>;

export type PhotoPostType = {
  iuProduct: number;
  publicId: string;
  description: string;
  imageName: string;
  imagePath: string;
  hashtags: string[];
  categories: string[];
  type: string;
  folderName: string;
  createdAt: Date;
};

const categories = [
  { name: "Photography", icon: "📸" },
  { name: "Videography", icon: "🎥" },
  { name: "Digital Art", icon: "🎨" },
  { name: "Architecture", icon: "🏙️" },
  { name: "Fashion", icon: "👗" },
  { name: "Nature", icon: "🌿" },
  { name: "Food & Drink", icon: "🍳" },
  { name: "Automotive", icon: "🚗" },
  { name: "Astrophotography", icon: "🌌" },
  { name: "Mobile Shots", icon: "📱" },
  { name: "Travel", icon: "🧳" },
  { name: "Creative Concepts", icon: "🎭" },
  { name: "Lifestyle & People", icon: "👶" },
  { name: "Behind The Scenes", icon: "🔧" },
];

const ListPostFolderDataDummy = [
  { id: 1, name: "Travel Photos" },
  { id: 2, name: "Food & Drinks" },
  { id: 3, name: "Nature" },
  { id: 4, name: "Work Projects" },
  { id: 5, name: "Personal" },
];

const PostPhotoForm = ({
  setIsRender,
}: {
  setIsRender: React.Dispatch<React.SetStateAction<ToggleStateType>>;
}) => {
  const { ListPostFolderData, isLoadingListPost, publicId, postPhoto } =
    useContext(creatorContext);

  const { register, handleSubmit, formState, setValue, getValues, watch } =
    useForm<PostFormSchema>({
      resolver: zodResolver(zPostFormSchema),
      mode: "onChange",
      defaultValues: {
        imageName: "",
        imagePath: "",
        folderName: "",
        hashtag: [],
        category: [],
        description: "",
      },
    });

  const [showDummyFolder, setShowDummyFolder] = useState(false);

  const submit = handleSubmit(async (values) => {
    try {
      const payload: PhotoPostType = {
        iuProduct: RandomId(),
        publicId: publicId,
        description: values.description,
        imageName: values.imageName,
        imagePath: values.imagePath,
        hashtag: values.hashtag,
        category: values.category,
        type: "photo",
        folderName: values.folderName,
        createdAt: LocalISOTime(),
      };
      await postPhoto(payload);
      setIsRender({ open: false, type: "" });
      console.log(payload);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="overlay backdrop-blur-sm z-70">
      <div className="bg-black/80 text-white w-full max-w-3xl p-8 rounded-xl border border-white/10 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsRender({ open: false, type: "" })}
          className="absolute top-4 right-4 text-2xl leading-none text-white/80 hover:text-white"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6">Upload Photo</h2>

        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side */}
            <div className="flex-1 flex flex-col gap-4">
              {getValues("imagePath") && (
                <Image
                  src={getValues("imagePath")}
                  alt="Preview"
                  width={160}
                  height={140}
                  className="object-cover rounded-xl border border-white/20"
                />
              )}

              <label className="flex flex-col text-sm text-white/90 w-full">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setValue("imageName", file.name, {
                          shouldValidate: true,
                        });
                        setValue("imagePath", reader.result as string, {
                          shouldValidate: true,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mt-1 p-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <label className="flex flex-col text-sm text-white/90">
                Description
                <textarea
                  {...register("description")}
                  className="mt-1 p-2 rounded-md border border-white/20 bg-white/10 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                />
              </label>
              {formState.errors.description && (
                <p className="text-red-500 text-xs">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Right side */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Folder */}
              <div className="flex flex-col w-full text-sm text-white/90 relative">
                <label className="mb-1">Folder</label>
                <div className="flex w-full rounded-md border border-white/20 bg-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Select folder..."
                    className="flex-1 p-2 bg-transparent text-white outline-none"
                  />

                  {/* Tombol dropdown dummy */}
                  <button
                    type="button"
                    className="px-3 bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={() => setShowDummyFolder(!showDummyFolder)}
                  >
                    &#x25BC;
                  </button>
                </div>

                {/* Dropdown dummy */}
                {showDummyFolder && (
                  <div className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-white/20 bg-black/80 z-10">
                    {ListPostFolderDataDummy.map((folder) => (
                      <div
                        key={folder.id}
                        className="px-3 py-2 text-white hover:bg-white/10 cursor-pointer"
                        onClick={() => {
                          console.log("Selected:", folder);
                          setShowDummyFolder(false);
                        }}
                      >
                        {folder.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hashtags */}
              <label className="flex flex-col text-sm text-white/90">
                Hashtags
                <input
                  type="text"
                  placeholder="Type and press Enter..."
                  className="mt-1 p-2 rounded-md border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onKeyDown={(e) => {
                    const input = e.currentTarget.value
                      .trim()
                      .replace(/^#/, "");
                    const hashtags = watch("hashtag");
                    if (
                      e.key === "Enter" &&
                      !input.match(ForbiddenRegex()) &&
                      hashtags.length < 3
                    ) {
                      e.preventDefault();
                      if (hashtags.includes(input)) return;
                      setValue("hashtag", [...hashtags, input], {
                        shouldValidate: true,
                      });
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <input type="hidden" {...register("hashtag")} />
              </label>

              {/* Hashtag list */}
              <div className="flex flex-wrap gap-2">
                {getValues("hashtag").map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-sm text-white border border-white/20 shadow-sm"
                  >
                    #{i}
                    <button
                      type="button"
                      onClick={() => {
                        const values = getValues("hashtag");
                        setValue(
                          "hashtag",
                          values.filter((v) => v !== i),
                          { shouldValidate: true }
                        );
                      }}
                      className="text-xs text-white/70 hover:text-red-500 transition"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Categories */}
              <label className="flex flex-col text-sm text-white/90 gap-2">
                Category
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                  {categories.map((i) => {
                    const selected = getValues("category").includes(i.name);
                    return (
                      <button
                        key={i.name}
                        type="button"
                        onClick={() => {
                          const current = watch("category");
                          if (current.includes(i.name)) {
                            setValue(
                              "category",
                              current.filter((v) => v !== i.name),
                              { shouldValidate: true }
                            );
                          } else if (current.length < 3) {
                            setValue("category", [...current, i.name], {
                              shouldValidate: true,
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          selected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                      >
                        {i.icon} {i.name}
                      </button>
                    );
                  })}
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(PostPhotoForm);
