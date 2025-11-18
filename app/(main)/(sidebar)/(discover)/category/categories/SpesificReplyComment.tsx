import React, { useEffect, useState, useCallback, useContext } from "react";
import styles from "../../../../styles/aside/discover/categories/photography/OtherComment.module.css";
import { BsSendArrowUp } from "react-icons/bs";
import { BsReply } from "react-icons/bs";
import { LocalISOTime, RandomId } from "../../../../util/GenerateData";
import { categoriesContext } from "../../../../contexts";
import { isFetchingSubSpesificComment } from "./Effect";
import { showToast } from "../../../../util/Toast";
import {
  PostSubCommentTypes,
  SpesReplyStateTypes,
  UpdateSubCommentTypes,
} from "../../../../types/aside/discover/categories/Interface";
import { IoCloseOutline } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";

interface SpesificReplyCommentProps {
  idUniqueCm: number | null;
  parentCreatorIdUnique: number | null;
}

export const SpesificReplyComment = ({
  idUniqueCm,
  parentCreatorIdUnique,
}: SpesificReplyCommentProps) => {
  // * CONTEXT ======
  const {
    setSubSpesificComment,
    spesificSubComment,
    PostSubComment,
    updateSubComment,
    idUnique,
  } = useContext(categoriesContext);

  // * STATE ======
  const [spesReply, setSpesReply] = useState<SpesReplyStateTypes>({
    replyReceiver: null,
    replyName: "",
    text: "",
    typeAction: "post",
    idUniqueSubCm: null,
  });

  // * HANDLER ======
  const handleChange = useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.ChangeEvent<HTMLInputElement>,
      actionType: string,
      idUniqueSubCm: number | null,
      senderIdUnique: number | null,
      senderFirstName: string,
      receiver_id_unique: number | null,
      receiver_first_name: string,
      text: string
    ) => {
      switch (actionType) {
        case "newReply": {
          const { value } = e.currentTarget;
          setSpesReply((prev) => ({
            ...prev,
            text: value,
          }));
          break;
        }
        case "add": {
          setSpesReply((prev) => ({
            ...prev,
            replyReceiver: senderIdUnique,
            replyName: senderFirstName,
          }));
          break;
        }
        case "delete": {
          setSpesReply((prev) => ({
            ...prev,
            replyReceiver: null,
            replyName: "",
            typeAction: "post",
            idUniqueSubCm: null,
          }));
          break;
        }
        case "edit": {
          setSpesReply({
            replyReceiver: receiver_id_unique,
            replyName: receiver_first_name,
            text: text,
            typeAction: "update",
            idUniqueSubCm: idUniqueSubCm,
          });
          break;
        }
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "submit": {
          try {
            if (spesReply.typeAction === "update") {
              const updateReplyComment: UpdateSubCommentTypes = {
                ref_id_u_receiver: spesReply.replyReceiver,
                ref_id_unique_cm: idUniqueCm,
                id_unique_sub_cm: spesReply?.idUniqueSubCm,
                text: spesReply.text,
                created_at: LocalISOTime(),
                status: 1,
                type_action: spesReply?.typeAction,
              };
              console.log(`update`, updateReplyComment);
              // const data = await updateSubComment(updateReplyComment);
              // showToast({ type: "success", fallback: data });
            } else {
              const postReplyComment: PostSubCommentTypes = {
                ref_id_u_receiver: spesReply.replyReceiver,
                ref_id_unique_cm: idUniqueCm,
                id_unique_sub_cm: RandomId(),
                text: spesReply.text,
                status: 0,
                created_at: LocalISOTime(),
                type_action: spesReply?.typeAction,
              };
              console.log(`postReply`,postReplyComment);
              const data = await PostSubComment(postReplyComment);
              showToast({ type: "success", fallback: data });
            }
          } catch (error) {
            showToast({ type: "error", fallback: error });
            console.error(error);
          }
          setSpesReply({
            replyReceiver: null,
            replyName: "",
            text: "",
            typeAction: "post",
            idUniqueSubCm: null,
          });
          break;
        }
      }
    },
    [
      idUniqueCm,
      parentCreatorIdUnique,
      PostSubComment,
      spesReply.text,
      updateSubComment,
    ]
  );

  isFetchingSubSpesificComment({
    parentCreatorIdUnique,
    idUniqueCm,
    setSubSpesificComment,
  });

  // useEffect(() => console.log(idUniqueComment), [idUniqueComment]);
  // useEffect(() => console.log(spesificSubComment), [spesificSubComment]);
  // useEffect(() => console.log(spesReply), [spesReply]);

  return (
    <div className={styles.replyContainer}>
      {Array.isArray(spesificSubComment) && spesificSubComment.length > 0
        ? spesificSubComment.map((i) => (
            <div className={styles.replyItem} key={i.id_unique_sub_cm}>
              <div className={styles.replyItemContainer}>
                <div className={styles.auth}>
                  <p className={styles.replyAuthor}>{i.sender_first_name}</p>
                  {i.sender_id_unique === idUnique ? (
                    <button
                      onClick={(e) =>
                        handleChange(
                          e,
                          "edit",
                          i.id_unique_sub_cm,
                          i.sender_id_unique,
                          i.sender_first_name,
                          i.receiver_id_unique,
                          i.receiver_first_name,
                          i.text
                        )
                      }
                    >
                      <FiEdit3 className={styles._icon} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) =>
                        handleChange(
                          e,
                          "add",
                          null,
                          i.sender_id_unique,
                          i.sender_first_name,
                          null,
                          "",
                          ""
                        )
                      }
                    >
                      <BsReply className={styles._icon} />
                    </button>
                  )}
                </div>
                <p className={styles.replyText}>
                  {i?.receiver_id_unique === idUnique && (
                    <strong>{i.receiver_first_name}</strong>
                  )}
                  <span>{i.text}</span>
                </p>
              </div>
              {i.status !== 0 && <p className={styles.replyStatus}>Edited</p>}
            </div>
          ))
        : null}
      <div className={styles.replySection}>
        <form onSubmit={(e) => handleSubmit(e, "submit")}>
          {spesReply?.replyName && (
            <div className={styles.mention}>
              <p>{`@${spesReply?.replyName}`}</p>
              <button
                onClick={(e) =>
                  handleChange(e, "delete", null, null, "", null, "", "")
                }
              >
                <IoCloseOutline />
              </button>
            </div>
          )}
          <input
            type="text"
            value={spesReply.text}
            placeholder="Input Reply Comment ..."
            onChange={(e) =>
              handleChange(e, "newReply", null, null, "", null, "", "")
            }
          />
          <button type="submit" className={styles.replyButton}>
            <BsSendArrowUp />
          </button>
        </form>
      </div>
    </div>
  );
};
