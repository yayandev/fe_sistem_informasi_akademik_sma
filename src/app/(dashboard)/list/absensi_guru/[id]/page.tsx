import EditAbsenGuruView from "@/components/views/admin/EditAbsensiGuruView";

export const metadata = {
  title: "Edit Absensi Guru",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditAbsensiGuruPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  return (
    <>
      <EditAbsenGuruView id={resolvedParams.id} />
    </>
  );
};

export default EditAbsensiGuruPage;
