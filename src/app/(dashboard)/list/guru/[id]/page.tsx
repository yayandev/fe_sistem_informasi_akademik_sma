import EditGuruView from "@/components/views/admin/EditGuruView";

export const metadata = {
  title: "Edit Guru",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditGuruPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  return (
    <>
      <EditGuruView id={resolvedParams.id} />
    </>
  );
};

export default EditGuruPage;
