"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IntNotification } from "./page";

interface IntNotifDescriptionProps {
  data: IntNotification[];
  idParams?: string;
}

const IntNotifDescription = ({ data, idParams }: IntNotifDescriptionProps) => {
  const router = useRouter();

  const [state, setState] = useState(false);

  const handleAction = useCallback(
    (e: React.SyntheticEvent, actionType: string, id: string, img: string) => {
      e.preventDefault();
      switch (actionType) {
        case "close": {
          setState(false);
          router.push("/homepage");
          break;
        }
        case "closeDesc": {
          setState(false);
          router.push(`/homepage/notification`);
          break;
        }
        case "open": {
          setState(true);
          router.push(`/homepage/notification?id=${id}`);
        }
      }
    },
    [router]
  );

  useEffect(() => console.log(data), [data]);

  return (
    <div className="flex w-full gap-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-lg border">
        {/* Header modal */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={(e) => handleAction(e, "close", "", "")}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="divide-y">
          {data.map((n) => (
            <div
              key={n.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            >
              <Image
                src={n.actor.avatar}
                alt={n.actor.name}
                width={40}
                height={40}
                className="rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <button
                  onClick={(e) => handleAction(e, "open", n.id, n.actor.avatar)}
                  className="text-left w-full"
                >
                  <p className="text-sm text-gray-800 line-clamp-2">
                    {n.message}
                  </p>
                </button>
                <p className="text-xs text-gray-500 mt-0.5">{n.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {state && (
        <div className="bg-white rounded-xl shadow-lg max-w-xs max-h-[80vh] overflow-y-auto border">
          <div className="relative">
            <>
              {data.map(
                (i) =>
                  i.id === idParams && (
                    <Image
                      key={i.id}
                      src={i.actor.avatar}
                      alt="#"
                      width={300}
                      height={460}
                      className="rounded-t-xl object-cover"
                    />
                  )
              )}
            </>
            <button
              className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded hover:bg-black/70 transition"
              onClick={(e) => handleAction(e, "closeDesc", "", "")}
            >
              ← Back
            </button>
          </div>
          <div className="p-3 text-sm text-gray-700">
            Detail notif atau konten tambahan di sini…
          </div>
        </div>
      )}
    </div>
  );
};

export default IntNotifDescription;
