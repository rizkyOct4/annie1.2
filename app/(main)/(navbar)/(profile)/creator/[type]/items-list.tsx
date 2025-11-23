"use client";

import Image from "next/image";
import {
  memo,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { creatorContext } from "@/app/context";
import { IoMdOpen } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { Delete } from "lucide-react";
import { BiExit } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import { Move3DIcon } from "lucide-react";
import { SLoading } from "@/_util/Spinner-loading";
import { IsRenderComponent } from "./folder-list";
import { useInView } from "react-intersection-observer";

const btnList = [
  { name: "update", icon: <MdUpdate />, title: "Update" },
  { name: "move", icon: <Move3DIcon />, title: "Move" },
  { name: "delete", icon: <Delete />, title: "Delete" },
  {
    name: "openDescription",
    icon: <MdDescription />,
    title: "Open Description",
  },
];

export interface ItemListState {
  open: boolean;
  iuProduct: number | null;
  value?: string;
}

const ItemsList = ({
  folderName,
  setIsRender,
}: {
  folderName: string;
  setIsRender: React.Dispatch<React.SetStateAction<IsRenderComponent>>;
}) => {
  const {
    itemFolderData,
    isLoadingItemFolderPhoto,
    setIsIdDescription,
    fetchNextPageItemFolder,
    isHasPageItemFolder,
    isFetchingNextPageItemFolder,
  } = useContext(creatorContext);

  // ? 🔹 ref untuk container scrollable
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ? 🔹 karena root belum ada saat render pertama, set setelah mount
  const [root, setRoot] = useState<Element | null>(null);

  // ? setup observer
  const { ref: lastItemRef, inView } = useInView({
    threshold: 0.5, // ! trigger ketika 20% elemen terlihat
    root,
  });

  useEffect(() => {
    if (inView && isHasPageItemFolder && !isFetchingNextPageItemFolder)
      fetchNextPageItemFolder();
    setRoot(containerRef.current);
  }, [
    inView,
    isHasPageItemFolder,
    fetchNextPageItemFolder,
    isFetchingNextPageItemFolder,
  ]);

  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<ItemListState>({
    open: false,
    iuProduct: null,
    value: "",
  });

  const handleAction = useCallback(
    (actionType: string, tarIuProduct: number, value: string) => {
      switch (actionType) {
        case "toggle": {
          setIsOpen((prev) => ({
            ...prev,
            open: prev.iuProduct === tarIuProduct ? false : true,
            iuProduct: prev.iuProduct === tarIuProduct ? null : tarIuProduct,
          }));
          setIsIdDescription((prev: any) =>
            prev === tarIuProduct ? null : tarIuProduct
          );
          break;
        }
        case "update": {
          setIsRender({
            isOpen: true,
            iuProduct: tarIuProduct,
            value: value,
          });
          break;
        }
        case "openDescription": {
          const newUrl = `${pathname}?folder-name=${folderName}&id=${tarIuProduct}`;
          history.pushState({}, "", newUrl);
          break;
        }
      }
    },
    [folderName, pathname, setIsRender, setIsIdDescription]
  );

  return (
    <div
      ref={containerRef}
      className="flex justify-center flex-wrap gap-5 w-full my-4 max-h-[400px] overflow-y-auto"
    >
      {Array.isArray(itemFolderData) &&
        itemFolderData.length > 0 &&
        itemFolderData.map(
          (i: { tarIuProduct: number; url: string; title: string }) => {
            const isLast = i.tarIuProduct === itemFolderData.length - 1;
            return (
              <div
                key={i.tarIuProduct}
                ref={isLast ? lastItemRef : null}
                className="relative flex flex-col w-[22%] h-[260px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100"
              >
                {/* Image wrapper */}
                <div className="relative w-full md:h-64 lg:h-72">
                  <Image
                    src={i.url}
                    alt={i.title ?? "Image"}
                    fill
                    className="object-cover"
                  />

                  {/* Buttons overlay */}
                  <div className="absolute bottom-3 flex flex-wrap gap-2 px-4">
                    {/* Toggle button */}
                    <button
                      className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 flex justify-center items-center hover:bg-white hover:text-black"
                      onClick={() => handleAction("toggle", i.tarIuProduct, "")}
                    >
                      {isOpen.iuProduct === i.tarIuProduct && isOpen.open ? (
                        <IoMdOpen />
                      ) : (
                        <BiExit />
                      )}
                    </button>

                    {/* Action buttons */}
                    {isOpen.open &&
                      isOpen.iuProduct === i.tarIuProduct &&
                      btnList.map((btn, idx) => (
                        <button
                          key={idx}
                          className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 flex justify-center items-center hover:bg-white hover:text-black"
                          onClick={() =>
                            handleAction(btn.name, i.tarIuProduct, btn.name)
                          }
                          title={btn.title}
                        >
                          {btn.icon}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Optional: title / description */}
                {i.title && (
                  <div className="p-2 text-sm font-medium text-gray-800 truncate">
                    {i.title}
                  </div>
                )}
              </div>
            );
          }
        )}
    </div>
  );
};

export default memo(ItemsList);

// todo INI BELUM FIX, KONDISIKAN BESOK SAMA KAU INI !! RENDERINGNYA KETIKA DI SCROOL PUN BERMASLAH !! GIX IT !! 