"use client";

import Image from "next/image";
import { memo, useCallback, useState } from "react";
import { FaEnvelope, FaFlag, FaLink, FaCheckCircle } from "react-icons/fa";
import { TTargetCreatorsDescription } from "../../../types/type";
import {
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";

const CreatorDesc = ({
  data,
  setRenderAction,
}: {
  data: TTargetCreatorsDescription[];
  setRenderAction: any;
}) => {
  const creator = data?.[0];

  const dummySocialLink = [
    {
      platform: "instagram",
      icon: <FaInstagram className="text-lg" />,
    },
    {
      platform: "twitter",
      icon: <FaTwitter className="text-lg" />,
    },
    {
      platform: "github",
      icon: <FaGithub className="text-lg" />,
    },
    {
      platform: "youtube",
      icon: <FaYoutube className="text-lg" />,
    },
    {
      platform: "website",
      icon: <FaGlobe className="text-lg" />,
    },
  ];

  const copyProfile = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  const dummyStats = {
    totalPhoto: 24,
    totalVideo: 8,
    totalMusic: 5,
  };

  if (!creator) return null;

  return (
    <div
      className="
        flex w-full h-full
        overflow-hidden
        rounded-xl
        border border-white/10
      ">
      {/* ===== LEFT : AVATAR / COVER ===== */}
      <div className="relative w-80 shrink-0">
        <Image
          src={creator.picture ?? "/"}
          alt={creator.username}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />

        {/* VERIFIED BADGE */}
        {/* {creator.isVerified && ( */}
        <div
          className="
              absolute top-3 left-3
              flex items-center gap-1
              px-2 py-1
              rounded-md
              bg-black/70
              text-emerald-400
              text-xs
            ">
          <FaCheckCircle className="w-3 h-3" />
          Verified
        </div>
        {/* )} */}
      </div>

      {/* ===== RIGHT : CONTENT ===== */}
      <div className="flex flex-col justify-between p-5 gap-5 flex-1">
        {/* ===== HEADER ===== */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-200">
              {creator.username}
            </h2>

            {/* <p className="text-xs text-gray-500">
              Joined {new Date(creator.createdAt).toLocaleDateString()}
            </p> */}
          </div>

          {/* ===== ACTION BAR ===== */}
          <div className="flex items-center gap-2">
            {/* EMAIL */}
            {/* {creator.email && ( */}
            <button
              // href={`mailto:${creator.email}`}
              onClick={() => setRenderAction("email")}
              title="Send Email"
              className="
                  p-2 rounded-lg
                  bg-white/5
                  border border-white/10
                  text-gray-300
                  hover:text-emerald-400
                  hover:bg-white/10
                  transition
                ">
              <FaEnvelope className="w-4 h-4" />
            </button>
            {/* <a
              // href={`mailto:${creator.email}`}
              title="Send Email"
              className="
                  p-2 rounded-lg
                  bg-white/5
                  border border-white/10
                  text-gray-300
                  hover:text-emerald-400
                  hover:bg-white/10
                  transition
                ">
              <FaEnvelope className="w-4 h-4" />
            </a> */}
            {/* )} */}

            {/* COPY PROFILE */}
            <button
              onClick={copyProfile}
              title="Copy Profile Link"
              className="
                p-2 rounded-lg
                bg-white/5
                border border-white/10
                text-gray-300
                hover:text-blue-400
                hover:bg-white/10
                transition
              ">
              <FaLink className="w-4 h-4" />
            </button>

            {/* REPORT */}
            <button
              onClick={() => setRenderAction("report")}
              title="Report Creator"
              className="
                p-2 rounded-lg
                bg-white/5
                border border-white/10
                text-gray-400
                hover:text-red-400
                hover:bg-red-500/10
                transition
              ">
              <FaFlag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===== BIO ===== */}
        <div className="text-sm text-gray-300 leading-relaxed">
          {creator.biodata || "No bio provided."}
        </div>

        {/* ===== META INFO ===== */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="min-w-20 text-gray-400">Gender:</span>
            <span className="text-gray-300">{creator.gender || "-"}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="min-w-20 text-gray-400">Location:</span>
            <span className="text-gray-300">{creator.location || "-"}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="min-w-20 text-gray-400">Phone:</span>
            <span className="text-gray-300">{creator.phoneNumber || "-"}</span>
          </div>
        </div>

        <div className="flex gap-6 text-xs text-gray-400">
          <span>
            <strong className="text-gray-200">{dummyStats.totalPhoto}</strong>{" "}
            Photos
          </span>
          <span>
            <strong className="text-gray-200">{dummyStats.totalVideo}</strong>{" "}
            Videos
          </span>
          <span>
            <strong className="text-gray-200">{dummyStats.totalMusic}</strong>{" "}
            Music
          </span>
        </div>

        <div className="flex items-center gap-2">
          {Array.isArray(creator?.socialLink) &&
            creator?.socialLink.length > 0 &&
            creator?.socialLink.map(
              (i: { platform: string; value: string }) => {
                const social = dummySocialLink.find(
                  (d) => d.platform === i.platform
                );

                return (
                  <a
                    key={i.platform}
                    href={i.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={i.platform}
                    className="
          group
          w-9 h-9
          flex items-center justify-center
          rounded-lg
          bg-white/5
          border border-white/10
          text-gray-300
          hover:bg-white/10
        ">
                    <span
                      className="
            transition-colors
            group-hover:text-blue-400
          ">
                      {social?.icon}
                    </span>
                  </a>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default memo(CreatorDesc);
