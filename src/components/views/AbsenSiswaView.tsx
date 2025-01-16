"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";

const AbsenSiswaView = () => {
  const [dataAbsen, setDataAbsen] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token }: any = useAuth();
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Function to check if today's attendance exists
  const checkTodayAttendance = (attendanceData: any[]) => {
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return attendanceData?.find(
      (item: any) => item.tanggal.split("T")[0] === todayFormatted
    );
  };

  // Function to calculate attendance statistics
  const calculateAttendanceStats = (attendanceData: any[]) => {
    return attendanceData?.reduce(
      (acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      },
      { hadir: 0, izin: 0, alpa: 0, sakit: 0 }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/absensi_siswa/siswa`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year, month }),
          }
        );
        const data = await response.json();
        setDataAbsen(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, token]);

  const getDaysInMonth = (year: any, month: any) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: any, month: any) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getAttendanceStatus = (date: any) => {
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    const attendance: any = dataAbsen?.find(
      (item: any) => item.tanggal.split("T")[0] === formattedDate
    );
    return attendance?.status || null;
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "hadir":
        return "bg-green-500";
      case "alpa":
        return "bg-red-500";
      case "izin":
        return "bg-yellow-500";
      case "sakit":
        return "bg-blue-500";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) return <Loading />;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const calendar = Array(35).fill(null);
  const todayAttendance = checkTodayAttendance(dataAbsen);
  const attendanceStats = calculateAttendanceStats(dataAbsen);

  for (let i = 0; i < daysInMonth; i++) {
    calendar[i + firstDay] = i + 1;
  }

  const getFullDate = (date: any) => {
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;

    return formattedDate;
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Absen Siswa</h1>

      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Card Header with Filters */}
        <div className="p-4 border-b overflow-x-auto">
          <div className="flex items-center gap-4">
            {/* Month Select */}
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="appearance-none text-sm bg-white border rounded-md px-4 py-2 pr-8 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Year Select */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="appearance-none bg-white text-sm border rounded-md px-4 py-2 pr-8 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* Today's Attendance Status */}
          {todayAttendance ? (
            <div className="mb-4 p-4 rounded-md border-2 border-gray-100 border-t-4 border-t-blue-500">
              <div className="flex items-center justify-between flex-wrap">
                <h1 className="font-semibold text-gray-600 text-sm md:text-lg">
                  Absensi Hari ini: {todayAttendance.status}
                </h1>
                <div className="space-y-1">
                  <p className="text-gray-300 text-xs">
                    {todayAttendance.tanggal.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-4 rounded-md border-2 border-gray-100 border-t-4 border-t-purple-500">
              <div className="flex items-center justify-between flex-wrap">
                <h1 className="font-semibold text-gray-600">
                  Belum Absen Hari Ini
                </h1>
                <button
                  onClick={() => router.push("/absen_siswa/create")}
                  disabled={user?.siswa.id !== user?.siswa.kelas.ketuaKelasId}
                  className="mt-2 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-md bg-yellow-500 text-white text-xs font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Absen Sekarang
                </button>
              </div>
              {user?.siswa.id !== user?.siswa.kelas.ketuaKelasId && (
                <p className="text-red-500 text-xs mt-1 italic">
                  Hanya Ketua Kelas Yang Bisa Absen
                </p>
              )}
            </div>
          )}

          {/* Attendance Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-green-800 text-sm font-medium">
                  Hadir
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {attendanceStats?.hadir}
                </span>
              </div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-yellow-800 text-sm font-medium">
                  Izin
                </span>
                <span className="text-2xl font-bold text-yellow-600">
                  {attendanceStats?.izin}
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-blue-800 text-sm font-medium">Sakit</span>
                <span className="text-2xl font-bold text-blue-600">
                  {attendanceStats?.sakit}
                </span>
              </div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-red-800 text-sm font-medium">Alpa</span>
                <span className="text-2xl font-bold text-red-600">
                  {attendanceStats?.alpa}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 w-full">
            {/* Calendar Grid */}
            <div className="rounded-lg overflow-auto w-full">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-gray-50">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center py-2 text-sm font-medium text-gray-600"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {calendar.map((day, index) => (
                  <button
                    disabled={
                      user?.siswa.id === user?.siswa.kelas.ketuaKelasId &&
                      getAttendanceStatus(day)
                        ? false
                        : true
                    }
                    onClick={() => {
                      router.push(
                        `/absen_siswa/edit/${user?.siswa.kelasId}/${getFullDate(
                          day
                        )}`
                      );
                    }}
                    key={index}
                    className={`aspect-square ${
                      day
                        ? getStatusColor(getAttendanceStatus(day))
                        : "bg-gray-50"
                    }`}
                  >
                    {day && (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <span
                          className={`text-sm font-medium ${
                            getAttendanceStatus(day)
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        >
                          {day}
                        </span>
                        {getAttendanceStatus(day) && (
                          <span className="text-xs text-white capitalize mt-1">
                            {getAttendanceStatus(day)}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-6 justify-end">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Hadir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Izin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Sakit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Alpa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenSiswaView;
