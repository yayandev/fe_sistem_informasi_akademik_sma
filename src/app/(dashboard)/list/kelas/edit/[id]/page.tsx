import EditKelasView from "@/components/views/EditKelasView";

export const metadata = {
  title: "Edit Kelas",
};

const EditKelasPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <EditKelasView id={params.id} />
    </>
  );
};

export default EditKelasPage;
