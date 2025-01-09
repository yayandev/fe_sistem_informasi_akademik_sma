import DetailKelasView from "@/components/views/DetailKelasView";

export const metadata = {
  title: "Detail Kelas",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const DetailKelasPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  return (
    <>
      <DetailKelasView id={resolvedParams?.id} />
    </>
  );
};

export default DetailKelasPage;
