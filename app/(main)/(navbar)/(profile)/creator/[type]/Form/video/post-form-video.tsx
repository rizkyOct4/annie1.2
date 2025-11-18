"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { zPostVideoFormSchema } from "./schema";
import { RandomId, LocalISOTime } from "@/_util/GenerateData";
import { ForbiddenRegex } from "@/_util/Regex";
import { StateBtn } from "../../nav-dashboard";

type PostVideoFormSchema = z.infer<typeof zPostVideoFormSchema>;

const videoCategories: string[] = [
  "Art & Design",
  "Animation",
  "Music",
  "Gaming",
  "Education",
  "Tutorial",
  "Vlog",
  "Lifestyle",
  "Comedy",
  "Technology",
  "Sports",
  "Travel",
  "Food & Cooking",
  "Fitness",
  "Fashion & Beauty",
  "News & Politics",
  "Science",
  "Photography",
  "DIY & Crafts",
  "Movies & Entertainment",
];

const PostFormVideo = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<StateBtn>>;
}) => {
  const { register, handleSubmit, formState, setValue, getValues, watch } =
    useForm<PostVideoFormSchema>({
      resolver: zodResolver(zPostVideoFormSchema),
      mode: "onChange",
      defaultValues: {
        videoName: "",
        videoFile: null,
        folderName: "",
        hashtag: [],
        category: [],
      },
    });

  const submit = handleSubmit(async (values) => {
    try {
      const postVideo = {
        iuProduct: RandomId(),
        // publicId: publicId,
        description: values.description,
        videoName: values.videoFile?.name,
        videoFile: values.videoFile,
        hashtags: values.hashtag,
        categories: values.category,
        type: "video",
        folderName: values.folderName,
        createdAt: LocalISOTime(),
      };
      console.log(postVideo);
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
          onClick={() => setIsOpen({ open: false, type: "" })}
          className="absolute top-4 right-4 text-2xl leading-none text-gray-800 hover:text-black hover:cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-black">Upload Video</h2>

        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side */}
            <div className="flex-1 flex flex-col gap-4">
              <label className="flex flex-col text-sm text-black">
                Video File
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setValue(
                      "videoFile",
                      e.target.files ? e.target.files[0] : null,
                      { shouldValidate: true }
                    )
                  }
                  className="mt-1 p-2 border border-gray-400 rounded-md text-black bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
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

            {/* Right side */}
            <div className="flex-1 flex flex-col gap-4">
              <label className="flex flex-col text-sm text-black">
                Folder
                <input
                  type="text"
                  placeholder={watch("folderName")}
                  className="mt-1 p-2 border border-gray-400 rounded-md text-black bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("folderName")}
                />
              </label>
              {formState.errors.folderName && (
                <p className="text-red-600 text-sm">
                  {formState.errors.folderName.message}
                </p>
              )}

              <label className="flex flex-col text-sm text-black">
                Hashtags
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-400 rounded-md text-black bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Type and press Enter..."
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
                      if (hashtags.includes(input)) return;
                      setValue("hashtag", [...hashtags, input], {
                        shouldValidate: true,
                      });
                      e.currentTarget.value = "";
                    }
                  }}
                />
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
                        const values = watch("hashtag");
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

              <label className="flex flex-col text-sm text-black gap-2">
                Category
                <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                  {videoCategories.map((i, idx) => {
                    const selected = getValues("category").includes(i);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const current = watch("category");
                          if (current.includes(i)) {
                            setValue(
                              "category",
                              current.filter((f) => f !== i),
                              { shouldValidate: true }
                            );
                          } else if (current.length < 3) {
                            setValue("category", [...current, i], {
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
                        {i}
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
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostFormVideo;


//todo besok kondisikan video lagi sma kau !!! 