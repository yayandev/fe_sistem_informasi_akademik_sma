"use client";

import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

const EditKelasView = ({ id }: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData]: any = useState(null);
  const [siswaNoKelas, setSiswaNoKelas]: any = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedSiswaId, setSelectedSiswaId] = useState(""); // Selected siswa id
  const [alertMessage, setAlertMessage] = useState(""); // Alert message
  const [alertType, setAlertType] = useState(""); // Alert type: success or error
  const { token } = useAuth();
  const [gurusNotWaliKelas, setGurusNotWaliKelas] = useState([]);
  const [selectedGuruId, setSelectedGuruId] = useState(""); // Guru yang dipilih
  const [modalGuruVisible, setModalGuruVisible] = useState(false);

  const fetchGurusNotWaliKelas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/gurus/not/walikelas`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setGurusNotWaliKelas(data.data);
    } catch (error) {
      console.error("Error fetching gurus not wali kelas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setData(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiswaNoKelas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/siswas/siswa/nokelas`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setSiswaNoKelas(data.data);
    } catch (error) {
      console.error("Error fetching siswa tanpa kelas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchSiswaNoKelas();
      fetchGurusNotWaliKelas();
    }
  }, [token, id]);

  const addSiswaToKelas = async () => {
    if (!selectedSiswaId) {
      setAlertMessage("Pilih siswa terlebih dahulu!");
      setAlertType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/siswas/add_siswa_to_kelas`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kelasId: id,
            siswaId: selectedSiswaId,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Siswa berhasil ditambahkan ke kelas!");
        setAlertType("success");
        // Reload data
        await fetchData();
        await fetchSiswaNoKelas();
        setShowModal(false); // Close modal after success
        setSelectedSiswaId(""); // Reset selection
      } else {
        setAlertMessage("Gagal menambahkan siswa ke kelas.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error adding siswa to kelas:", error);
      setAlertMessage("Terjadi kesalahan saat menambahkan siswa.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const deleteSiswaFromKelas = async (siswaId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/siswas/delete_siswa_from_kelas/${siswaId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kelasId: id }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Siswa berhasil dihapus dari kelas!");
        setAlertType("success");
        // Reload data
        await fetchData();
        await fetchSiswaNoKelas();
      } else {
        setAlertMessage("Gagal menghapus siswa dari kelas.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error deleting siswa from kelas:", error);
      setAlertMessage("Terjadi kesalahan saat menghapus siswa.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const changeKetuaKelas = async (siswaId: string) => {
    if (!siswaId) {
      setAlertMessage("Pilih siswa terlebih dahulu!");
      setAlertType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/change_ketua_kelas`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_kelas: id,
            id_siswa: siswaId,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Ketua kelas berhasil diubah!");
        setAlertType("success");
        // Reload data
        await fetchData();
      } else {
        setAlertMessage("Gagal mengubah ketua kelas.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error changing ketua kelas:", error);
      setAlertMessage("Terjadi kesalahan saat mengubah ketua kelas.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const changeWaliKelas = async (guruId: string) => {
    if (!guruId) {
      setAlertMessage("Pilih guru terlebih dahulu!");
      setAlertType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kelas/change_wali_kelas`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_kelas: id,
            id_guru: guruId,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAlertMessage("Wali kelas berhasil diubah!");
        setAlertType("success");
        await fetchData(); // Reload data kelas
      } else {
        setAlertMessage("Gagal mengubah wali kelas.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error changing wali kelas:", error);
      setAlertMessage("Terjadi kesalahan saat mengubah wali kelas.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full space-y-3">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Detail kelas</h1>

        <div className="flex gap-3 flex-wrap items-center">
          <Link
            href="/list/kelas"
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            Kembali
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Tambah Siswa
          </button>
          <button
            onClick={() => setModalGuruVisible(true)}
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Edit Wali Kelas
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <div
          className={`${
            alertType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white p-3 rounded-md`}
        >
          {alertMessage}
        </div>
      )}

      <div className="bg-white p-4 rounded-md space-y-2">
        <h3 className="text-sm font-semibold">Data Kelas</h3>

        <table className="w-full md:w-1/2">
          <tr>
            <th className="px-4 py-2 text-left border border-gray-200">ID</th>
            <td className="px-4 py-2 text-left border border-gray-200">{id}</td>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-200">
              Nama Kelas
            </th>
            <td className="px-4 py-2 text-left border border-gray-200">
              {data?.nama}
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-200">
              Wali Kelas
            </th>
            <td className="px-4 py-2 text-left border border-gray-200">
              {data?.waliKelas ? data?.waliKelas?.name : "-"}
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-200">
              Ketua Kelas
            </th>
            <td className="px-4 py-2 text-left border border-gray-200">
              {data?.ketuaKelasId
                ? data?.siswas.find((s: any) => s.id === data?.ketuaKelasId)
                    ?.nama
                : "-"}
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-200">
              Jumlah Siswa
            </th>
            <td className="px-4 py-2 text-left border border-gray-200">
              {data?.siswas.length}
            </td>
          </tr>
        </table>

        <h3 className="text-sm font-semibold">Data Siswa</h3>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border border-gray-200">
                  No
                </th>
                <th className="px-4 py-2 text-left border border-gray-200">
                  Nama Siswa
                </th>
                <th className="px-4 py-2 text-left border border-gray-200">
                  NIS
                </th>
                <th className="px-4 py-2 text-left border border-gray-200">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.siswas.map((s: any, index: number) => (
                <tr key={s.id}>
                  <td className="px-4 py-2 text-left border border-gray-200">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-left border border-gray-200">
                    {s.nama}
                  </td>
                  <td className="px-4 py-2 text-left border border-gray-200">
                    {s.nis}
                  </td>
                  <td className="px-4 py-2 text-left border border-gray-200">
                    <div className="flex gap-3">
                      {data?.ketuaKelasId !== s.id && (
                        <button
                          onClick={() => changeKetuaKelas(s.id)}
                          className="text-green-500"
                        >
                          Jadikan KM
                        </button>
                      )}
                      {data?.ketuaKelasId !== s.id && (
                        <button
                          onClick={() =>
                            confirm("Apakah anda yakin?") &&
                            deleteSiswaFromKelas(s.id)
                          }
                          className="text-red-500"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Add Siswa */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-1/3">
              <h2 className="text-lg font-semibold mb-4">
                Tambah Siswa ke Kelas
              </h2>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                value={selectedSiswaId}
                onChange={(e) => setSelectedSiswaId(e.target.value)}
              >
                <option value="">Pilih Siswa</option>
                {siswaNoKelas.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 py-2 px-4 rounded-md border"
                >
                  Tutup
                </button>
                <button
                  onClick={addSiswaToKelas}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* modal change wali kelas */}
      {modalGuruVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-lg font-semibold mb-4">Ganti Wali Kelas</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              value={selectedGuruId}
              onChange={(e) => setSelectedGuruId(e.target.value)}
            >
              <option value="">Pilih Wali Kelas</option>
              {gurusNotWaliKelas.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => setModalGuruVisible(false)}
                className="text-gray-500 py-2 px-4 rounded-md border"
              >
                Tutup
              </button>
              <button
                onClick={() => changeWaliKelas(selectedGuruId)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Ganti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-500">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default EditKelasView;
