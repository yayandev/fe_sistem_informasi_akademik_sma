import EditSiswaView from "@/components/views/admin/EditSiswaView";

export const metadata = {
  title: "Edit Siswa",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditSiswaPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  return (
    <>
      <EditSiswaView id={resolvedParams?.id} />
    </>
  );
};

export default EditSiswaPage;
