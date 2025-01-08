import EditJadwalView from "@/components/views/admin/EditJadwalView";

export const metadata = {
  title: "Edit Mapel",
};

const EditJadwalPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <EditJadwalView id={params.id} />
    </>
  );
};

export default EditJadwalPage;
