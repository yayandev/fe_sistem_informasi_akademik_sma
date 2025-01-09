import EditKelasView from "@/components/views/EditKelasView";

export const metadata = {
  title: "Edit Kelas",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditKelasPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  return (
    <>
      <EditKelasView id={resolvedParams.id} />
    </>
  );
};

export default EditKelasPage;
