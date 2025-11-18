"use client"

// import { useCallback, useContext, useEffect, useState, memo } from "react";
// import styles from "../../../../styles/aside/discover/categories/Photography.module.css";
// import { DEFAULT_SELECTED_IMAGE } from "../../../../types/aside/discover/categories/Default";
// import { SelectedItem } from "./Selected";
// import { Link } from "react-router-dom";
// import { ColorRing } from "react-loader-spinner";
// import { categoriesContext } from "../../../../contexts";
// import { LocalISOTime } from "../../../../util/GenerateData";
// import { UpdateStatusCategoriesState } from "../../../../types/aside/discover/categories/Interface";

// todo TEKS TRANSLATE
// todo SHARE KE TEMAN !!! THIRD PARTY
// todo HOMEPAGE BUAT JADI STORYTELLING !!! GANTI

const indexCategories = memo(() => {
  // // * CONTEXT ======
  // const {
  //   filterData,
  //   isLoadingSub,
  //   categoryName,
  //   editStatusRead,
  // } = useContext(categoriesContext);

  // // * STATE ======
  // const sortOptions = ["Newest", "Popular", "Trending"];
  // const [sortBy, setSortBy] = useState("Newest");

  // const [selectedImage, setSelectedImage] = useState({
  //   ...DEFAULT_SELECTED_IMAGE,
  // });

  // // * HANDLER ======
  // const handleAction = useCallback(
  //   async (
  //     e: React.SyntheticEvent,
  //     actionType: string,
  //     creatorIdUnique: number,
  //     idUniqueProduct: number,
  //     description: string,
  //     imageUrl: string,
  //     created_at: string,
  //     creator_picture: string | null,
  //     status_read: number | null
  //   ) => {
  //     e.preventDefault();
  //     switch (actionType) {
  //       case "openGallery": {
  //         if (status_read === null || 0) {
  //           try {
  //             const categories = categoryName?.replace(/-/g, " ");
  //             const updateStatusCategories: UpdateStatusCategoriesState = {
  //               id_unique_product: idUniqueProduct,
  //               categories: categories,
  //               status_read: 1,
  //               read_at: LocalISOTime(),
  //             };
  //             await editStatusRead(updateStatusCategories);
  //             console.log(updateStatusCategories);
  //           } catch (error) {
  //             console.error(error);
  //           }
  //         }
  //         setSelectedImage({
  //           isOpen: true,
  //           creatorIdUnique: creatorIdUnique,
  //           idUniqueProduct: idUniqueProduct,
  //           description: description,
  //           imageUrl: imageUrl,
  //           createdAt: created_at,
  //           creator_picture: creator_picture,
  //         });
  //         break;
  //       }
  //     }
  //   },
  //   [editStatusRead]
  // );

  // useEffect(() => console.log(filterData), [filterData]);
  // useEffect(() => console.log(selectedImage), [selectedImage]);

  return (
    <>
      {/* {isLoadingSub ? (
        <ColorRing />
      ) : ( */}
        <div className={styles.container}>
          {/* // * Header */}
          <div className={styles.header}>
            <div className={styles.controls}>
              <Link className={styles.link} to="/discover/categories">
                {`Back`}
              </Link>
            </div>
            <div className={styles.controls}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.dropdown}
              >
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* // * Gallery */}
          <div className={styles.gallery}>
            {Array.isArray(filterData) && filterData.length > 0 ? (
              filterData.map((i) => (
                <div
                  key={i.id_unique_product}
                  className={styles.card}
                  onClick={(e) =>
                    handleAction(
                      e,
                      "openGallery",
                      i.creator_id_unique,
                      i.id_unique_product,
                      i.description,
                      i.image_url,
                      i.created_at,
                      i.creator_picture,
                      i.status_read
                    )
                  }
                >
                  <img src={i.image_url} className={styles.image} />
                  <div className={styles.overlay}>
                    <p>{i.description || "Untitled"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.empty}>No photos found.</p>
            )}
          </div>

          {/* Modal */}
          {selectedImage.isOpen && (
            <SelectedItem
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          )}
        </div>
      )}
    </>
  );
});

export default indexCategories;
