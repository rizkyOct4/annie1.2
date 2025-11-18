import { useContext, useState, useCallback, useEffect } from "react";
import { creatorProductContext } from "../../../contexts";
import styles from "../../../styles/profile/PostForm.module.css";
import { showToast } from "../../../util/Toast";
import { LocalISOTime } from "../../../util/GenerateData";
import { FormRegex, ForbiddenRegex } from "../../../util/Regex";
import {
  DEFAULT_INVALIDATE_DESCRIPTION_STATE,
  DEFAULT_PUT_PRODUCT_STATE,
} from "../../../types/profile/default";
import { ImageProductTypes } from "../../../types/profile/Type";
import { UpdateProductTypesData } from "../../../types/profile/Interface";

const categories = [
  { name: "Photography", icon: "🎥" },
  { name: "Videography", icon: "🎥" },
  { name: "Digital Art", icon: "🎨" },
  { name: "Architecture", icon: "🏙️" },
  { name: "Fashion", icon: "👗" },
  { name: "Nature", icon: "🌿" },
  { name: "Food & Drink", icon: "🍳" },
  { name: "Automotive", icon: "🚗" },
  { name: "Astrophotography", icon: "🌌" },
  { name: "Mobile Shots", icon: "📱" },
  { name: "Travel", icon: "🧳" },
  { name: "Creative Concepts", icon: "🎭" },
  { name: "Lifestyle & People", icon: "👶" },
  { name: "Behind The Scenes", icon: "🔧" },
];

interface UpdateFormProps {
  dataUpdate: ImageProductTypes;
  idUniqueProduct: number;
  updateUrl: string | null;
  closeForm: () => void;
}

const UpdateForm = ({
  dataUpdate,
  idUniqueProduct,
  updateUrl,
  closeForm,
}: UpdateFormProps) => {
  // * CONTEXT ======
  const { putProduct } = useContext(creatorProductContext);

  // * STATE ======
  const [invalidateDescription, setInvalidateDescription] = useState({
    ...DEFAULT_INVALIDATE_DESCRIPTION_STATE,
  });
  const [hashtagValue, setHashtagValue] = useState("");

  // * NEW PUT DATA STATE ======
  const [newPutData, setNewPutData] = useState<UpdateProductTypesData>({
    id_unique_product: idUniqueProduct,
    description: dataUpdate?.description,
    image_name: "",
    image_path: "",
    created_at: dataUpdate?.created_at,
    categories: dataUpdate?.categories || [],
    hashtags: dataUpdate?.hashtags || [],
  });

  // * HANDLER ======
  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement>,
      actionType: string,
      category: string
    ) => {
      switch (actionType) {
        case "image": {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setNewPutData((prev) => ({
                ...prev,
                image_name: file.name, // ? Set hasil baca ke name image
                image_path: reader.result as string, // ? Set hasil baca ke state preview
              }));
            };
            reader.readAsDataURL(file);
          }
          break;
        }
        case "description": {
          const { name, value } = e.currentTarget;
          const forbiddenCharsRegex = ForbiddenRegex();

          if (!FormRegex().test(value) && forbiddenCharsRegex) {
            const match = value.match(forbiddenCharsRegex)?.join("") || "";
            setInvalidateDescription({
              isInvalid: true,
              message: `${actionType} Invalid character found`,
              character: match,
            });
          } else if (value.length > 30) {
            setInvalidateDescription({
              isInvalid: true,
              message: `${actionType} Max 30 characters`,
              character: "",
            });
          } else {
            setInvalidateDescription({
              isInvalid: false,
              message: "",
              character: "",
            });
          }
          setNewPutData((prev) => ({
            ...prev,
            [name]: value,
          }));
          break;
        }
        case "categoriesOption": {
          if (newPutData.categories.length == 3) {
            setNewPutData((prev) => ({
              ...prev,
              categories: prev.categories.filter((i) => i !== category),
            }));
            break;
          }
          setNewPutData((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
              ? prev.categories.filter((i) => i !== category)
              : [...prev.categories, category],
          }));
          break;
        }
        case "hashtag": {
          const { value } = e.currentTarget;
          const forbiddenCharsRegex = ForbiddenRegex();

          if (!FormRegex().test(value) && forbiddenCharsRegex) {
            const match = value.match(forbiddenCharsRegex)?.join("") || "";
            setInvalidateDescription({
              isInvalid: true,
              message: `* ${actionType} Invalid characters used`,
              character: match,
            });
          } else {
            setInvalidateDescription({
              isInvalid: false,
              message: "",
              character: "",
            });
          }
          setHashtagValue(value);
          break;
        }
        case "removeHashtag": {
          const { value } = e.currentTarget;
          setNewPutData((prev) => ({
            ...prev,
            hashtags: prev.hashtags.filter((i) => i !== value),
          }));
          break;
        }
      }
    },
    [newPutData.categories]
  );

  const handleAction = useCallback(
    async (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "submit": {
          try {
            const putImage = {
              ...newPutData,
              created_at: LocalISOTime(),
              prev_url: updateUrl,
            };
            console.log(putImage);
            closeForm();
            setNewPutData({ ...DEFAULT_PUT_PRODUCT_STATE });
            await putProduct(putImage);
          } catch (error) {
            closeForm();
            showToast({ type: "error", fallback: error });
            setNewPutData({ ...DEFAULT_PUT_PRODUCT_STATE });
          }
          break;
        }
        case "close": {
          closeForm();
          break;
        }
      }
    },
    [putProduct, newPutData, idUniqueProduct, updateUrl]
  );

  const handleHashtagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const trim = hashtagValue.trim().replace(/^#/, "");
        if (
          trim &&
          !newPutData.hashtags.includes(trim) &&
          !invalidateDescription.isInvalid
        ) {
          setNewPutData((prev) => ({
            ...prev,
            hashtags: [...prev.hashtags, trim],
          }));
          setHashtagValue("");
        }
      }
    },
    [hashtagValue, newPutData.hashtags, invalidateDescription.isInvalid]
  );

  // useEffect(() => console.log(newPutData), [newPutData]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContent}>
        <form
          onSubmit={(e) => handleAction(e, "submit")}
          className={styles.formContainer}
        >
          <span
            className={styles.close}
            onClick={(e) => handleAction(e, "close")}
          >
            &times;
          </span>

          {/* === TOP SECTION: Image + Inputs === */}
          <div className={styles.topSection}>
            {/* Left: Upload Image */}
            <div className={styles.imageSection}>
              <img
                src={newPutData?.image_path || updateUrl || ""}
                alt="Preview"
                className={styles.previewImage}
              />
              <label htmlFor="image">Upload Photo:</label>
              <input
                type="file"
                name="image"
                onChange={(e) => handleChange(e, "image", "")}
              />
            </div>

            {/* Right: Text Inputs */}
            <div className={styles.rightSection}>
              {/* === DESCRIPTION === */}
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                name="description"
                value={newPutData?.description}
                onChange={(e) => handleChange(e, "description", "")}
                placeholder="Type your description..."
              />

              {/* === HASHTAG === */}
              <div className={styles.hashtag_container}>
                <label>Hashtags:</label>
                <div className={styles.tag_input_box}>
                  <div className={styles.tag_c}>
                    <input
                      type="text"
                      value={hashtagValue}
                      className={styles.hashtag_input}
                      placeholder="Type and press Enter..."
                      onChange={(e) => handleChange(e, "hashtag", "")}
                      onKeyDown={(e) => handleHashtagKeyDown(e)}
                    />
                    {newPutData.hashtags.map((i) => (
                      <span key={i} className={styles.tag}>
                        {i}
                        <button
                          className={styles.remove_tag}
                          type="button"
                          value={i}
                          onClick={(e) => handleChange(e, "removeHashtag", "")}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* === CATEGORY === */}
              <label htmlFor="categories">Category:</label>
              <div className={styles.categoriesWrapper}>
                {categories.map((i) => {
                  const isSelected = newPutData.categories.includes(i.name);
                  const className = isSelected
                    ? styles.categoriesHighlight
                    : styles.categoriesOption;
                  return (
                    <button
                      type="button"
                      key={i.name}
                      onClick={(e) =>
                        handleChange(e, "categoriesOption", i.name)
                      }
                      className={className}
                    >
                      {i.icon} {i.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* === BOTTOM SUBMIT === */}
          <div className={styles.bottomSection}>
            {invalidateDescription.isInvalid ? (
              <>
                <p className={styles.checkDesc}>
                  {invalidateDescription.message}
                  {invalidateDescription.character}
                </p>
                <button className={styles.button} type="submit" disabled>
                  X
                </button>
              </>
            ) : (
              <button className={styles.button} type="submit">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export { UpdateForm };
