import EditAbsensiSiswaView from "@/components/views/admin/EditAbsensiSiswaView";

export const metadata = {
  title: "Edit Absensi Siswa",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditAbsensiSiswaPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  return (
    <>
      <EditAbsensiSiswaView id={resolvedParams.id} />
    </>
  );
};

export default EditAbsensiSiswaPage;
