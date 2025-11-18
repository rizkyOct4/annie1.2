"use client";

import Image from "next/image";
import { memo, useCallback, useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { creatorContext } from "@/app/context";
import { IoMdOpen } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { Delete } from "lucide-react";
import { BiExit } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import { SLoading } from "@/_util/Spinner-loading";

interface LocalState {
  open: boolean;
  idProduct: number | null;
  value: string;
}

const ItemsList = ({ folderName }: { folderName: string }) => {
  const { itemFolderData, isLoading } =
    useContext(creatorContext);

  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<LocalState>({
    open: false,
    idProduct: null,
    value: "",
  });

  const handleAction = useCallback(
    (actionType: string, tarIuProduct: number, value: string) => {
      switch (actionType) {
        case "toggle": {
          setIsOpen((prev) => ({
            ...prev,
            open: prev.idProduct === tarIuProduct ? false : true,
            idProduct: prev.idProduct === tarIuProduct ? null : tarIuProduct,
          }));
          break;
        }
      }
    },
    []
  );

  if (isLoading) return <SLoading />;

  return (
    <div className="w-full flex flex-wrap justify-start gap-5 my-4 h-[300px]">
      {Array.isArray(itemFolderData) &&
        itemFolderData.length > 0 &&
        itemFolderData.map((i) => (
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
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 flex justify-center items-center hover:bg-white hover:text-black"
                  onClick={() => handleAction("toggle", i.tarIuProduct, "")}
                >
                  {isOpen.idProduct === i.tarIuProduct && isOpen.open ? (
                    <IoMdOpen />
                  ) : (
                    <BiExit />
                  )}
                </button>
                {isOpen.open && isOpen.idProduct === i.tarIuProduct && (
                  <>
                    <button
                      className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 flex justify-center items-center hover:bg-white hover:text-black"
                      onClick={() => console.log("Update clicked")}
                      title="Update"
                    >
                      <MdUpdate />
                    </button>

                    <button
                      className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 flex justify-center items-center hover:bg-white hover:text-black"
                      onClick={() => console.log("Delete clicked")}
                      title="Delete"
                    >
                      <Delete />
                    </button>

                    <button
                      className="w-9 h-9 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm text-gray-700 flex justify-center items-center hover:bg-white hover:text-black"
                      onClick={() =>
                        router.push(
                          `${pathname}?folder-name=${folderName}&id=${i.tarIuProduct}`
                        )
                      }
                      title="Open Description"
                    >
                      <MdDescription />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default memo(ItemsList);

//todo ganti semua file nama kau !! buat huruf kecil + -
// * ROUTE HANDLER KAU PISAHKAN KALAU UDAH TERLALU BANYAK !!!
