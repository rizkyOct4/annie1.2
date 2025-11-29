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
import { BiExit } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import { SLoading } from "@/_util/Spinner-loading";
import { IsRenderComponent } from "./folder-list";
import { useInView } from "react-intersection-observer";
import { TItemFolderPhoto } from "../../type/content/type";
import OptionBtn from "./options/option-btn";
import { MdCheck, MdClose } from "react-icons/md";

const btnList = [
  { name: "update", icon: <MdUpdate />, title: "Update" },
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

export interface ItemListStateNav {
  isOpen: boolean;
  iuProduct: number[];
  type: string;
  targetFolder: string;
}

const ItemsList = ({
  data,
  folderName,
  setStateFolder,
}: {
  data: TItemFolderPhoto[];
  folderName: string;
  setStateFolder: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
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
    threshold: 0.2, // ! trigger ketika 20% elemen terlihat
    root,
  });

  useEffect(() => {
    if (inView && isHasPageItemFolder && !isFetchingNextPageItemFolder)
      fetchNextPageItemFolder();
    setRoot(containerRef.current);
  }, [
    isHasPageItemFolder,
    fetchNextPageItemFolder,
    isFetchingNextPageItemFolder,
    inView,
  ]);

  const pathname = usePathname();

  // ? Items State
  const [isOpen, setIsOpen] = useState<ItemListState>({
    open: false,
    iuProduct: null,
    value: "",
  });

  // ? Navigation State
  const [isOpenNav, setIsOpenNav] = useState<ItemListStateNav>({
    isOpen: true,
    iuProduct: [],
    type: "",
    targetFolder: "",
  });

  const handleAction = useCallback(
    (actionType: string, tarIuProduct: number, value?: string) => {
      switch (actionType) {
        // ? Item Nav Action
        case "navAction": {
          setIsOpenNav((prev: any) => ({
            ...prev,
            iuProduct: prev.iuProduct.includes(tarIuProduct)
              ? prev.iuProduct.filter((f: number) => f !== tarIuProduct)
              : [...prev.iuProduct, tarIuProduct],
          }));
          break;
        }
        // ? Item Action
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
        // case "update": {
        //   setStateFolder({
        //     isOpen: true,
        //     iuProduct: tarIuProduct,
        //     value: value,
        //   });
        //   break;
        // }
        case "openDescription": {
          const newUrl = `${pathname}?folder-name=${folderName}&id=${tarIuProduct}`;
          history.pushState({}, "", newUrl);
          break;
        }
      }
    },
    [folderName, pathname, setIsIdDescription]
  );

  return (
    <>
      {isOpenNav && (
        <OptionBtn isOpenNav={isOpenNav} setIsOpenNav={setIsOpenNav} />
      )}
      <div
        ref={containerRef}
        className="relative flex justify-center flex-wrap gap-5 w-full my-4 max-h-[400px] overflow-y-auto"
      >
        {Array.isArray(data) &&
          data.length > 0 &&
          data.map((i: { tarIuProduct: number; url: string }, idx) => {
            const isLast = idx === data.length - 1;
            return (
              <div
                key={idx}
                ref={isLast ? lastItemRef : null}
                className="relative flex flex-col w-[22%] h-[260px] rounded-2xl overflow-hidden border border-gray-100 "
              >
                {/* Image wrapper */}
                <div className="relative w-full md:h-64 lg:h-72">
                  <Image
                    src={i.url}
                    alt={"Image"}
                    fill
                    className="object-cover"
                  />
                  {isOpenNav.type !== "" && (
                    <button
                      onClick={() => handleAction("navAction", i.tarIuProduct)}
                      className={`absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-xl transition-colors
                        ${
                          isOpenNav?.iuProduct.includes(i.tarIuProduct)
                            ? "bg-black/80 text-white"
                            : "bg-white/80 text-gray-700"
                        }`}
                    >
                      {isOpenNav?.iuProduct.includes(i.tarIuProduct) ? (
                        <MdCheck size={20} />
                      ) : (
                        <MdClose size={20} />
                      )}
                    </button>
                  )}

                  {/* Buttons overlay */}
                  <div className="absolute bottom-3 flex flex-wrap gap-2 px-4">
                    {/* Toggle button */}
                    <button
                      className="w-9 h-9 rounded-xl bg-white/80 border border-gray-200 text-gray-700 flex-center"
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
                          className="text-sm font-medium text-gray-600 w-9 h-9 rounded-xl bg-white/80 border border-gray-200 flex-center hover:bg-white hover:text-black"
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
              </div>
            );
          })}
      </div>
    </>
  );
};

export default memo(ItemsList);
