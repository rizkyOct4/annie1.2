import React, { useState, useCallback, useEffect, useContext } from "react";
import styles from "../../../../styles/aside/discover/categories/photography/Report.module.css";
import { LocalISOTime, RandomId } from "../../../../util/GenerateData";
import { SelectedReportState } from "../../../../types/aside/discover/categories/Interface";
import { PostReportImageTypes } from "../../../../types/aside/discover/categories/Type";
import { PostSpesificReportAPI } from "../../../../services/aside/discover/Categories";
import { showToast } from "../../../../util/Toast";
import { DEFAULT_REPORT_STATE_CATEGORIES } from "../../../../types/aside/discover/categories/Default";
import { categoriesContext } from "../../../../contexts";

interface ReportFormProps {
  reportState: SelectedReportState;
  setReportState: React.Dispatch<React.SetStateAction<SelectedReportState>>;
}

export const ReportForm = ({
  reportState,
  setReportState,
}: ReportFormProps) => {
  // * CONTEXT ======
  const { idUnique } = useContext(categoriesContext);

  // * STATE ======
  const [textReport, setTextReport] = useState<string[]>([]);

  // * ITEMS ======
  const checkBox = [
    { label: "Negative Photo" },
    { label: "Ugly Photo" },
    { label: "Ilegal Photo" },
    { label: "Copyright Issue" },
    { label: "Abselutely Trash" },
  ];

  // * HANDLER ======
  const handleChange = useCallback((label: string) => {
    setTextReport((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  }, []);

  const handleAction = useCallback(
    async (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "submit": {
          try {
            if (idUnique === reportState?.creatorIdUnique) {
              showToast({
                type: "info",
                fallback: "You cannot report yourself.",
              });
              return;
            }
            const postReportImage: PostReportImageTypes = {
              id_unique_report: RandomId(),
              creator_id_unique: reportState?.creatorIdUnique,
              disc_id_post_report: null,
              image_id_post_report: reportState?.idUniqueProduct,
              type_post_report: "image",
              status: "receive",
              text_report: textReport.join(", "),
              created_at: LocalISOTime(),
            };
            console.log(postReportImage);
            const data = await PostSpesificReportAPI(postReportImage);
            showToast({ type: "success", fallback: data });
            setTextReport([]);
            setReportState({ ...DEFAULT_REPORT_STATE_CATEGORIES });
          } catch (error) {
            showToast({ type: "error", fallback: error });
            setTextReport([]);
            console.error(error);
          }
          break;
        }
        case "close": {
          setReportState({ ...DEFAULT_REPORT_STATE_CATEGORIES });
          break;
        }
      }
    },
    [textReport, PostSpesificReportAPI, idUnique]
  );

  // useEffect(() => console.log(textReport), [textReport])

  return (
    <div
      className={styles.reportContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <h3>⚠️ Report this content</h3>
      {checkBox.map((i, index) => (
        <div key={index} className={styles.reportOption}>
          <input
            type="checkbox"
            checked={textReport.includes(i.label)}
            onChange={() => handleChange(i.label)}
          />
          <p>{i.label}</p>
        </div>
      ))}
      <div className={styles.reportActions}>
        <button
          className={styles.modalButtons}
          onClick={(e) => handleAction(e, "submit")}
        >
          Submit
        </button>
        <button
          className={styles.modalButtons}
          onClick={(e) => handleAction(e, "close")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
