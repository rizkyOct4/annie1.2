"use client";

import Link from "next/link";
import type { CreatorProps } from "@/app/(main)/(navbar)/(profile)/creator/@video/page";
import { usePathname } from "next/navigation";

// interface Props {
//   params: { role: string };
//   searchParams: { type?: "photo" | "video" | undefined };
// }

export const CreatorButton = ({ searchParams }: CreatorProps) => {
  const role = usePathname();
  const type = searchParams?.type;
  return (
    <div>
      {/* <h1>Path {role}</h1> */}
      <h1>searchParams {type}</h1>
      <Link href={`http://localhost:3000/${role}?type=photo`}>Photo</Link>
      <Link href={`http://localhost:3000/${role}?type=video`}>Video</Link>
    </div>
  );
};
