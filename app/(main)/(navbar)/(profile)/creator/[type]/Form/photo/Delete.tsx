import { useContext, useCallback, useState, memo } from "react";
import styles from "../../../styles/profile/DeleteForm.module.css";
import { creatorProductContext } from "../../../contexts";
import { ColorRing } from "react-loader-spinner";
import { showToast } from "../../../util/Toast";

interface DeleteFormProps {
  id_unique_product: number;
  image_url: string | null;
  closeForm: () => void;
}

const DeleteForm = memo(
  ({ id_unique_product, closeForm, image_url }: DeleteFormProps) => {
    // * CONTEXT ======
    const { deleteProduct } = useContext(creatorProductContext);

    // * STATE ======
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    // * HANDLER ======
    const handleAction = useCallback(
      async (e: React.SyntheticEvent, actionType: string) => {
        e.preventDefault();
        switch (actionType) {
          case "submit": {
            try {
              setIsLoadingButton(true);
              const data = await deleteProduct(id_unique_product);
              showToast({ type: "success", fallback: data });
              closeForm();
            } catch (error) {
              setIsLoadingButton(false);
              console.error(error);
              showToast({ type: "error", fallback: error });
            }
            break;
          }
          case "close": {
            closeForm();
            break;
          }
        }
      },
      [deleteProduct, id_unique_product, image_url]
    );

    return (
      <div className={styles.overlay}>
        <div className={styles.modalContent}>
          <form onSubmit={(e) => handleAction(e, "submit")}>
            <span
              className={styles.close}
              onClick={(e) => handleAction(e, "close")}
            >
              &times;
            </span>
            <img src={`${image_url}`} />
            <h4>Are you sure wanna delete this photo ? </h4>
            <div className={styles.button}>
              {isLoadingButton ? (
                <button className={styles.buttonC} type="submit" disabled>
                  <ColorRing width={40} height={40} />
                </button>
              ) : (
                <button className={styles.buttonC} type="submit">
                  Yes
                </button>
              )}
              <button
                className={styles.buttonC}
                type="button"
                onClick={closeForm}
              >
                No
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export { DeleteForm };
