import DetailKelasView from "@/components/views/DetailKelasView";

export const metadata = {
  title: "Detail Kelas",
};

const DetailKelasPage = ({ params }: any) => {
  return (
    <>
      <DetailKelasView id={params?.id} />
    </>
  );
};

export default DetailKelasPage;
