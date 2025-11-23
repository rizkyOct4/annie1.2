"use client";

import { LocalISOTime } from "@/_util/GenerateData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { creatorContext } from "@/app/context";
import { zPutFormSchema } from "./schema";
import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";
import { IsRenderComponent } from "../../folder-list";
import type { PutImageSchema } from "../../type/type";

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

const FormPutPhoto = ({
  setIsRender,
}: {
  setIsRender: React.Dispatch<React.SetStateAction<IsRenderComponent>>;
}) => {
  const { descriptionItemFolderData, putPhoto, publicId } =
    useContext(creatorContext);

  const {
    register,
    handleSubmit,
    formState,
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
      hashtag: [],
      category: [],
      description: "",
    },
  });

  useEffect(() => {
    // ! INITIATE DATA cuma berlaku saat pertama kali mount ke component !! kalau data beda pastikan RESET !!!
    if (descriptionItemFolderData) {
      reset({
        imageName: descriptionItemFolderData[0].imageName || "",
        imagePath: descriptionItemFolderData[0].url || "",
        prevImage: descriptionItemFolderData[0].url || "",
        hashtag: descriptionItemFolderData[0].hashtag || [],
        category: descriptionItemFolderData[0].category || [],
        description: descriptionItemFolderData[0].description || "",
      });
    }
  }, [descriptionItemFolderData, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      const payload: PutImageSchema = {
        iuProduct: descriptionItemFolderData[0].tarIuProduct,
        publicId: publicId,
        description: values.description,
        imageName: values.imageName,
        imagePath: values.imagePath,
        prevImage: descriptionItemFolderData[0].url,
        hashtag: values.hashtag,
        category: values.category,
        type: "photo",
        createdAt: LocalISOTime(),
      };
      await putPhoto(payload);
      setIsRender({ isOpen: false, iuProduct: null, value: "" });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="overlay">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={() =>
            setIsRender({ isOpen: false, iuProduct: null, value: "" })
          }
          className="absolute top-4 right-4 text-2xl leading-none text-gray-800 hover:text-black hover:cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-black">Update Photo</h2>

        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* // * Left side */}
            <div className="flex-1 flex flex-col gap-4">
              {watch("imagePath") && (
                <Image
                  src={watch("imagePath")}
                  alt="Preview"
                  width={160}
                  height={140}
                  className="object-cover rounded-xl"
                />
              )}
              <label className="flex flex-col text-sm text-black w-full">
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
                  className="mt-1 p-2 border border-gray-400 rounded-md text-black bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>

              <label className="flex flex-col text-sm text-black">
                Description
                <textarea
                  {...register("description")}
                  className="mt-1 p-2 border border-gray-400 rounded-md text-black bg-gray-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={5}
                />
              </label>
              {formState.errors.description && (
                <p className="text-red-600 text-sm">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* // * Right side */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Hashtags */}
              <label className="flex flex-col text-sm text-black">
                Hashtags
                <input
                  type="text"
                  placeholder="Type and press Enter..."
                  className="mt-1 p-2 border border-gray-400 rounded-md text-black bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              <div className="flex flex-wrap gap-2 mt-2">
                {getValues("hashtag").map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md text-sm text-black"
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
                      className="text-xs text-gray-700 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {/* Categories */}
              <label className="flex flex-col text-sm text-black gap-2">
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
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
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
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPutPhoto;
