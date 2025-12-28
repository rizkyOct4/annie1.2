"use client";

import axios from "axios";

export const uploadVideoToCloudinary = async (file: File | null, id: string) => {
  const formData = new FormData();

  formData.append("file", file!);
  formData.append("upload_preset", "nextprototype_videos");
  formData.append("folder", `users/${id}/products/videos`);

  const URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/video/upload`;

  const res = await axios.post(URL, formData, {
    timeout: 0,
    onUploadProgress: (e) => {
      if (!e.total) return;
      const percent = Math.round((e.loaded * 100) / e.total);
      console.log("Upload:", percent, "%");
    },
  });

  return res.data;
};

// export const uploadVideoToCloudinary = (
//   file: File,
//   id: string
// ): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/video/upload`;

//     xhr.open("POST", url);

//     // OPTIONAL (biar lebih aman)
//     xhr.timeout = 0;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "nextprototype_videos");
//     formData.append("folder", `users/${id}/products/videos`);

//     // 📊 Progress upload
//     xhr.upload.onprogress = (e) => {
//       if (!e.lengthComputable) return;
//       const percent = Math.round((e.loaded * 100) / e.total);
//       console.log("Upload:", percent, "%");
//     };

//     // ✅ Success
//     xhr.onload = () => {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(JSON.parse(xhr.responseText));
//       } else {
//         reject({
//           status: xhr.status,
//           response: xhr.responseText,
//         });
//       }
//     };

//     // ❌ Network error
//     xhr.onerror = () => {
//       reject(new Error("Cloudinary upload failed (network error)"));
//     };

//     xhr.send(formData);
//   });
// };


// todo KONDISIKAN BESOK SAMA KAU LAGI AUTH !! KURANG DIKIT LAGI !!!
