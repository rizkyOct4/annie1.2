"use client";

import Image from "next/image";
import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { creatorContext } from "@/app/context";
import { IoMdOpen } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { BiExit } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { TItemFolderPhoto } from "../../types/content/type";
import OptionBtn from "./options/option-btn";
import { MdCheck, MdClose } from "react-icons/md";
import Loading from "@/app/(main)/loading";

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
  idProduct: number[];
  type: string;
  targetFolder: string;
  prevFolder: string;
}

const PhotoCard = ({
  data,
  folderName,
  setIsRender,
}: {
  data: TItemFolderPhoto[];
  folderName: string;
  setIsRender: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const {
    setUpdateState,
    isFetchingItemFolder,
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
    idProduct: [],
    type: "",
    targetFolder: "",
    prevFolder: folderName,
  });

  const handleAction = useCallback(
    (
      e: React.SyntheticEvent,
      actionType: string,
      idProduct: number,
      value?: string
    ) => {
      e.preventDefault();
      switch (actionType) {
        // ? Item Nav Action
        case "navAction": {
          setIsOpenNav((prev: any) => ({
            ...prev,
            idProduct: prev.idProduct.includes(idProduct)
              ? prev.idProduct.filter((f: number) => f !== idProduct)
              : [...prev.idProduct, idProduct],
          }));
          break;
        }
        // ? Item Action
        case "toggle": {
          setIsOpen((prev) => ({
            ...prev,
            open: prev.iuProduct === idProduct ? false : true,
            iuProduct: prev.iuProduct === idProduct ? null : idProduct,
          }));
          break;
        }
        case "update": {
          setIsRender({
            isOpen: true,
            idProduct: idProduct,
            value: value,
          });
          setUpdateState(idProduct);
          break;
        }
        case "openDescription": {
          const newUrl = `${pathname}/description?folder-name=${folderName}&id=${idProduct}`;
          history.pushState({}, "", newUrl);
          break;
        }
      }
    },
    [folderName, pathname, setIsRender, setUpdateState]
  );

  return (
    <>
      {isOpenNav && (
        <OptionBtn isOpenNav={isOpenNav} setIsOpenNav={setIsOpenNav} />
      )}
      {isFetchingItemFolder ? (
        <Loading />
      ) : (
        <div
          ref={containerRef}
          className="relative flex flex-wrap justify-center gap-6 w-full h-full overflow-y-auto">
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((i: { idProduct: number; url: string }, idx) => {
              const isLast = idx === data.length - 1;

              return (
                <div
                  key={i.idProduct}
                  ref={isLast ? lastItemRef : null}
                  className="
            relative
            flex flex-col
            w-[22%]
            rounded-2xl
            overflow-hidden
            bg-white/5
            border border-white/10
            hover:border-white/20
            transition
            group
          ">
                  {/* ===== IMAGE ===== */}
                  <div className="relative w-full aspect-3/4">
                    <Image
                      src={i.url}
                      alt="Image"
                      fill
                      sizes="(max-width: 200px) 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />

                    {/* Select / Move / Delete */}
                    {["move", "delete"].includes(isOpenNav.type) && (
                      <button
                        onClick={(e) =>
                          handleAction(e, "navAction", i.idProduct)
                        }
                        className={`
                  absolute top-3 left-3
                  w-9 h-9
                  rounded-xl
                  flex items-center justify-center
                  transition
                  backdrop-blur-sm
                  ${
                    isOpenNav?.idProduct.includes(i.idProduct)
                      ? "bg-black/70 text-white"
                      : "bg-white/80 text-gray-700 hover:bg-white"
                  }
                `}>
                        {isOpenNav?.idProduct.includes(i.idProduct) ? (
                          <MdCheck size={18} />
                        ) : (
                          <MdClose size={18} />
                        )}
                      </button>
                    )}

                    {/* ===== OVERLAY ACTIONS ===== */}
                    <div
                      className="
    absolute bottom-3 left-0 right-0
    flex items-center gap-2
    px-4
    opacity-0 translate-y-2
    group-hover:opacity-100 group-hover:translate-y-0
    transition-all duration-200 ease-out
  ">
                      {/* Toggle */}
                      <button
                        className="
      w-9 h-9
      rounded-lg
      bg-white/80
      backdrop-blur-sm
      border border-gray-200
      text-gray-700
      flex items-center justify-center
      hover:bg-white
      hover:shadow-sm
      transition
    "
                        onClick={(e) =>
                          handleAction(e, "toggle", i.idProduct, "")
                        }>
                        {isOpen.iuProduct === i.idProduct && isOpen.open ? (
                          <IoMdOpen />
                        ) : (
                          <BiExit />
                        )}
                      </button>

                      {/* Extra actions */}
                      {isOpen.open &&
                        isOpen.iuProduct === i.idProduct &&
                        btnList.map((btn, idx) => (
                          <button
                            key={idx}
                            title={btn.title}
                            className="
          w-9 h-9
          rounded-lg
          bg-white/80
          backdrop-blur-sm
          border border-gray-200
          text-gray-600
          flex items-center justify-center
          hover:bg-white hover:text-black
          hover:shadow-sm
          transition
        "
                            onClick={(e) =>
                              handleAction(e, btn.name, i.idProduct, btn.name)
                            }>
                            {btn.icon}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default PhotoCard;
