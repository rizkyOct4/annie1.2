"use client";

import { HomepageNotification } from "../page";
import Image from "next/image";
import { memo } from "react";

interface ModalNotificationProps {
  data: HomepageNotification[];
}

const ModalNotification = ({ data }: ModalNotificationProps) => {
  return (
    <>
      <div className="space-y-4">
        {data.map((n) => (
          <div key={n.id} className="border-b pb-2 w-full">
            <div className="flex items-center w-[80%] gap-2">
              <Image
                src={n.actor.avatar}
                alt={n.actor.name}
                className="rounded-full"
                width={40}
                height={60}
              />
              <div>
                <p className="text-sm font-medium">{n.message}</p>
                <p className="text-xs text-gray-500">
                  {/* {new Date(n.createdAt).toLocaleString()} */}
                  {n.createdAt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(ModalNotification);
