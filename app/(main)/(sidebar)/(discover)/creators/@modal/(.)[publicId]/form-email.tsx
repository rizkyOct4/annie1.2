"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/_util/Toast";
import { zEmailFormSchema } from "./schema";

type EmailFormSchema = z.infer<typeof zEmailFormSchema>;

const FormEmail = () => {
  const { register, handleSubmit, formState } = useForm<EmailFormSchema>({
    // ? REGEXNYA DISINI TERJADI !!!!
    resolver: zodResolver(zEmailFormSchema),
    mode: "onChange",
  });

  const submit = handleSubmit(async (values) => {
    try {
      const post = {
        email: values.subject,
        password: values.message,
      };
      // const data = await getLogin(post);
      // showToast({ type: "success", fallback: data });
      // NavigateLogin(navigate, data.output?.role);
      console.log(post);
    } catch (error) {
      console.error(error);
      showToast({ type: "error", fallback: error });
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4 w-full h-full">
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-white mb-2"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="Input your subject email..."
          required
          {...register("subject")}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 form-input"
        />
        {formState.errors.subject && (
          <p className="invalidate">{formState.errors.subject.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="text-area"
          className="block text-sm font-medium text-white mb-2"
        >
          Message
        </label>
        <textarea
          id="text-area"
          rows={5}
          placeholder="Input your message..."
          required
          {...register("message")}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 form-input resize-none"
        />
        {formState.errors.message && (
          <p className="invalidate">{formState.errors.message.message}</p>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default FormEmail;
