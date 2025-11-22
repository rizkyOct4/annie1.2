"use client";

import Image from "next/image";
import { memo, useCallback, useContext, useState } from "react";
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
  const { itemFolderData, isLoadingItemFolderPhoto, setIsIdDescription } =
    useContext(creatorContext);

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

  if (isLoadingItemFolderPhoto) return <SLoading />;

  return (
    <div className="w-full flex flex-wrap justify-start gap-5 my-4 h-[300px]">
      {Array.isArray(itemFolderData) &&
        itemFolderData.length > 0 &&
        itemFolderData.map(
          (i: { tarIuProduct: number; url: string; title: string }) => (
            <div
              key={i.tarIuProduct}
              className="
              relative flex flex-col overflow-hidden
              rounded-2xl w-[25%]
              bg-gradient-to-br from-gray-50 to-gray-100
              border border-gray-100 shadow-sm
        "
            >
              {/* Image wrapper */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={i.url}
                  alt={i.title ?? "Image"}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                  <>
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
                    {isOpen.open && isOpen.iuProduct === i.tarIuProduct && (
                      <>
                        {btnList.map((btn, idx) => (
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
                      </>
                    )}
                  </>
                </div>
              </div>
            </div>
          )
        )}
    </div>
  );
};

export default memo(ItemsList);
