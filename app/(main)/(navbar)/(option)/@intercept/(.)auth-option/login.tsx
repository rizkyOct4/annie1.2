"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/_util/Toast";
import { motion } from "framer-motion";
import axios from "axios";
import { profileContext } from "@/app/context";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zLoginFormSchema } from "../../auth-option/schema";
import { CONFIG_AUTH } from "../../auth-option/config/config-auth";
import { signIn, signOut, useSession } from "next-auth/react";

type LoginFormSchema = z.infer<typeof zLoginFormSchema>;

const thirdParty = [
  { name: "G", value: "google" },
  { name: "Git", value: "github" },
];

const Login = ({ setState }: { setState: (state: boolean) => void }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ? ini masih bug !! kondisikan besok sama kau !!!
  const redirect = searchParams.get("redirect") ?? "/"; // * default balik ke / kalau kosong

  // * CONTEXT =====
  const { setData } = useContext(profileContext);

  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    // ? REGEXNYA DISINI TERJADI !!!!
    resolver: zodResolver(zLoginFormSchema),
    mode: "onChange",
  });

  const submit = handleSubmit(async (values) => {
    try {
      const URL = CONFIG_AUTH("login");
      const { data } = await axios.post(URL, {
        email: values.email,
        password: values.password,
      });
      console.log(data);
      setData(data.data);
      if (data.cookiesRedirectMiddleware) {
        router.push(data.cookiesRedirectMiddleware);
      } else {
        router.push(redirect);
        showToast({ type: "success", fallback: data.message });
      }
      // router.replace("/auth");
    } catch (error: any) {
      console.log(error.response.data.message);
      showToast({ type: "error", fallback: error });
    }
  });

  return (
    <div className="w-full h-auto flex-center overflow-hidden px-4">
      <div
        className="bg-black/80 backdrop-blur-sm text-white w-[460px] p-8 my-20 
                  rounded-xl border border-white/10 shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 w-full">
          <div className="w-[70%]">
            <h3 className="text-xl font-bold">Login to your account</h3>
            <p className="text-sm text-gray-300 mt-1">
              Enter your email below to login to your account
            </p>
          </div>

          <button
            className="text-blue-400 hover:text-blue-300 transition font-medium"
            onClick={() => setState(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit}>
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-gray-300">
                Email
              </label>
              <input
                id="email"
                className="rounded-md border border-white/20 bg-white/10 
                       focus:bg-white/20 p-2 text-white outline-none 
                       focus:ring-2 focus:ring-blue-500 transition"
                type="email"
                placeholder="m@example.com"
                // required
                {...register("email")}
              />
              {formState.errors.email && (
                <p className="text-red-500 text-xs">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </label>
                <a
                  href="#"
                  className="ml-auto text-xs text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                className="rounded-md border border-white/20 bg-white/10 
                       p-2 text-white focus:bg-white/20 outline-none 
                       focus:ring-2 focus:ring-blue-500 transition"
                type="password"
                // required
                {...register("password")}
              />
              {formState.errors.password && (
                <p className="text-red-500 text-xs">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex w-full gap-3 mt-6">
            <motion.button
              type="submit"
              className="w-[70%] p-2 bg-white text-black font-medium 
                     rounded-md shadow hover:bg-gray-200 transition"
            >
              Login
            </motion.button>

            <div className="w-[30%] flex gap-2">
              {thirdParty.map((provider) => (
                <motion.button
                  key={provider.value}
                  onClick={() =>
                    signIn(provider.value, { redirectTo: redirect })
                  }
                  className="flex-1 p-2 text-white/90 hover:text-white rounded-md border border-white/20 hover:bg-white/10 transition"
                >
                  {provider.name}
                </motion.button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
