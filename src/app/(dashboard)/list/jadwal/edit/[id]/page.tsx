import EditJadwalView from "@/components/views/admin/EditJadwalView";

export const metadata = {
  title: "Edit Mapel",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditJadwalPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  return (
    <>
      <EditJadwalView id={resolvedParams.id} />
    </>
  );
};

export default EditJadwalPage;
