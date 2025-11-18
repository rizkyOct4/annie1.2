"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/_util/Toast";
import { motion } from "framer-motion";
import { zRegisterFormSchema } from "./Schema";
import axios from "axios";
import { formVariants } from "@/_util/Motion";
import { AUTH } from "@/config/api/navbar/auth/api";

type RegisterFormSchema = z.infer<typeof zRegisterFormSchema>;

const Register = ({ setState }: { setState: (state: boolean) => void }) => {
  const { register, handleSubmit, formState, reset } =
    useForm<RegisterFormSchema>({
      resolver: zodResolver(zRegisterFormSchema),
      mode: "onChange",
    });

  const submit = handleSubmit(async (values) => {
    try {
      const URL = AUTH("register");
      const { data } = await axios.post(URL, {
        ...values,
      });
      showToast({ type: "success", fallback: data.message });
      console.log(data.message);
      setState(true);
      // reset();
    } catch (error) {
      console.error(error);
      showToast({ type: "error", fallback: error });
    }
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={formVariants}>
      <div className=" bg-black text-white w-140 p-8 my-10 rounded-md border-f">
        <div className="flex justify-between mb-4 w-full">
          <div className="w-70">
            <h3 className="text-2xl font-bold">Create an account</h3>
            <p className="text-sm text-gray-300">
              Enter your details to register a new account
            </p>
          </div>
          <button
            className="w-30 text-blue-600 hover:text-blue-300 transition text-medium"
            onClick={() => setState(true)}
          >
            Already had account
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                className="rounded-md border-2 bg-white p-2 text-black"
                placeholder="John"
                required
                {...register("firstName")}
              />
              {formState.errors.firstName && (
                <p className="text-red-600">
                  {formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                className="rounded-md border-2 bg-white p-2 text-black"
                type="text"
                placeholder="Doe"
                required
                {...register("lastName")}
              />
              {formState.errors.lastName && (
                <p className="text-red-600">
                  {formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="rounded-md border-2 bg-white p-2 text-black"
                required
                {...register("email")}
              />
              {formState.errors.email && (
                <p className="text-red-600">{formState.errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Your secure password"
                className="rounded-md border-2 bg-white p-2 text-black"
                required
                {...register("password")}
              />
              {formState.errors.password && (
                <p className="text-red-600">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="rounded-md border-2 bg-white p-2 text-black"
                defaultValue="guest"
                {...register("role")}
              >
                <option value="guest">Guest</option>
                <option value="creator">Creator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex w-full h-[60px] gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              className="w-[70%] p-2 bg-white text-black hover:bg-gray-200 transition rounded-md"
            >
              Register
            </motion.button>

            <div className="flex w-[30%]">
              <motion.button
                // whileHover={{ scale: 1.03 }}
                type="button"
                className="w-full p-2 text-white hover:text-gray-300 transition rounded-md"
              >
                G
              </motion.button>
              <motion.button
                // whileHover={{ scale: 1.03 }}
                type="button"
                className="w-full p-2 text-white hover:text-gray-300 transition rounded-md"
              >
                Git
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;
