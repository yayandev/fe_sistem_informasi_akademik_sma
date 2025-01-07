"use client";

import { useAuth } from "@/context/useAuth";

const SettingsView = () => {
  const { user }: any = useAuth();
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="flex gap-3 flex-col md:flex-row">
        <div className="flex-1 bg-white p-3 space-y-3 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold">Change Email</h3>
          <form action="" className="space-y-3">
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
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 focus:outline-lamaPurple rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-lamaPurple text-white font-semibold py-2 px-4 rounded-md mt-2"
            >
              Change
            </button>
          </form>
        </div>
        <div className="flex-1 bg-white p-3 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold">Change password</h3>
          <form action="" className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="space-y-1 w-full">
                <label htmlFor="newPassword" className="text-sm">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="w-full p-2 border border-gray-300 focus:outline-lamaPurple rounded-md"
                />
              </div>
              <div className="space-y-1 w-full">
                <label htmlFor="confirmNewPassword" className="text-sm">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  placeholder=""
                  className="w-full p-2 border border-gray-300 focus:outline-lamaPurple rounded-md"
                />
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Password must be at least 8 characters long and contain at least
              one uppercase letter, one lowercase letter, and one number
            </p>
            <button
              type="submit"
              className="bg-lamaPurple text-white font-semibold py-2 px-4 rounded-md mt-2"
            >
              Change
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
