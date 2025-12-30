"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/_util/Toast";
import { useRouter } from "next/navigation";
import { zLoginFormSchema } from "./schema-form";
import { signIn } from "next-auth/react";

type LoginFormSchema = z.infer<typeof zLoginFormSchema>;

const thirdParty = [
  { name: "G", value: "google" },
  { name: "Git", value: "github" },
];

const Login = ({
  setState,
  redirect,
}: {
  setState: (state: boolean) => void;
  redirect: string;
}) => {
  const router = useRouter();

  // * CONTEXT =====
  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    // ? REGEXNYA DISINI TERJADI !!!!
    resolver: zodResolver(zLoginFormSchema),
    mode: "onChange",
  });

  const submit = handleSubmit(async (values) => {
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (res?.error) {
        console.log(res);
        showToast({
          type: "error",
          fallback: "Something Went Wrong, Try Again!",
        });
      } else {
        showToast({ type: "success", fallback: "Login successful!" });
        router.push(redirect);
      }
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <div className="w-full h-auto flex-center overflow-hidden px-4">
      <div className="bg-black/80 backdrop-blur-sm text-white w-115 p-8 my-20 rounded-xl border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 w-full">
          <div className="w-[70%]">
            <h3 className="text-xl font-bold">Login to your account</h3>
            <p className="text-sm text-gray-300 mt-1">
              Enter your email below to login to your account
            </p>
          </div>

          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 transition font-medium"
            onClick={() => setState(false)}>
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </label>
                {formState.errors.email && (
                  <p className="text-red-500 text-xs">
                    {formState.errors.email.message}
                  </p>
                )}
              </span>

              <input
                id="email"
                className="rounded-md border border-white/20 bg-white/10 
                      focus:bg-white/20 p-2 text-white outline-none "
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </label>
                <a
                  href="#"
                  className="ml-auto text-xs text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                type="password"
                required
                {...register("password")}
                className="rounded-md border border-white/20 bg-white/10 
                       p-2 text-white focus:bg-white/20 outline-none 
                      "
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex w-full gap-3 mt-6">
            <button
              className="w-[70%] p-2 bg-white text-black font-medium 
                          rounded-md shadow hover:bg-gray-200 transition">
              Login
            </button>

            <div className="w-[30%] flex gap-2">
              {thirdParty.map((i, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={async () =>
                    await signIn(i.value, {
                      redirectTo: redirect,
                    })
                  }
                  className="flex-1 p-2 text-white/90 hover:text-white 
                          rounded-md border border-white/20 
                        hover:bg-white/10 transition">
                  {i.name}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
