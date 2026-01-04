"use client";

import { RandomId, LocalISOTime } from "@/_util/GenerateData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useContext, memo, useState } from "react";
import { creatorContext, profileContext } from "@/app/context";
import { ToggleStateType } from "../../types/interface";
import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";
import { zPostVideoFormSchema } from "./schema";
import { showToast } from "@/_util/Toast";
import { uploadVideoToCloudinary } from "./direct-upload-video";
// import Chunked from "./Chunk";

type PostFormSchema = z.infer<typeof zPostVideoFormSchema>;

const videoCategories = [
  { name: "Cinematic", icon: "🎬" },
  { name: "Short Films", icon: "🎞️" },
  { name: "Documentary", icon: "📽️" },
  { name: "Vlog", icon: "📹" },
  { name: "Commercial & Ads", icon: "📺" },
  { name: "Music Video", icon: "🎵" },
  { name: "Animation & Motion Graphics", icon: "🌀" },
  { name: "Tutorial & Education", icon: "🎓" },
  { name: "Tech Reviews", icon: "💻" },
  { name: "Gaming", icon: "🎮" },
  { name: "Live Performance", icon: "🎤" },
  { name: "Interview & Podcast", icon: "🎙️" },
  { name: "Travel Video", icon: "🌍" },
  { name: "Food & Cooking", icon: "🍔" },
  { name: "Sports & Action", icon: "🏃‍♂️" },
  { name: "Drone & Aerial", icon: "🚁" },
  { name: "Timelapse", icon: "⏱️" },
  { name: "Behind The Scenes", icon: "🔧" },
  { name: "Fashion Film", icon: "👗" },
  { name: "Event Coverage", icon: "🎉" },
  { name: "Product Showcase", icon: "📦" },
  { name: "Social Media Reels", icon: "📲" },
  { name: "Stock Footage", icon: "🗂️" },
  { name: "Experimental", icon: "🧪" },
];

export type TPostVideo = {
  idProduct: number;
  description: string;
  hashtag: string[];
  category: string[];
  folderName: string;
  type: string;
  createdAt: Date;

  // hasil cloudinary
  url: string;
  publicId: number;
  duration: number;
  width: number;
  height: number;
  format: string;
  thumbnailUrl: string;
};

const PostVideoForm = ({
  setIsRender,
}: {
  setIsRender: React.Dispatch<React.SetStateAction<ToggleStateType>>;
}) => {
  const { data: getData } = useContext(profileContext);
  const id = getData?.id;
  const { ListPostFolderData, refetchListPostFolder, postVideo } =
    useContext(creatorContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormSchema>({
    resolver: zodResolver(zPostVideoFormSchema),
    mode: "onChange",
    defaultValues: {
      folderName: "",
      hashtag: [],
      category: [],
      description: "",
    },
  });
  const [showDummyFolder, setShowDummyFolder] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);

  const submit = handleSubmit(async (values) => {
    try {
      setIsRender({ open: false, type: "" });
      showToast({ type: "loading", fallback: true });

      // ! DIRECT CLOUDINARY
      const cloudinaryRes = await uploadVideoToCloudinary(videoFile, id);

      // console.log(cloudinaryRes)

      // === 2. INSERT DATABASE (JSON) ===
      const payload: TPostVideo = {
        idProduct: RandomId(),
        description: values.description,
        hashtag: values.hashtag,
        category: values.category,
        folderName: values.folderName,
        type: "video",
        createdAt: LocalISOTime(),

        // result cloudinary
        url: cloudinaryRes.secure_url,
        publicId: cloudinaryRes.public_id,
        duration: cloudinaryRes.duration,
        width: cloudinaryRes.width,
        height: cloudinaryRes.height,
        format: cloudinaryRes.format,
        thumbnailUrl: cloudinaryRes.secure_url.replace(".mp4", ".jpg"),
      };

      const res = await postVideo(payload);
      console.log(res.message);

      showToast({ type: "loading", fallback: false });
    } catch (err) {
      console.error(err);
      showToast({ type: "loading", fallback: false });
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

        <h2 className="mb-6 text-2xl font-bold">Upload Video</h2>

        <form
          className="flex max-h-[75vh] flex-col gap-6 overflow-hidden"
          onSubmit={submit}>
          <div className="flex flex-col gap-6 overflow-y-auto pr-1 md:flex-row">
            {/* LEFT */}
            <div className="flex flex-1 flex-col gap-4 p-1">
              {videoFile && (
                <video
                  src={URL.createObjectURL(videoFile)}
                  controls
                  className="mt-2 w-full max-h-64 rounded-lg border border-white/10"
                />
              )}
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-white/80">Upload Video</span>

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // setValue("videoFile", file, {
                    //   shouldValidate: true,
                    // });
                    setVideoFile(file);
                  }}
                  className="rounded-md border border-white/20 bg-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                      placeholder="Select folder..."
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
                  {videoCategories.map((i) => {
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

export default PostVideoForm;
