"use client";

import { useAuth } from "@/context/useAuth";
import Image from "next/image";
import { useEffect, useState } from "react";

const ProfileView = () => {
  const { user, token }: any = useAuth();
  const [loading, setLoading] = useState(true);
  const [personalData, setPersonalData] = useState<any>({});

  useEffect(() => {
    if (user && user?.role !== "admin") {
      const fetchData = async () => {
        const role = user.role;
        try {
          let endpoint =
            role === "guru"
              ? `${process.env.NEXT_PUBLIC_API_URL}/gurus/my/biodata`
              : `${process.env.NEXT_PUBLIC_API_URL}/siswas/my/biodata`;

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPersonalData(data.data);
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
          }

          setLoading(false);
        } catch (error) {
          console.error("Fetch error:", error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Profile</h1>

      <div className="flex gap-5 flex-col md:flex-row items-start">
        <div className="w-full md:w-96 bg-white p-4 rounded-md space-y-3">
          <h1 className="text-lg font-semibold">Profile Picture</h1>

          <div className="flex items-center justify-center space-y-3 flex-col">
            <div className="w-40 h-40 bg-gray-100 rounded-full flex justify-center items-center">
              <img
                src={
                  user?.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${user?.avatar}`
                    : "/avatar.png"
                }
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center items-center">
              <label
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                htmlFor="img"
              >
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Upload a photo</span>
              </label>
              <input type="file" id="img" className="hidden" />
            </div>
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-3">
          <div className="bg-white p-4 rounded-md space-y-3">
            <h1 className="text-lg font-semibold">Account Information</h1>

            <div className="flex flex-col gap-3 space-y-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="space-y-1 w-full">
                  <label className="text-sm font-medium">Nama</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={user?.name}
                    readOnly
                    className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                  />
                </div>

                <div className="space-y-1 w-full">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email}
                    placeholder="b8BfG@example.com"
                    className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="space-y-1 w-full">
                  <label className="text-sm font-medium">Role</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="John Doe"
                    value={user?.role}
                    className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                  />
                </div>

                <div className="space-y-1 w-full">
                  <label className="text-sm font-medium">Created At</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.createdAt}
                    placeholder="b8BfG@example.com"
                    className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                  />
                </div>
              </div>
              <button className="w-max p-2 flex items-center justify-center gap-2 py-2 rounded-md bg-lamaSky text-white text-sm font-semibold">
                Update
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex py-10 justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {user?.role === "guru" && (
                <div className="bg-white p-4 rounded-md space-y-3">
                  <h1 className="text-lg font-semibold">
                    Personal Information
                  </h1>

                  <div className="flex flex-col gap-3 space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Nama</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={personalData?.guru?.nama}
                          readOnly
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          readOnly
                          value={personalData?.guru?.email}
                          placeholder="b8BfG@example.com"
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">NIP</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="John Doe"
                          value={personalData?.guru?.nip}
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">
                          Jenis Kelamin
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={personalData?.guru?.jenis_kelamin}
                          placeholder="b8BfG@example.com"
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">No Telp</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="John Doe"
                          value={personalData?.guru?.no_telp}
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Alamat</label>
                        <input
                          type="text"
                          readOnly
                          value={personalData?.guru?.alamat}
                          placeholder="b8BfG@example.com"
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                    <button className="w-max p-2 flex items-center justify-center gap-2 py-2 rounded-md bg-lamaSky text-white text-sm font-semibold">
                      Update
                    </button>
                  </div>
                </div>
              )}
              {user?.role === "siswa" && (
                <div className="bg-white p-4 rounded-md space-y-3">
                  <h1 className="text-lg font-semibold">
                    Personal Information
                  </h1>

                  <div className="flex flex-col gap-3 space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Nama</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={personalData?.siswa?.nama}
                          readOnly
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          readOnly
                          value={personalData?.siswa?.email}
                          placeholder="b8BfG@example.com"
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">NIS</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="John Doe"
                          value={personalData?.siswa?.nis}
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">
                          Jenis Kelamin
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={personalData?.siswa?.jenis_kelamin}
                          placeholder="b8BfG@example.com"
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">No Telp</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="John Doe"
                          value={personalData?.siswa?.no_telp}
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>

                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Alamat</label>
                        <input
                          type="text"
                          readOnly
                          value={personalData?.siswa?.alamat}
                          placeholder="b8BfG@example.com"
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {user?.role === "siswa" && (
                <div className="bg-white p-4 rounded-md space-y-3">
                  <h1 className="text-lg font-semibold">Class Information</h1>

                  <div className="flex flex-col gap-3 space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="space-y-1 w-full">
                        <label className="text-sm font-medium">Nama</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={personalData?.siswa?.kelas?.nama}
                          readOnly
                          className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                        />
                      </div>
                      {personalData?.siswa?.id ===
                        personalData?.siswa?.kelas?.ketuaKelasId && (
                        <div className="space-y-1 w-full">
                          <label className="text-sm font-medium">
                            Ketua Kelas
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={personalData?.siswa?.nama}
                            readOnly
                            className="ring-[1.5px] ring-gray-200 focus:outline-lamaSky p-2 rounded-md text-sm w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
