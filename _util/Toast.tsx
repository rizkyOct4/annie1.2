"use client"

import { toast } from "react-toastify";

let errorAttemp = 0;
let toastId: any;

const showToast = ({ type, fallback }: any) => {
  // console.log(fallback);
  let typeToast;
  switch (type) {
    case "success": {
      toast(fallback?.message, {
        className: "custom-toast",
        autoClose: 2000,
        closeButton: false,
      });
      break;
    }
    case "link": {
      toast(fallback, {
        className: "custom-toast",
        autoClose: 2000,
        closeButton: false,
      });
      break;
    }
    case "error": {
      errorAttemp++;
      toast.error(fallback.response.data?.message, {
        autoClose: 5000,
        draggable: true,
        closeButton: false, // ? toast yang bisa dipindahkan dengan mouse.
      });
      if (errorAttemp >= 3) {
        toast.warn("Something went wrong!");
        errorAttemp = 0;
      }
      break;
    }
    case "info": {
      toast.info(fallback, {
        autoClose: 2000,
        closeButton: false, // ! Menonaktifkan tombol close default
      });
      break;
    }
    case "custom": {
      toast.info(fallback, {
        autoClose: 5000,
        closeButton: false, // ! Menonaktifkan tombol close default
      });
      break;
    }
    case "loading": {
      if (fallback) {
        toastId = toast.loading("Uploading...", {
          className: "custom-toast",
          progressClassName: "custom-progress-bar",
        });
        // Menampilkan toast loading dan simpan ID-nya
      } else if (!fallback) {
        // Menghilangkan toast secara manual
        // toast.dismiss(toastId);
        toast.update(toastId, {
          render: "Upload success!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        toastId = null;
      }
      break;
    }
  }
  return { typeToast };
};

const showCustomToast2 = () => {
  toast("Here is your custom toast", {
    className: "custom-toast", // memberikan kelas CSS khusus
    progressClassName: "custom-progress-bar", // membuat progress bar custom
  });
};

// const showToastLoading = (value: boolean) => {
//   toast.loading("Uploading...", {
//     className: "custom-toast",
//     progressClassName: "custom-progress-bar",
//   });
// };
// toast.info("This is some information.", {
//   autoClose: 5000,
//   closeButton: false, // ! Menonaktifkan tombol close default
//   onClick: () => {
//     toast.success("Undo clicked!");
//   },
// });
      // showToast({
      //   type: "info",
      //   fallback: "You cannot bookmark your own product.",
      // });

export { showToast, showCustomToast2, toast };

// // Fungsi untuk menampilkan toast error
// const showErrorToast = () => {
//   toast.error("Something went wrong!", {
//     autoClose: 5000,
//     draggable: true, // ! toast yang bisa dipindahkan dengan mouse.
//   });
// };

// // Fungsi untuk menampilkan toast info
// // const showInfoToast = () => {

// // };

// // Fungsi untuk menampilkan toast warning
// const showWarnToast = () => {
//   toast.warn("This is a warning!", {
//     autoClose: 5000,
//     progress: 0.5, // Menentukan progres secara manual
//   });
// };

// // Fungsi untuk menampilkan toast dengan konten custom
// const showCustomToast = () => {
//   toast("Custom Toast with Icon!", {
//     className: "custom-toast", // Kelas CSS khusus
//     autoClose: 5000,
//     icon: "🚀", // Icon kustom
//   });
// };
// // Fungsi untuk menampilkan toast dengan konten custom
// const showCustomToast2 = () => {
//   toast("Here is your custom toast", {
//     className: "custom-toast", // memberikan kelas CSS khusus
//     progressClassName: "custom-progress-bar", // membuat progress bar custom
//   });
// };

// export {
//   showSuccessToast,
//   showInfoToast,
//   showWarnToast,
//   showErrorToast,
//   showCustomToast,
//   showCustomToast2,
// };
