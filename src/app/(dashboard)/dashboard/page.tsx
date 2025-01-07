"use client";

import DashboardAdminView from "@/components/views/admin/DashboardAdminView";
import DashboardGuruView from "@/components/views/DashboardGuruView";
import DashboardSiswaView from "@/components/views/DashboardSiswaView";
import { useAuth } from "@/context/useAuth";

const DashboardPage = () => {
  const { user }: any = useAuth();

  return (
    <>
      {user?.role === "admin" && <DashboardAdminView />}
      {user?.role === "guru" && <DashboardGuruView />}
      {user?.role === "siswa" && <DashboardSiswaView />}
    </>
  );
};

export default DashboardPage;
