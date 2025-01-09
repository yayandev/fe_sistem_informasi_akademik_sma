"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import Loading from "@/components/Loading";

const ListAbsensiGuruByIdGuruView = () => {
  const [dataAbsen, setDataAbsen] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedEvents, setSelectedEvents]: any = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [stats, setStats] = useState({
    totalClasses: 0,
    hadir: 0,
    izin: 0,
    alpa: 0,
  });

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

  const years = Array.from({ length: 5 }, (_, i) => year - 2 + i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/absensi_guru/guru`,
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

        // Calculate stats
        const stats = data.data.reduce(
          (acc: any, curr: any) => {
            acc.totalClasses++;
            acc[curr.status]++;
            return acc;
          },
          { totalClasses: 0, hadir: 0, izin: 0, alpa: 0 }
        );

        setStats(stats);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, token, user]);

  const getDaysInMonth = (year: any, month: any) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: any, month: any) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getTeachingEvents = (date: any) => {
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    const events = dataAbsen?.filter(
      (item: any) => item.tanggal.split("T")[0] === formattedDate
    );
    return events || [];
  };

  const handleDayClick = (events: any, date: any) => {
    if (events.length > 0) {
      setSelectedEvents(events);
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "hadir":
        return "bg-green-100 text-green-800";
      case "izin":
        return "bg-yellow-100 text-yellow-800";
      case "alpa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <Loading />;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const calendar = Array(35).fill(null);

  for (let i = 0; i < daysInMonth; i++) {
    calendar[i + firstDay] = i + 1;
  }

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Riwayat Mengajar</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-t-blue-500">
          <div className="text-3xl font-bold text-blue-500">
            {stats.totalClasses}
          </div>
          <div className="text-gray-600">Total Kelas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-t-green-500">
          <div className="text-3xl font-bold text-green-500">{stats.hadir}</div>
          <div className="text-gray-600">Hadir</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-t-yellow-500">
          <div className="text-3xl font-bold text-yellow-500">{stats.izin}</div>
          <div className="text-gray-600">Izin</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-t-red-500">
          <div className="text-3xl font-bold text-red-500">{stats.alpa}</div>
          <div className="text-gray-600">Alpa</div>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Calendar Header with Filters */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {/* Calendar Grid */}
          <div className="rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div
                  key={day}
                  className="text-center py-2 text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {calendar.map((day, index) => {
                const events = day ? getTeachingEvents(day) : [];
                const hasEvents = events.length > 0;

                return (
                  <div
                    key={index}
                    className={`min-h-24 bg-white ${
                      hasEvents ? "cursor-pointer hover:bg-gray-50" : ""
                    }`}
                    onClick={() =>
                      hasEvents &&
                      handleDayClick(
                        events,
                        `${year}-${String(month).padStart(2, "0")}-${String(
                          day
                        ).padStart(2, "0")}`
                      )
                    }
                  >
                    {day && (
                      <div className="h-full p-1">
                        <div className="text-sm font-medium text-gray-600">
                          {day}
                        </div>
                        {hasEvents && (
                          <div className="mt-2">
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-800 bg-blue-100 rounded-full">
                              {events.length} Kelas
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Modal Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg max-w-xl w-full mx-4 overflow-hidden shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Detail Kelas - {selectedDate}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4">
                {selectedEvents?.map((event: any, index: any) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${getStatusColor(event.status)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {event.mapel.nama_mapel}
                        </h3>
                        <p className="text-sm mt-1">
                          Kelas: {event.kelas.nama}
                        </p>
                        <p className="text-sm">
                          Waktu: {event.jam_mulai} - {event.jam_selesai}
                        </p>
                      </div>
                      <span className="capitalize px-2 py-1 rounded text-sm">
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAbsensiGuruByIdGuruView;
