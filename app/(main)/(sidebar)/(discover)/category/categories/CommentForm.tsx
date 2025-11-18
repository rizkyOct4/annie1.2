import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  memo,
} from "react";
import styles from "../../../../styles/aside/discover/categories/photography/Comment.module.css";
import { VscRefresh } from "react-icons/vsc";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { BsSendArrowUp } from "react-icons/bs";
import { MdOutlineQuickreply } from "react-icons/md";
import { categoriesContext } from "../../../../contexts";
import { LocalISOTime, RandomId } from "../../../../util/GenerateData";
import {
  OtherReplyState,
  SelectedCommentState,
} from "../../../../types/aside/discover/categories/Interface";
import { isFetchingSpesificComment } from "./Effect";
import { showToast } from "../../../../util/Toast";
import { PostNewCommentTypes } from "../../../../types/aside/discover/categories/Type";
import { SpesificReplyComment } from "./SpesificReplyComment";

interface ShowCommentProps {
  commentState: SelectedCommentState;
}

export const ShowComment = memo(({ commentState }: ShowCommentProps) => {
  // * CONTEXT =====
  const {
    spesificComment,
    setIdUniqueProductComment,
    PostComment,
    idUnique,
    isLoadingSpesComment,
  } = useContext(categoriesContext);

  // * STATE =====
  const [inputComment, setInputComment] = useState("");

  const [otherReply, setOtherReply] = useState<OtherReplyState>({
    isOpen: false,
    idUniqueCm: null,
    parentCreatorIdUnique: null,
  });

  // * HANDLER =====
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setInputComment(value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "submit": {
          try {
            const postData: PostNewCommentTypes = {
              ref_id_u_product: commentState.idUniqueProduct,
              id_unique_cm: RandomId(),
              text: inputComment,
              created_at: LocalISOTime(),
            };
            console.log(postData);
            const data = await PostComment(postData);
            showToast({ type: "success", fallback: data });
            setInputComment("");
          } catch (error) {
            showToast({ type: "error", fallback: error });
            console.error(error);
          }
          break;
        }
      }
    },
    [inputComment, commentState, PostComment]
  );

  const handleAction = useCallback(
    async (
      e: React.SyntheticEvent,
      actionType: string,
      idUniqueCm: number,
      parentCreatorIdUnique: number
    ) => {
      e.preventDefault();
      switch (actionType) {
        case "spesificComment": {
          setOtherReply((prev) => ({
            isOpen: prev.idUniqueCm === idUniqueCm ? false : true,
            idUniqueCm: prev.idUniqueCm === idUniqueCm ? null : idUniqueCm,
            parentCreatorIdUnique:
              prev.idUniqueCm === idUniqueCm ? null : parentCreatorIdUnique,
          }));
          break;
        }
      }
    },
    []
  );

  // * EFFECT =====
  isFetchingSpesificComment({
    idUniqueProduct: commentState?.idUniqueProduct,
    setIdUniqueProductComment,
  });

  // useEffect(() => console.log(spesificComment), [spesificComment]);
  // useEffect(() => console.log(otherReply), [otherReply]);

  return (
    <div className={styles.commentContainer}>
      {/* List of replies */}
      <div className={styles.commentList}>
        {isLoadingSpesComment ? (
          <ColorRing />
        ) : Array.isArray(spesificComment) && spesificComment.length > 0 ? (
          spesificComment.map((i, index) => (
            <div className={styles.commentItem} key={index}>
              <div className={styles.commentBox}>
                <div className={styles.author}>
                  {i.url_picture ? (
                    <img src={i.url_picture} alt="#" />
                  ) : (
                    <GiPlagueDoctorProfile />
                  )}
                </div>
                <div className={styles.commentItemList}>
                  <div className={styles.text}>{i.text}</div>
                  {i.other_reply !== 0 ? (
                    <button
                      className={styles.replyBtn}
                      type="button"
                      onClick={(e) =>
                        handleAction(
                          e,
                          "spesificComment",
                          i.id_unique_cm,
                          i.creator_id_unique
                        )
                      }
                    >
                      Other Reply {i.other_reply}
                    </button>
                  ) : (
                    <button
                      className={styles.replyBtn}
                      type="button"
                      onClick={(e) =>
                        handleAction(
                          e,
                          "spesificComment",
                          i.id_unique_cm,
                          i.creator_id_unique
                        )
                      }
                    >
                      New comment
                    </button>
                  )}
                  {otherReply.idUniqueCm === i.id_unique_cm && (
                    <SpesificReplyComment
                      idUniqueCm={otherReply.idUniqueCm}
                      parentCreatorIdUnique={otherReply.parentCreatorIdUnique}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.commentItem}>
            <div className={styles.commentBox}>
              <div className={styles.author}>
                <GiPlagueDoctorProfile />
              </div>
              <div className={styles.text}>No Comment.</div>
            </div>
          </div>
        )}
      </div>

      {/* Reply form at bottom */}
      <div className={styles.replySection}>
        <form onSubmit={(e) => handleSubmit(e, "submit")}>
          <input
            type="text"
            value={inputComment}
            placeholder="Input New Comment ..."
            onChange={(e) => handleChange(e)}
          />
          <button type="submit" className={styles.replyButton}>
            <BsSendArrowUp />
          </button>
        </form>
      </div>
    </div>
  );
});
