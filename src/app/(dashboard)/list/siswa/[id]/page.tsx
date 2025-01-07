import DetailSiswaView from "@/components/views/siswa/DetailSiswaView";

export const metadata = {
  title: "Detail Siswa",
};

const DetailSiswaPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <DetailSiswaView id={params.id} />
    </>
  );
};

export default DetailSiswaPage;
