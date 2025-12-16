"use client";

import { RiProfileLine, RiImageLine } from "react-icons/ri";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";

export const Image = ({ setValue }: { setValue: any }) => {
  return (
    <div className="w-full flex items-center justify-start gap-4">
      <RiImageLine size={28} />
      <label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setValue("currentPicture", file.name, {
                  shouldValidate: true,
                });
                setValue("picture", reader.result as string, {
                  shouldValidate: true,
                });
              };
              reader.readAsDataURL(file);
            }
          }}
          className="mt-1 p-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
    </div>
  );
};

export const Bio = ({
  fieldKey,
  value,
  register,
}: {
  fieldKey: string;
  value:
    | string
    | { platform?: string | undefined; link?: string | undefined }[];
  register: any;
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-4">
      <RiProfileLine size={28} />
      <div className="w-full">
        <label className="block font-semibold mb-2">{fieldKey}</label>
        <textarea
          rows={5}
          defaultValue={value}
          {...register("biodata")}
          className="
                  w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 
                  text-gray-200 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "></textarea>
      </div>
    </div>
  );
};

export const SocialLink = ({
  value,
  register,
  setValue,
}: {
  value: [{ platform?: string | undefined; link?: string | undefined }];
  register: any;
  setValue: any;
}) => {
  const socialPlatforms = [
    {
      platform: "instagram",
      link: "",
      icon: <FaInstagram className="text-pink-500" />,
    },
    {
      platform: "github",
      link: "",
      icon: <FaGithub className="text-gray-300" />,
    },
    {
      platform: "linkedin",
      link: "",
      icon: <FaLinkedin className="text-blue-500" />,
    },
    {
      platform: "twitter",
      link: "",
      icon: <FaTwitter className="text-sky-400" />,
    },
    {
      platform: "facebook",
      link: "",
      icon: <FaFacebook className="text-blue-600" />,
    },
    {
      platform: "youtube",
      link: "",
      icon: <FaYoutube className="text-red-500" />,
    },
    {
      platform: "website",
      link: "",
      icon: <FaGlobe className="text-green-400" />,
    },
  ];

  const updated = socialPlatforms.map((i) => {
    const match = value?.find((v) => (v.platform === i.platform ? v.link : ""));

    return match ? { ...i, link: match } : i;
  });

  return (
    <>
      {updated.map((s, idx) => (
        <div
          key={s.platform}
          className="flex items-center gap-4 p-3 bg-black/30 hover:bg-black/40 transition-colors">
          <span className="text-xl shrink-0">{s.icon}</span>

          <div className="flex flex-col w-full">
            <input
              type="text"
              defaultValue={s.link}
              {...register(`socialLink.${idx}.link`, {
                onChange: () => {
                  setValue(`socialLink.${idx}.platform`, s.platform);
                },
              })}
              className="
                  w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 
                  text-gray-200 placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
            />
          </div>
        </div>
      ))}
    </>
  );
};

export const OtherLabel = ({
  fieldKey,
  value,
  register,
  errors,
}: {
  fieldKey: string;
  value:
    | string
    | { platform?: string | undefined; link?: string | undefined }[];
  register: any;
  errors: any;
}) => {
  return (
    <div key={fieldKey} className="w-full">
      <label className="block font-semibold mb-2">
        <span className="flex items-center gap-2">
          {fieldKey}
          {errors[fieldKey] && (
            <p className="text-red-500 text-xs">{errors[fieldKey]?.message}</p>
          )}
        </span>
        <input
          type={fieldKey === "phoneNumber" ? "number" : "text"}
          defaultValue={value}
          {...register(fieldKey)}
          className={`
            w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 
            text-gray-200 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${fieldKey === "phoneNumber" ? "no-spin" : ""}
            `}
        />
      </label>
    </div>
  );
};
