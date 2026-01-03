"use client";

import Image from "next/image";
import { memo, useCallback, useState, useContext } from "react";
import { FaEnvelope, FaFlag, FaLink, FaCheckCircle } from "react-icons/fa";
import { TTargetCreatorsDescription } from "../../../types/type";
import {
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaGlobe,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import { creatorsContext, profileContext } from "@/app/context";
import { showToast } from "@/_util/Toast";
import { handleUnauthorized } from "@/_util/Unauthorized";
import { useRouter, useParams } from "next/navigation";
import type { TPostActionFollow } from "../../../types/type";

const CreatorDesc = ({
  data,
  setRenderAction,
}: {
  data: TTargetCreatorsDescription[];
  setRenderAction: any;
}) => {
  const { postFollowUser } = useContext(creatorsContext);
  const { data: getData } = useContext(profileContext);
  const sessionId = getData?.id;

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter();
  const { id: targetId } = useParams<{ id: string }>();

  const creator = data?.[0];
  // console.log(creator)

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

  const handleAction = useCallback(
    async (actionType: string) => {
      switch (actionType) {
        case "copyProfile":
          navigator.clipboard.writeText(window.location.href);
          break;
        case "follow": {
          try {
            if (sessionId === targetId) return;
            setIsLoading(true)
            const payload: TPostActionFollow = {
              idReceiver: targetId,
              status: true,
            };
            console.log(payload);
            await postFollowUser(payload);
            showToast({ type: "success", fallback: "Follow Success!" });
          } catch (err: any) {
            if (err.status === 401) {
              if (handleUnauthorized(err, router)) return;
              console.error(err);
            }
            console.error(err);
          }
          break;
        }
        case "unfollow": {
          try {
            if (sessionId === targetId) return;
            setIsLoading(true)
            const payload: TPostActionFollow = {
              idReceiver: targetId,
              status: false,
            };
            // console.log(payload);
            await postFollowUser(payload);
            showToast({ type: "success", fallback: "Unfollow Success!" });
          } catch (err: any) {
            console.error(err);
          }
          break;
        }
      }
    },
    [sessionId, targetId, router, postFollowUser]
  );

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
          src={creator?.picture ?? "/"}
          alt="#"
          fill
          priority
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
              {creator?.username}
            </h2>

            <p className="text-xs text-gray-500">
              Joined {new Date(creator?.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* ===== ACTION BAR ===== */}
          <div className="flex items-center gap-2">
            {/* {creator?.email && ( */}
            <button
              // href={`mailto:${creator?.email}`}
              type="button"
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

            {/* COPY PROFILE */}
            <button
              type="button"
              onClick={() => handleAction("copyProfile")}
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

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                handleAction(creator?.statusFollow ? "unfollow" : "follow")
              }
              title={
                creator?.statusFollow ? "Unfollow Creator" : "Follow Creator"
              }
              className={`
    p-2 rounded-lg
    bg-white/5
    border border-white/10
    transition flex-center gap-2
    ${
      creator?.statusFollow
        ? " text-green-400 bg-green-500/10"
        : "text-gray-400 hover:text-green-400 hover:bg-green-500/10"
    }
  `}>
              <p>{creator?.totalFollowers}</p>
              {creator?.statusFollow ? (
                <FaUserCheck className="w-4 h-4" />
              ) : (
                <FaUserPlus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ===== BIO ===== */}
        <div className="text-sm text-gray-300 leading-relaxed">
          {creator?.biodata || "No bio provided."}
        </div>

        {/* ===== META INFO ===== */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="min-w-20 text-gray-400">Gender:</span>
            <span className="text-gray-300">{creator?.gender || "-"}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="min-w-20 text-gray-400">Location:</span>
            <span className="text-gray-300">{creator?.location || "-"}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="min-w-20 text-gray-400">Phone:</span>
            <span className="text-gray-300">{creator?.phoneNumber || "-"}</span>
          </div>
        </div>

        <div className="flex gap-6 text-xs text-gray-400">
          <span>
            <strong className="text-gray-200">{creator?.totalPhoto}</strong>{" "}
            Photos
          </span>
          <span>
            <strong className="text-gray-200">{creator?.totalVideo}</strong>{" "}
            Videos
          </span>
          {/* <span>
            <strong className="text-gray-200">{dummyStats.totalMusic}</strong>{" "}
            Music
          </span> */}
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
