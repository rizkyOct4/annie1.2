// import styles from "../../../../styles/aside/discover/categories/photography/Selected.module.css";
// import { useState, useCallback, useEffect, useContext } from "react";
// import {
//   SelectedImageState,
//   SelectedReportState,
// } from "../../../../types/aside/discover/categories/Interface";
// import {
//   DEFAULT_COMMENT_STATE_CATEGORIES,
//   DEFAULT_REPORT_STATE_CATEGORIES,
//   DEFAULT_SELECTED_IMAGE,
//   DEFAULT_SHARE_STATE_CATEGORIES,
// } from "../../../../types/aside/discover/categories/Default";
// import { ReportForm } from "./ReportForm";
// import { AiOutlineFullscreenExit } from "react-icons/ai";
// import { Link } from "react-router-dom";
// import { categoriesContext } from "../../../../contexts";
// import { isFetchingSpesificProduct } from "./Effect";
// import { LocalISOTime, RandomId } from "../../../../util/GenerateData";
// import { showToast } from "../../../../util/Toast";
// import { LiaEyeSolid } from "react-icons/lia";
// import {
//   PostOrDelBookmarkTypes,
//   PostOrDelFollowTypes,
// } from "../../../../types/aside/discover/categories/Type";
// import { ShowComment } from "./CommentForm";
// import { VscCommentUnresolved } from "react-icons/vsc";
// import { VscEyeClosed } from "react-icons/vsc";
// import { CategoriesShare } from "./Share";

// todo BESOK KONDISIKAN USERS PRODUCT + HASHTAG DI TABELNYA !!!
// TODO LIAT GIMANA DATA CATGORIES KAU :D SOO FKING GOOD !!!! => USE PARAMS
// TODO BUAT STATS USERS SIAPA YG NGELIAT POSTINGANNYA !! TIAP READ DATA +1 !!!
// TODO HOMEPAGE + EXPLORE KAU GANTI !!! HAPUS KALAU PERLU !!! PAKAI SEMAKSIMAK MUNGKIN DI CATEGORIES !!!
// TODO BERSIHKAN STATE TIAP UDAH SIAP DIPAKAI !!! JANGAN BUANG" MEMORI GA PERLU !!!
// TODO UI KAU MASIH AMPAS WLWLWLWLWLWLWL TAEEEKKK
// todo STRUKTUR DATA KAU !! KALAU CUMA 1 AJA PAKAI OBJECT !! KALAU LEBIH DARI 1 BARU ARRAY OF OBJECT {[]} => PASTIKAN KONSISTEN KAU PAKAI CARA INI !! PERBAIKI LAGI CODE KAU !!! PASTIKAN BERSIH AJG !!!!

// todo FIXKAN DIKIT LAGI !!!

interface SelectedItemProps {
  selectedImage: SelectedImageState;
  setSelectedImage: React.Dispatch<React.SetStateAction<SelectedImageState>>;
}

export const SelectedItem = ({
  selectedImage,
  setSelectedImage,
}: SelectedItemProps) => {
  // * CONTEXT ======
  // const {
  //   spesificProduct,
  //   setIdProductSpesific,
  //   categoryName,
  //   editSpesificVote,
  //   editSpesificBookmark,
  //   editSpesificFollow,
  //   isLoadingSpesific,
  //   idUnique,
  // } = useContext(categoriesContext);

  // * STATE ======
  const [isOpen, setIsOpen] = useState("");

  const [reportState, setReportState] = useState({
    ...DEFAULT_REPORT_STATE_CATEGORIES,
  });
  const [commentState, setCommentState] = useState({
    ...DEFAULT_COMMENT_STATE_CATEGORIES,
  });
  const [shareState, setShareState] = useState({
    ...DEFAULT_SHARE_STATE_CATEGORIES,
  });

  // * HANDLER ======
  const handleAction = useCallback(
    async (
      e: React.SyntheticEvent<HTMLButtonElement>,
      actionType: string,
      idUniqueProduct: number,
      creatorIdUnique: number
    ) => {
      e.preventDefault();
      switch (actionType) {
        case "like":
        case "dislike": {
          try {
            const { value } = e.currentTarget;
            const voteData = {
              receiver_creator_id_unique: creatorIdUnique,
              voted_type: value,
              id_unique_product: idUniqueProduct,
              created_at: LocalISOTime(),
            };
            console.log(voteData);
            const data = await editSpesificVote(voteData);
            showToast({ type: "success", fallback: data });
          } catch (error) {
            showToast({ type: "error", fallback: error });
            console.error(error);
          }
          break;
        }
        case "follow":
        case "unfollow": {
          try {
            if (idUnique === creatorIdUnique) {
              showToast({
                type: "info",
                fallback: "You cannot follow yourself.",
              });
              return;
            }
            const followData: PostOrDelFollowTypes = {
              id_unique_product: idUniqueProduct,
              receiver_creator_id_unique: creatorIdUnique,
              status_follow: 1,
              update_at: LocalISOTime(),
              actionType: actionType,
            };
            console.log(followData);
            const data = await editSpesificFollow(followData);
            showToast({ type: "success", fallback: data });
            console.log(data);
          } catch (error) {
            showToast({ type: "error", fallback: error });
            console.error(error);
          }
          break;
        }
        case "addBookmark":
        case "updateBookmark": {
          try {
            const bookmarkData: PostOrDelBookmarkTypes = {
              ref_id_u_product: idUniqueProduct,
              status: 1,
              created_at: LocalISOTime(),
              actionType: actionType,
            };
            console.log(bookmarkData);
            const data = await editSpesificBookmark(bookmarkData);
            showToast({ type: "success", fallback: data });
          } catch (error) {
            showToast({ type: "error", fallback: error });
            console.error(error);
          }
          break;
        }
        case "share": {
          setIsOpen((prev) => (prev === actionType ? "" : actionType));
          try {
            setShareState((prev) => ({
              imageUrl: prev.imageUrl ? "" : selectedImage?.imageUrl,
            }));
          } catch (error) {
            console.error(error);
          }
          break;
        }
        case "report": {
          setIsOpen((prev) => (prev === actionType ? "" : actionType));
          setReportState((prev) => ({
            idUniqueProduct: prev.idUniqueProduct
              ? null
              : selectedImage.idUniqueProduct,
            creatorIdUnique: prev.creatorIdUnique ? null : creatorIdUnique,
          }));
          break;
        }
        case "openComment": {
          setIsOpen((prev) => (prev === actionType ? "" : actionType));
          setCommentState((prev) => ({
            idUniqueProduct:
              prev.idUniqueProduct === idUniqueProduct ? null : idUniqueProduct,
          }));
          break;
        }
      }
    },
    [editSpesificVote, editSpesificBookmark, editSpesificFollow]
  );

  // * FETCHING EFFECT ======
  isFetchingSpesificProduct({
    setIdProductSpesific,
    idUniqueProduct: selectedImage?.idUniqueProduct,
    categoryName,
    creatorIdUnique: selectedImage?.creatorIdUnique,
  });

  // useEffect(() => console.log(selectedImage), [selectedImage]);
  // useEffect(() => console.log(isOpen), [isOpen]);

  return (
    <>
      {isLoadingSpesific
        ? null
        : Array.isArray(spesificProduct) &&
          spesificProduct.map((i) => (
            <div
              key={i.id_unique_product}
              className={styles.modalOverlay}
              onClick={() => setSelectedImage({ ...DEFAULT_SELECTED_IMAGE })}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeButton}
                  onClick={() =>
                    setSelectedImage({ ...DEFAULT_SELECTED_IMAGE })
                  }
                >
                  <AiOutlineFullscreenExit />
                </button>
                <div className={styles.selectedImage}>
                  <div className={styles.image}>
                    <img
                      src={selectedImage.imageUrl}
                      alt="#"
                      className={styles.modalImage}
                    />
                  </div>
                  {isOpen === 'openComment' && (
                    <ShowComment commentState={commentState} />
                  )}
                  {isOpen === "report" && (
                    <ReportForm
                      reportState={reportState}
                      setReportState={setReportState}
                    />
                  )}
                  {isOpen === "share" && (
                    <CategoriesShare shareState={shareState} />
                  )}
                </div>
                <div className={styles.modalDesc}>
                  <div className={styles.creatorDesc}>
                    <Link
                      to="/discover/creator/creator-profile"
                      // state={{ userEmail: selectedImage.userEmail }}
                    >
                      <img
                        src={
                          selectedImage?.creator_picture || null || undefined
                        }
                        alt=""
                        className={styles.creatorPicture}
                      />
                    </Link>
                    <div>
                      <h2>{selectedImage.description || "Untitled"}</h2>
                      <p className={styles.date}>{selectedImage.createdAt}</p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    {/* // ? FOLLOW */}
                    {i.status_follow === 1 ? (
                      <button
                        className={styles.unfollow}
                        onClick={(e) =>
                          handleAction(
                            e,
                            "unfollow",
                            i.id_unique_product,
                            i.creator_id_unique
                          )
                        }
                      >
                        👤 Unfollow Creator
                      </button>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleAction(
                            e,
                            "follow",
                            i.id_unique_product,
                            i.creator_id_unique
                          )
                        }
                      >
                        👤 Follow Creator
                      </button>
                    )}
                    {/* // ? BOOKMARK */}
                    {i.bookmark_status === 1 ? (
                      <button
                        onClick={(e) =>
                          handleAction(
                            e,
                            "updateBookmark",
                            i.id_unique_product,
                            i.creator_id_unique
                          )
                        }
                      >
                        🔖 Delete From Bookmark
                      </button>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleAction(
                            e,
                            "addBookmark",
                            i.id_unique_product,
                            i.creator_id_unique
                          )
                        }
                      >
                        🔖 Add Bookmark
                      </button>
                    )}
                    {/* // ? SHARE */}
                    <button
                      onClick={(e) =>
                        handleAction(
                          e,
                          "share",
                          i.id_unique_product,
                          i.creator_id_unique
                        )
                      }
                    >
                      📤 Share
                    </button>
                    {/* // ? REPORT */}
                    <button
                      className={styles.actionButton}
                      onClick={(e) =>
                        handleAction(
                          e,
                          "report",
                          i.id_unique_product,
                          i.creator_id_unique
                        )
                      }
                    >
                      {isOpen !== "report" ? (
                        <>⚠️ Report</>
                      ) : (
                        <>
                          <VscEyeClosed /> Close
                        </>
                      )}
                    </button>
                    {/* // ? COMMENT */}
                    <button
                      className={styles.actionButton}
                      onClick={(e) =>
                        handleAction(
                          e,
                          "openComment",
                          i.id_unique_product,
                          i.creator_id_unique
                        )
                      }
                    >
                      {isOpen !== 'openComment' ? (
                        <>
                          <VscCommentUnresolved /> {`${i.total_comment || 0}`}
                        </>
                      ) : (
                        <>
                          <VscCommentUnresolved />
                          Close
                        </>
                      )}
                    </button>
                    {/* // ? LIKE */}
                    <button
                      className={styles.actionButton}
                      value={"like"}
                      onClick={(e) =>
                        handleAction(
                          e,
                          "like",
                          i.id_unique_product,
                          i.creator_id_unique
                        )
                      }
                    >
                      👍
                      <span>{i.total_like || 0}</span>
                    </button>
                    {/* // ? DISLIKE */}
                    <button
                      className={styles.actionButton}
                      value={"dislike"}
                      onClick={(e) =>
                        handleAction(
                          e,
                          "dislike",
                          i.id_unique_product,
                          i.creator_id_unique
                        )
                      }
                    >
                      👎
                      <span>{i.total_dislike || 0}</span>
                    </button>
                    {/* // ? TOTAL_OPEN */}
                    <div className={styles.actionButton}>
                      <span>
                        <LiaEyeSolid />{" "}
                      </span>
                      <p>{i.total_read || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </>
  );
};
