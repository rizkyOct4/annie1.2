"use client";

import Image from "next/image";

const CreatorDesc = () => {
  const data = {
    tar_iu: 1,
    iu_description: "Creative designer & digital artist",
    username: "JejeArt",
    biodata: "Passionate about digital art and NFT collections.",
    gender: "Female",
    phone_number: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    picture: "/photo/1.webp",
    social_link: "https://instagram.com/jejeart",
    update_at: "2025-11-05T11:32:20.725Z",
  };

  return (
    <div className="flex bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden w-full h-full">
      {/* Left: Photo */}
      <div className="flex-shrink-0 w-[240px] relative">
        <Image
          src={data.picture}
          alt={data.username}
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Description */}
      <div className="flex flex-col justify-between p-5 gap-3 flex-1">
        {/* Top: Name & Short Description */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{data.username}</h2>
          <p className="text-sm text-gray-500 mt-1">{data.iu_description}</p>
        </div>

        {/* Middle: Biodata & Info */}
        <div className="flex flex-col gap-2 text-gray-700 text-sm">
          <p>{data.biodata}</p>
          <div className="flex flex-col gap-1">
            <span className="text-gray-600">
              <strong>Gender:</strong> {data.gender}
            </span>
            <span className="text-gray-600">
              <strong>Phone:</strong> {data.phone_number}
            </span>
            <span className="text-gray-600">
              <strong>Location:</strong> {data.location}
            </span>
          </div>
          {data.social_link && (
            <a
              href={data.social_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline break-all"
            >
              {data.social_link.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-400 text-right">
          Last updated:{" "}
          {new Date(data.update_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
};

export default CreatorDesc;
