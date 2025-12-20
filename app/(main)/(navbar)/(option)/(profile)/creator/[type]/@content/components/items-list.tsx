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
import { usePathname, useRouter } from "next/navigation";
import { creatorContext } from "@/app/context";
import { IoMdOpen } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { BiExit } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
// import { IsRenderComponent } from "./folder-list";
import { useInView } from "react-intersection-observer";
import { TItemFolderPhoto } from "../../types/content/type";
import OptionBtn from "./options/option-btn";
import { MdCheck, MdClose } from "react-icons/md";
import Loading from "@/app/loading";

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
}

const ItemsList = ({
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
  const router = useRouter();

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
  });

  const handleAction = useCallback(
    (actionType: string, idProduct: number, value?: string) => {
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
          // setIsIdDescription((prev: any) =>
          //   prev === idProduct ? null : idProduct
          // );
          break;
        }
        case "update": {
          setIsRender({
            isOpen: true,
            idProduct: idProduct,
            value: value,
          });
          setUpdateState(idProduct);
          // console.log("test")
          break;
        }
        case "openDescription": {
          router.push(
            `${pathname}/description?folder-name=${folderName}&id=${idProduct}`
          );
          break;
          // const newUrl = `${pathname}/description?folder-name=${folderName}&id=${idProduct}`;
          // history.pushState({}, "", newUrl);
          // break;
        }
      }
    },
    [folderName, pathname, router, setIsRender, setUpdateState]
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
          className="relative flex justify-center flex-wrap gap-5 w-full my-4 max-h-100 overflow-y-auto">
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((i: { idProduct: number; url: string }, idx) => {
              const isLast = idx === data.length - 1;
              return (
                <div
                  key={i.idProduct}
                  ref={isLast ? lastItemRef : null}
                  className="relative flex flex-col w-[22%] h-65 rounded-2xl overflow-hidden border border-gray-100">
                  {/* Image wrapper */}
                  <div className="relative w-full md:h-64 lg:h-72">
                    <Image
                      src={i.url}
                      alt={"Image"}
                      fill
                      className="object-cover"
                    />
                    {["move", "delete"].includes(isOpenNav.type) && (
                      <button
                        onClick={() => handleAction("navAction", i.idProduct)}
                        className={`absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-xl transition-colors
                        ${
                          isOpenNav?.idProduct.includes(i.idProduct)
                            ? "bg-black/80 text-white"
                            : "bg-white/80 text-gray-700"
                        }`}>
                        {isOpenNav?.idProduct.includes(i.idProduct) ? (
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
                        onClick={() => handleAction("toggle", i.idProduct, "")}>
                        {isOpen.iuProduct === i.idProduct && isOpen.open ? (
                          <IoMdOpen />
                        ) : (
                          <BiExit />
                        )}
                      </button>

                      {/* Action buttons */}
                      {isOpen.open &&
                        isOpen.iuProduct === i.idProduct &&
                        btnList.map((btn, idx) => (
                          <button
                            key={idx}
                            className="text-sm font-medium text-gray-600 w-9 h-9 rounded-xl bg-white/80 border border-gray-200 flex-center hover:bg-white hover:text-black"
                            onClick={() =>
                              handleAction(btn.name, i.idProduct, btn.name)
                            }
                            title={btn.title}>
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

export default ItemsList;
