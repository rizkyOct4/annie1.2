"use client";

import { LocalISOTime } from "@/_util/GenerateData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { creatorContext } from "@/app/context";
import { TImagePut, zPutFormSchema } from "../../schema/schema-form";
import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";
// import { IsRenderComponent } from "../../../folder-list";
// import type { PutImageSchema } from "../../types/type";

type PutFormSchema = z.infer<typeof zPutFormSchema>;

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

const PutPhotoForm = ({
  setIsRender,
}: {
  setIsRender: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { UpdatedData, ListPostFolderData, refetchListPostFolder, setTypeBtn, putPhoto } =
    useContext(creatorContext);
  // console.log(UpdatedData);
  // console.log(ListPostFolderData);

  const [showDummyFolder, setShowDummyFolder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<PutFormSchema>({
    resolver: zodResolver(zPutFormSchema),
    mode: "onChange",
    defaultValues: {
      imageName: "",
      imagePath: "",
      prevImage: "",
      folderName: "",
      hashtag: [],
      category: [],
      description: "",
    },
  });

  useEffect(() => {
    // ! INITIATE DATA cuma berlaku saat pertama kali mount ke component !! kalau data beda pastikan RESET !!!
    if (UpdatedData) {
      reset({
        imageName: UpdatedData[0].imageName,
        imagePath: UpdatedData[0].url,
        prevImage: UpdatedData[0].url,
        folderName: UpdatedData[0].folderName,
        hashtag: UpdatedData[0].hashtag || [],
        category: UpdatedData[0].category || [],
        description: UpdatedData[0].description,
      });
    }
    setTypeBtn("photo");
    if (!ListPostFolderData) {
      refetchListPostFolder();
    }
  }, [
    ListPostFolderData,
    UpdatedData,
    refetchListPostFolder,
    reset,
    setTypeBtn,
  ]);

  const submit = handleSubmit(async (values) => {
    try {
      const payload: TImagePut = {
        idProduct: UpdatedData[0].idProduct,
        description: values.description,
        imageName: values.imageName,
        imagePath: values.imagePath,
        prevImage: UpdatedData[0].url,
        folderName: values.folderName,
        hashtag: values.hashtag,
        category: values.category,
        type: "photo",
        updatedAt: LocalISOTime(),
      };
      console.log(payload)
      await putPhoto(payload);
      setIsRender({ isOpen: false, iuProduct: null, value: "" });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="overlay z-70">
      <div className="relative w-full max-w-3xl rounded-2xl backdrop-blur-sm border border-white/10 p-6 md:p-8 text-white">
        {/* Close button */}
        <button
          type="button"
          onClick={() => setIsRender({ open: false, type: "" })}
          className="absolute right-4 top-4 text-2xl text-white/70 hover:text-white transition">
          &times;
        </button>

        <h2 className="mb-6 text-2xl font-bold">Update Photo</h2>

        <form
          className="flex max-h-[75vh] flex-col gap-6 overflow-hidden"
          onSubmit={submit}>
          <div className="flex flex-col gap-6 overflow-y-auto pr-1 md:flex-row">
            {/* LEFT */}
            <div className="flex flex-1 flex-col gap-4 p-1">
              {watch("imagePath") && (
                <Image
                  src={watch("imagePath")}
                  alt="Preview"
                  width={240}
                  height={140}
                  className="w-full h-40 rounded-xl border border-white/20 object-cover"
                />
              )}

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-white/80">Upload Photo</span>
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
                  className="rounded-md border border-white/20 bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="flex items-center gap-2 text-white/80">
                  Description
                  {errors.description && (
                    <span className="text-xs text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </span>
                <textarea
                  {...register("description")}
                  rows={5}
                  className="resize-none rounded-md border border-white/20 bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* RIGHT */}
            <div className="relative flex flex-1 flex-col gap-4 p-1">
              {/* Folder */}
              <div className="relative">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="flex items-center gap-4 text-white/80">
                    Folder
                    {errors.folderName && (
                      <span className="text-xs text-red-500">
                        {errors.folderName.message}
                      </span>
                    )}
                  </span>

                  <div className="flex overflow-hidden rounded-md border border-white/20 bg-white/10 focus-within:ring-2 focus-within:ring-blue-500">
                    <input
                      {...register("folderName")}
                      defaultValue={watch("folderName")}
                      // placeholder="Select folder..."
                      className="flex-1 bg-transparent p-2 text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDummyFolder(!showDummyFolder)}
                      className="bg-white/10 px-3 transition hover:bg-white/20">
                      ▼
                    </button>
                  </div>
                </label>

                {showDummyFolder && (
                  <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-white/20 bg-black/90 shadow-lg">
                    {Array.isArray(ListPostFolderData) &&
                      ListPostFolderData.map((i) => (
                        <div
                          key={i.folderName}
                          defaultValue={watch("folderName")}
                          className="cursor-pointer px-3 py-2 hover:bg-white/10"
                          onClick={() => {
                            // console.log("Selected:", i.folderName);
                            setValue("folderName", i.folderName, {
                              shouldValidate: true,
                            });
                            setShowDummyFolder(false);
                          }}>
                          {i.folderName}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Hashtag */}
              <label className="flex flex-col gap-1 text-sm">
                <span className="flex items-center gap-2 text-white/80">
                  Hashtag
                  {errors.hashtag && (
                    <span className="text-xs text-red-500">
                      {errors.hashtag.message}
                    </span>
                  )}
                </span>

                <input
                  type="text"
                  placeholder="Type and press Enter..."
                  className="rounded-md border bg-white/10 p-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
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
                {watch("hashtag").map((i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                    #{i}
                    <button
                      type="button"
                      onClick={() => {
                        const values = watch("hashtag");
                        setValue(
                          "hashtag",
                          values.filter((v) => v !== i),
                          { shouldValidate: true }
                        );
                      }}
                      className="text-xs text-white/60 hover:text-red-500">
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Category */}
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-white/80">Category</span>
                <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                  {categories.map((i) => {
                    const selected = watch("category").includes(i.name);
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
                        className={`rounded-full border px-3 py-1 text-sm transition ${
                          selected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-white/20 bg-white/10 hover:bg-white/20"
                        }`}>
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
            className="rounded-lg bg-blue-500 py-3 font-medium text-white transition hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PutPhotoForm;

// todo kondisikan besok sama kau ini !! data update !!
