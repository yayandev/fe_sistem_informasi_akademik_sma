"use client";

import { useAuth } from "@/context/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";

const FormChangeEmail = ({
  token,
  setAlertMessage,
  setAlertType,
  user,
}: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  }: any = useForm();
  const onChangeEmail = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change_email`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlertType("success");
        setAlertMessage(result.message);
        reset();
      } else {
        setAlertType("error");
        setAlertMessage(result.message);
      }
    } catch (error) {
      console.log(error);
      setAlertType("error");
      setAlertMessage("Failed to change email");
    }
  };
  return (
    <form className="space-y-3" onSubmit={handleSubmit(onChangeEmail)}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="space-y-1 w-full">
          <label htmlFor="currentEmail" className="text-sm">
            Current Email
          </label>
          <input
            type="email"
            name="email"
            value={user?.email}
            id="currentEmail"
            placeholder="Email"
            readOnly
            className="w-full p-2 border border-gray-300 focus:outline-lamaPurple rounded-md"
          />
        </div>
        <div className="space-y-1 w-full">
          <label htmlFor="email" className="text-sm">
            New Email
          </label>
          <input
            type="email"
            id="email"
            {...register("newEmail", {
              required: "New Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email format",
              },
            })}
            placeholder="Email"
            className={`w-full p-2 border border-gray-300 focus:outline-lamaPurple rounded-md ${
              errors.newEmail ? "border-red-500" : ""
            }`}
          />
          {errors.newEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newEmail.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-lamaPurple text-white font-semibold py-2 px-4 rounded-md mt-2 disabled:bg-gray-400"
      >
        {isSubmitting ? "Loading..." : "Change"}
      </button>
    </form>
  );
};

const SettingsView = () => {
  const { user, token }: any = useAuth();
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  }: any = useForm();

  const onChangePassword = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change_password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlertType("success");
        setAlertMessage(result.message);
        reset();
      } else {
        setAlertType("error");
        setAlertMessage(result.message);
      }
    } catch (error) {
      console.log(error);
      setAlertType("error");
      setAlertMessage("Failed to change password");
    }
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-2xl font-semibold">Settings</h1>
      {alertMessage && (
        <div
          className={`${
            alertType === "success" ? "bg-green-400" : "bg-red-400"
          } p-3 rounded-md text-white flex justify-between items-center`}
        >
          <p>{alertMessage}</p>
          <button onClick={() => setAlertMessage("")} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="flex gap-3 flex-col md:flex-row">
        <div className="flex-1 bg-white p-3 space-y-3 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold">Change Email</h3>
          <FormChangeEmail
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
            token={token}
            user={user}
          />
        </div>
        <div className="flex-1 bg-white p-3 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="space-y-1 w-full">
                <label htmlFor="newPassword" className="text-sm">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                  className={`w-full p-2 border  focus:outline-lamaPurple rounded-md ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-1 w-full">
                <label htmlFor="confirmNewPassword" className="text-sm">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...register("confirmNewPassword", {
                    required: "Confirm Password is required",
                    validate: (value: string) => {
                      const { newPassword } = getValues();
                      return value === newPassword || "Passwords do not match";
                    },
                  })}
                  id="confirmNewPassword"
                  className={`w-full p-2 border  focus:outline-lamaPurple rounded-md ${
                    errors.confirmNewPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Password must be at least 8 characters long and contain at least
              one uppercase letter, one lowercase letter, and one number
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-lamaPurple disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md mt-2"
            >
              {isSubmitting ? "Loading..." : "Change"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
