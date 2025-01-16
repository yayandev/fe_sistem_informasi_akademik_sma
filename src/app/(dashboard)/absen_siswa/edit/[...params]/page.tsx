import EditManyAbsenSiswaView from "@/components/views/EditManyAbsenSiswaView";
import React from "react";

// multi params
interface PageProps {
  params: Promise<{
    params: string[];
  }>;
}

const EditManyAbsensiSiswa = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  return (
    <>
      <EditManyAbsenSiswaView
        id_kelas={resolvedParams?.params[0]}
        tanggal={resolvedParams?.params[1]}
      />
    </>
  );
};

export default EditManyAbsensiSiswa;
