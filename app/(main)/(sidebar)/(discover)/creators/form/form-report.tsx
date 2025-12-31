"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const FormReport = ({ setRenderAction }: { setRenderAction: any }) => {
  const [reason, setReason] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reportOptions = ["@Spam", "@18+", "@Copyright", "Others"];

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      // await fetch("/api/report-user", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ creatorId, reason }),
      // });
      setSuccess(true);
      setReason([]); // reset select
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div
        className="
    min-w-80
    rounded-xl
    bg-black/80
    border border-white/10
    backdrop-blur-sm
    p-5
    flex flex-col
    gap-4
  ">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-200">
            Report User
          </span>

          {/* EXIT */}
          <button
            type="button"
            onClick={() => setRenderAction("")}
            className="
        p-1.5
        rounded-lg
        text-gray-400
        hover:text-gray-200
        hover:bg-white/10
        transition
      "
            aria-label="Close">
            <FaTimes size={14} />
          </button>
        </div>

        {/* OPTIONS */}
        <div className="flex flex-col gap-3">
          {reportOptions.map((opt) => (
            <label
              key={opt}
              className="
          flex items-start gap-3
          text-sm
          text-gray-300
          cursor-pointer
        ">
              <input
                type="checkbox"
                name="reportReason"
                value={opt}
                checked={reason.includes(opt)}
                onChange={() =>
                  setReason((prev) =>
                    prev.includes(opt)
                      ? prev.filter((i) => i !== opt)
                      : [...prev, opt]
                  )
                }
                className="
            mt-0.5
            w-4 h-4
            rounded
            accent-emerald-500
          "
              />
              <span className="leading-snug">{opt}</span>
            </label>
          ))}
        </div>

        {/* ACTION */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!reason.length || loading}
            className="
        px-4 py-1.5
        rounded-lg
        bg-white/10
        border border-white/10
        text-sm font-medium
        text-gray-200
        hover:bg-white/20
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
      ">
            {loading ? "Sending..." : "Send"}
          </button>

          {/* SUCCESS */}
          {success && (
            <span className="text-sm text-emerald-400">Report Success !</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormReport;