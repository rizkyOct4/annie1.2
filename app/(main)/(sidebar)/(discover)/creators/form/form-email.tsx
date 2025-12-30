"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/_util/Toast";
import { zEmailFormSchema } from "../@modal/(.)/[id]/schema";

type EmailFormSchema = z.infer<typeof zEmailFormSchema>;

const FormEmail = ({ setRenderAction }: any) => {
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
    <div className="overlay">
      <div
        className="
        relative
        w-full max-w-md
        rounded-xl
        bg-black/80
        border border-white/10
        backdrop-blur-md
        p-5
      ">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-200">Send Email</h3>

          <button
            type="button"
            onClick={() => setRenderAction("")}
            className="
            p-1.5
            rounded-lg
            text-gray-400
            hover:text-gray-200
            hover:bg-white/10
          ">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="w-full flex flex-col gap-4">
          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Input your subject email..."
              {...register("subject")}
              required
              className="
              w-full rounded-lg
              bg-white/5
              border border-white/10
              px-4 py-2
              text-gray-200
              outline-none
            "
            />
            {formState.errors.subject && (
              <p className="mt-1 text-xs text-red-400">
                {formState.errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Message</label>
            <textarea
              rows={5}
              placeholder="Input your message..."
              {...register("message")}
              required
              className="
              w-full resize-none rounded-lg
              bg-white/5
              border border-white/10
              px-4 py-2
              text-gray-200
              outline-none
            "
            />
            {formState.errors.message && (
              <p className="mt-1 text-xs text-red-400">
                {formState.errors.message.message}
              </p>
            )}
          </div>

          {/* ACTION */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="
              px-4 py-2
              rounded-lg
              bg-white/10
              border border-white/10
              text-gray-200
              font-medium
            ">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEmail;
