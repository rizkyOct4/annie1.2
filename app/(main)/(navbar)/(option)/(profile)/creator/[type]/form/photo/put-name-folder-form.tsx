"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zPutNameFolderFormSchema } from "../../schema/schema-form";
import { useContext } from "react";
import { creatorContext } from "@/app/context";
import { showToast } from "@/_util/Toast";

type PutFormSchema = z.infer<typeof zPutNameFolderFormSchema>;

const PutFolderNameForm = ({
  currentFoldername,
}: {
  currentFoldername: string;
}) => {
  const { updateNameFolder } = useContext(creatorContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PutFormSchema>({
    resolver: zodResolver(zPutNameFolderFormSchema),
    mode: "onChange",
    defaultValues: {
      folderName: currentFoldername,
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const payload = {
        targetFolder: currentFoldername,
        value: values.folderName,
      };
      const res = await updateNameFolder(payload);
      //   console.log(res);
      showToast({ type: "success", fallback: res.message });

      // setIsRender({ open: false, type: "" });
      //   console.log(payload);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 h-9 px-2
                 rounded-md border border-white/20
                 focus-within:border-blue-500
                 transition-colors">
      <input
        {...register("folderName")}
        type="text"
        defaultValue={currentFoldername}
        className="flex-1 bg-transparent
               text-sm font-medium text-white
               focus:outline-none"
      />
      {errors.folderName && (
        <p className="text-red-500 text-xs">{errors.folderName.message}</p>
      )}
      <button
        type="submit"
        className="text-white/70 hover:text-blue-500
               transition-colors">
        ✓
      </button>
    </form>
  );
};

export default PutFolderNameForm;
