"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/_util/Toast";
import { motion } from "framer-motion";
import axios from "axios";
import { profileContext } from "../context";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zLoginFormSchema } from "./Schema";
import { formVariants } from "@/_util/Motion";
import { AUTH } from "@/config/api/navbar/auth/api";

type LoginFormSchema = z.infer<typeof zLoginFormSchema>;

const thirdParty = [{ name: "G" }, { name: "Git" }];

const Login = ({ setState }: { setState: (state: boolean) => void }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ? ini masih bug !! kondisikan besok sama kau !!!
  const redirect = searchParams.get("redirect") ?? "/"; // * default balik ke / kalau kosong

  // const storage = localStorage.getItem("redirectTo")
  // console.log(storage)

  // * CONTEXT =====
  const { setData } = useContext(profileContext);

  // * form dibawah bisa di {} destructure !!! banyak method yg bisa dipakai !!!
  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    // ? REGEXNYA DISINI TERJADI !!!!
    resolver: zodResolver(zLoginFormSchema),
    mode: "onChange",
  });

  const submit = handleSubmit(async (values) => {
    try {
      const URL = AUTH("login");
      const { data } = await axios.post(URL, {
        email: values.email,
        password: values.password,
      });
      console.log(data);
      showToast({ type: "success", fallback: data.message });
      setData(data.data);
      if (data.cookiesRedirectMiddleware) {
        router.push(data.cookiesRedirectMiddleware);
      } else {
        router.push(redirect);
      }
      // router.replace("/auth");
    } catch (error: any) {
      console.log(error.response.data.message);
      showToast({ type: "error", fallback: error });
    }
  });

  return (
    <div className="w-full h-auto flex-center overflow-hidden">
      <motion.div initial="hidden" animate="visible" variants={formVariants}>
        <div className="bg-black text-white w-120 p-8 my-50 rounded-md border-1">
          <div className="flex justify-between mb-4 w-full">
            <div className="w-70">
              <h3>
                <strong>Login to your account</strong>
              </h3>
              <p>Enter your email below to login to your account</p>
            </div>
            <button
              className="w-30 text-blue-600 hover:text-blue-300 transition text-medium"
              onClick={() => setState(false)}
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={submit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="rounded-md border-2 bg-white p-2 text-black"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {formState.errors.email && (
                  <p className="text-red-600">
                    {formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <label htmlFor="password">Password</label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <input
                  id="password"
                  className="rounded-md border-2 bg-white p-2 text-black"
                  type="password"
                  required
                  {...register("password")}
                />
                {formState.errors.password && (
                  <p className="text-red-600">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                type="submit"
                className="w-[70%] p-2 bg-white text-black transition rounded-md"
              >
                Login
              </motion.button>
              <div className="w-[30%] flex">
                {thirdParty.map((i, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    type="button"
                    className="w-full p-2 text-white hover:text-gray-300 transition rounded-md"
                  >
                    {i.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
