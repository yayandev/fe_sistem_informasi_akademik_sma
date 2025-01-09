import DetailSiswaView from "@/components/views/admin/DetailSiswaView";

export const metadata = {
  title: "Detail Siswa",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const DetailSiswaPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  return (
    <>
      <DetailSiswaView id={resolvedParams?.id} />
    </>
  );
};

export default DetailSiswaPage;
