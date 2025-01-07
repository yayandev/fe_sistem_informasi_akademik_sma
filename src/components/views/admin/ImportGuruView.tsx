"use client";
import { useAuth } from "@/context/useAuth";
import Link from "next/link";
import { useState } from "react";
import { FaFileExcel } from "react-icons/fa";

const ImportGuruView = () => {
  const [file, setFile] = useState<File | undefined>();
  const [fileEnter, setFileEnter] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State baru untuk loading
  const { token } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setIsLoading(true); // Set loading true saat memulai proses

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gurus/import`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(
            `Import berhasil! Jumlah sukses: ${data.successfulImports}, jumlah gagal: ${data.failedImports}`
          );
          if (data.failedImports > 0) {
            setErrorDetails(data.failedDetails);
          } else {
            setErrorDetails([]);
          }
          setErrorMessage(null);
        } else {
          setErrorMessage(`Terjadi kesalahan: ${data.message}`);
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error("Error during file import:", error);
        setErrorMessage(
          "Terjadi kesalahan saat mengimpor file. Silakan coba lagi."
        );
        setSuccessMessage(null);
      } finally {
        setIsLoading(false); // Set loading false setelah proses selesai
      }
    }
  };

  const handleReset = async () => {
    setFile(undefined);
    setFileEnter(false);
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrorDetails([]);
  };

  return (
    <div className="w-full space-y-3 p-4">
      <h1 className="text-xl font-semibold">Import Guru</h1>

      <div className="bg-white p-4 rounded-md">
        <div className="flex justify-end gap-3">
          <Link
            href="/list/guru"
            className="bg-lamaSky text-white text-sm font-bold py-2 px-4 rounded"
          >
            Kembali
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/gurus/download/template`}
            className="bg-yellow-500 items-center text-white flex gap-2 font-bold py-2 px-4 rounded"
          >
            <span className="text-sm">Download Template</span>
            <FaFileExcel />
          </Link>
        </div>

        <div className="container px-4 max-w-5xl mx-auto mt-10">
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setFileEnter(true);
              }}
              onDragLeave={() => setFileEnter(false)}
              onDrop={(e) => {
                e.preventDefault();
                setFileEnter(false);
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  setFile(droppedFile);
                }
              }}
              className={`${
                fileEnter ? "border-4" : "border-2"
              } mx-auto bg-white flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center`}
            >
              <label
                htmlFor="file"
                className="h-full flex flex-col justify-center text-center cursor-pointer"
              >
                Click to upload or drag and drop
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx"
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p>{file.name}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 mt-10 uppercase py-2 tracking-widest outline-none bg-red-600 text-white rounded"
                >
                  Reset
                </button>
                <button
                  onClick={handleImport}
                  disabled={isLoading}
                  className={`px-4 mt-10 uppercase py-2 tracking-widest outline-none text-white rounded ${
                    isLoading ? "bg-gray-500" : "bg-green-500"
                  }`}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded mt-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded mt-4">
            {errorMessage}
          </div>
        )}

        {errorDetails.length > 0 && (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded mt-4">
            <h2 className="font-bold">Detail Kesalahan:</h2>
            <ul>
              {errorDetails.map((detail, index) => (
                <li key={index}>{detail.error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportGuruView;
