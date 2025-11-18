"use client";

import { RandomId, LocalISOTime } from "@/_util/GenerateData";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useCallback, useContext } from "react";
// import axios from "axios";
import { creatorContext } from "@/app/context";
import { zPostFormSchema } from "./schema";
import { ToggleStateType } from "../../interface";
import { Loader2Icon } from "lucide-react";
// import { CREATOR_CRUD } from "@/config/api/creator";

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
  { name: "Photography", icon: "🎥" },
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

const PhotoPostForm = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<ToggleStateType>>;
}) => {
  const { ListPostFolderData, isLoadingListPost, publicId, postPhoto } =
    useContext(creatorContext);

  const { register, handleSubmit, formState, setValue, getValues, trigger } =
    useForm<PostFormSchema>({
      // ? REGEXNYA DISINI TERJADI !!!!
      resolver: zodResolver(zPostFormSchema),
      mode: "onChange",
      defaultValues: {
        imageName: "",
        imagePath: "",
        folderName: "",
        hashtag: [],
        category: [],
      },
    });

  const submit = handleSubmit(async (values) => {
    try {
      const payload: PhotoPostType = {
        iuProduct: RandomId(),
        publicId: publicId,
        description: values.description,
        imageName: values.imageName,
        imagePath: values.imagePath,
        hashtags: values.hashtag,
        categories: values.category,
        type: "photo",
        folderName: values.folderName,
        createdAt: LocalISOTime(),
      };
      await postPhoto(payload);
      setIsOpen({
        open: false,
        type: "",
      });
    } catch (error) {
      console.error(error);
    }
  });

  const handleHashtagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const input = e.currentTarget.value.trim().replace(/^#/, "");

        const current = getValues("hashtag");
        if (current.includes(input)) return;

        const update = [...current, input];
        setValue("hashtag", update, { shouldValidate: true });

        e.currentTarget.value = "";
      }
    },
    [getValues, setValue]
  );

  return (
    <div className="overlay backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="relative bg-black rounded-2xl p-6 w-full max-w-3xl mx-auto shadow-lg border-f"
      >
        {/* close */}
        <button
          type="button"
          onClick={() =>
            setIsOpen({
              open: false,
              type: "",
            })
          }
          className="absolute top-2 right-4 text-2xl leading-none text-white"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* // ? preview + upload */}
          <div className="flex flex-col gap-2 md:w-1/3">
            {getValues("imagePath") && (
              <Image
                src={getValues("imagePath")}
                alt=""
                width={200}
                height={200}
                className="w-auto h-auto aspect-square rounded-xl object-cover bg-gray-100"
              />
            )}
            <label htmlFor="image" className="text-sm font-medium">
              Upload Photo:
            </label>
            <input
              type="file"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setValue("imageName", file.name, { shouldValidate: true }); // ? Set hasil baca ke name image
                    setValue("imagePath", reader.result as string, {
                      shouldValidate: true,
                    }); // ? Set hasil baca ke state preview
                  };
                  // ? let imagePath: string; // Deklarasi variabel dengan tipe string
                  // ? imagePath = reader.result as string;
                  reader.readAsDataURL(file); // ? Baca file sebagai URL
                }
              }}
              className="text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-200 file:text-gray-700"
            />
          </div>

          {/* // ? form */}
          <div className="flex flex-col gap-4 md:flex-1">
            {/* // * FOLDER NAME */}
            <div className="flex flex-col gap-1">
              <label htmlFor="folder" className="text-sm font-medium">
                Folder
              </label>

              <div className="flex items-center relative">
                <input
                  type="text"
                  placeholder={getValues("folderName")}
                  className="w-[100%] border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  {...register("folderName")}
                />
                {!isLoadingListPost ? (
                  Array.isArray(ListPostFolderData) &&
                  ListPostFolderData.length > 0 && (
                    <select
                      defaultValue="prev"
                      className="border rounded-md w-[16%] absolute right-2"
                      onChange={(e) =>
                        setValue("folderName", e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <option value="">Prev</option>
                      {ListPostFolderData.map((i) => (
                        <option value={i.folderName} key={i.folderName}>
                          {i.folderName}
                        </option>
                      ))}
                    </select>
                  )
                ) : (
                  <Loader2Icon />
                )}
              </div>
              {formState.errors.folderName && (
                <p className="text-red-600">
                  {formState.errors.folderName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Description:</label>
              <input
                type="text"
                id="description"
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                {...register("description")}
              />
              {formState.errors.description && (
                <p className="text-red-600">
                  {formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Hashtags */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Hashtags:</label>
              <input
                type="text"
                id="hashtag"
                placeholder="Type and press Enter..."
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                onKeyDown={(e) => handleHashtagKeyDown(e)}
              />
              <input type="hidden" {...register("hashtag")} />
              {formState.errors.hashtag && (
                <p className="text-red-600">
                  {formState.errors.hashtag.message}
                </p>
              )}
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
                      className="text-xs text-gray-600 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Category:</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((i) => {
                  const selected = getValues("category").includes(i.name);
                  return (
                    <button
                      key={i.name}
                      type="button"
                      onClick={() => {
                        const current = getValues("category");

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
                        } else {
                          trigger("category");
                        }
                      }}
                      className={`flex items-center gap-1 border px-3 py-1 rounded-full text-sm transition 
                  ${
                    selected
                      ? "bg-black text-white border-black border-f"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                    >
                      {i.icon} {i.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol submit */}
        <button
          type="submit"
          className="mt-6 w-full bg-white text-black py-3 rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PhotoPostForm;
