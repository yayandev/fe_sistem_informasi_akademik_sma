"use client";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
const LoginView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  }: any = useForm();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const router = useRouter();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        reset();
        const response = await res.json();
        let data = response.data;
        let token = data.token.token;
        setCookie("token", token, {
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
          path: "/",
        });
        setAlertMessage("Login Berhasil!");
        setAlertType("success");
        router.push("/dashboard");
      } else {
        const response = await res.json();
        setError("email", {
          type: "manual",
          message: response.message,
        });
      }
    } catch (error) {
      setError("email", {
        type: "manual",
        message: "Terjadi Kesalahan",
      });
    }
  };
  return (
    <div className="w-full h-screen flex">
      <div className="flex-1 hidden md:block">
        <img
          className="w-full h-full object-fill"
          src="/login-image.png"
          alt=""
        />
      </div>
      <div className="flex-1 ">
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          <div className="flex justify-center">
            <img src="/logo.png" className="w-32" alt="" />
          </div>
          <h1 className="text-xl font-semibold mb-4 text-center">
            Selamat Datang <br /> Di Sistem Informasi Akademik
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Silahkan Login Untuk Melanjutkan
          </p>
          {alertMessage && (
            <div
              className={`${
                alertType === "success" ? "bg-green-100" : "bg-red-100"
              } px-3 py-2 text-sm rounded-md text-center font-semibold mb-4`}
            >
              {alertMessage}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-5 md:p-0 md:w-1/2 flex flex-col gap-3"
          >
            <input
              {...register("email", {
                required: {
                  value: true,
                  message: "Email Tidak Boleh Kosong",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email Tidak Valid",
                },
              })}
              type="email"
              placeholder="Email"
              className={`border  focus:outline-blue-400 rounded-md p-2 ${
                errors?.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors?.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password Tidak Boleh Kosong",
                },
              })}
              className={`border  focus:outline-blue-400 rounded-md p-2 ${
                errors?.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors?.password && (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            )}
            <Link href={"/"} className="text-blue-400 text-sm">
              Lupa Kata Sandi?
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-400 flex justify-center disabled:cursor-not-allowed text-white py-2 rounded-md"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
