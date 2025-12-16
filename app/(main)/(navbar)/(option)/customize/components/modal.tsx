"use client";

import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Bio, SocialLink, OtherLabel } from "./label";
import { customizeContext } from "@/app/context";
import { ProfileSchema } from "../z-schema";

export type ProfileFormData = z.infer<typeof ProfileSchema>;

const ProfileCustomize = () => {
  const { customizeData } = useContext(customizeContext);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    mode: "onChange",
    defaultValues: {
      username: customizeData[0]?.username,
      biodata: customizeData[0]?.biodata,
      gender: customizeData[0]?.gender,
      phoneNumber: customizeData[0]?.phoneNumber,
      picture: customizeData[0]?.picture,
      socialLink: customizeData[0]?.socialLink ?? [{ platform: "", link: "" }],
      location: customizeData[0]?.location,
      // socialLink:,
    },
  });

  // useEffect(() => console.log(errors), [errors]);

  const submit = handleSubmit(async (values: ProfileFormData) => {
    console.log({
      ...values,
      phoneNumber: Number(values.phoneNumber),
    });
  });

  useEffect(() => {
    if (customizeData) {
      reset({
        username: customizeData[0]?.username,
        biodata: customizeData[0]?.biodata,
        gender: customizeData[0]?.gender,
        phoneNumber: customizeData[0]?.phoneNumber,
        picture: customizeData[0]?.picture,
        socialLink: customizeData[0]?.socialLink ?? [],
        location: customizeData[0]?.location,
      });
    }
  }, [customizeData, reset]);

  // ? change data from array into object !!
  const data = Object.entries(watch()).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-bold mb-10 tracking-tight">
          Profile Settings
        </h1>

        <form onSubmit={submit}>
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col md:flex-row gap-8">
            <div className="w-full flex flex-col gap-4">
              {data.map(({ key, value }) => (
                <div
                  key={key}
                  className="flex items-center gap-4 border-b border-white/10 pb-2 h-auto">
                  <div className="flex flex-col w-full h-auto">
                    {key === "socialLink" && (
                      <SocialLink
                        value={value}
                        register={register}
                        setValue={setValue}
                      />
                    )}
                    {["username", "phoneNumber", "gender", "location"].includes(
                      key
                    ) && (
                      <OtherLabel
                        fieldKey={key}
                        value={value}
                        register={register}
                        errors={errors}
                      />
                    )}
                    {key === "picture" && <Image setValue={setValue} />}
                    {key === "biodata" && (
                      <Bio fieldKey={key} value={value} register={register} />
                    )}
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCustomize;
