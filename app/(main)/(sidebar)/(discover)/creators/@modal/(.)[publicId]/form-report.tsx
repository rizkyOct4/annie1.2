"use client";

import { useEffect, useState } from "react";

const FormReport = ({ creatorId }: { creatorId: string }) => {
  const [reason, setReason] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

//   useEffect(() => console.log(reason), [reason]);

  const reportOptions = ["@Spam", "@18+", "@Copyright", "Others"];

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      await fetch("/api/report-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId, reason }),
      });
      setSuccess(true);
      setReason([]); // reset select
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-[220px]">
      <span className="text-sm text-gray-700">Report User:</span>
      {reportOptions.map((opt) => (
        <label
          key={opt}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
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
            className="accent-blue-600"
          />
          {opt}
        </label>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!reason || loading}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>
      {success && (
        <p className="text-green-600 text-sm">Report berhasil dikirim!</p>
      )}
    </div>
  );
};

export default FormReport;
