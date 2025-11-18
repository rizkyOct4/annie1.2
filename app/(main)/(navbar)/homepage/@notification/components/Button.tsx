"use client";

import { useRouter } from "next/navigation";

export const NotificationPageBtn = () => {
  const router = useRouter();

  return (
    <div className="fixed right-2 w-[60px] opacity-0 group-hover:opacity-100">
      <button onClick={() => router.push("/homepage/notification")}>
        Open
      </button>
    </div>
  );
};
