"use client";
import CountChart from "@/components/CountChart";
import Loading from "@/components/Loading";
import UserCard from "@/components/UserCard";
import { useAuth } from "@/context/useAuth.jsx";
import { useEffect, useState } from "react";
import AbsensiGuruChart from "@/components/AbsensiGuruChart";
import AbsensiSiswaChart from "@/components/AbsensiSiswaChart";
import CountGuruChart from "@/components/CountGuruChat";

const DashboardAdminView = () => {
  const { user, token }: any = useAuth();

  const [dataDashboard, setDataDashboard]: any = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setDataDashboard(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Siswa" count={dataDashboard?.totalSiswa} />
          <UserCard type="Guru" count={dataDashboard?.totalGuru} />
          <UserCard type="Kelas" count={dataDashboard?.totalKelas} />
          <UserCard type="Mapel" count={dataDashboard?.totalMapel} />
          <UserCard type="Jadwal" count={dataDashboard?.totalJadwal} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart
              totalBoys={dataDashboard?.totalSiswaLakilaki}
              totalGirls={dataDashboard?.totalSiswaPerempuan}
              totalStudents={dataDashboard?.totalSiswa}
            />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AbsensiSiswaChart monthly={dataDashboard?.absensi.monthly || []} />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountGuruChart
              totalBoys={dataDashboard?.totalGuruLakilaki}
              totalGirls={dataDashboard?.totalGuruPerempuan}
              totalTeachers={dataDashboard?.totalGuru}
            />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AbsensiGuruChart monthly={dataDashboard?.absensi.monthly || []} />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div> */}
    </div>
  );
};

export default DashboardAdminView;
