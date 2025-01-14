"use client";

import { useAuth } from "@/context/useAuth";
import { useEffect, useState, useRef } from "react";
import Loading from "../Loading";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const JadwalSiswaView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const tableRef = useRef(null);
  const pdfTableRef = useRef(null);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jadwals/siswa`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setData(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const generatePDF = async () => {
    try {
      // Create temporary div for PDF content
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      document.body.appendChild(tempDiv);

      // Clone the table with specific PDF styling
      const pdfContent = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="text-align: center; font-size: 24px; margin-bottom: 10px;">Jadwal Siswa</h1>
          <p style="text-align: center; font-size: 12px; margin-bottom: 20px;">
            Dicetak pada: ${new Date().toLocaleString("id-ID")}
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">No</th>
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">Guru</th>
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">No Telp</th>
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">Mapel</th>
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">Hari</th>
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">Kelas</th>
                <th style="border: 1px solid #000; padding: 12px; text-align: left;">Waktu</th>
              </tr>
            </thead>
            <tbody>
              ${data
                ?.map(
                  (item: any, index: number) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 12px;">${
                    index + 1
                  }</td>
                  <td style="border: 1px solid #000; padding: 12px;">${
                    item.guru.nama
                  }</td>
                  <td style="border: 1px solid #000; padding: 12px;">${
                    item.guru.no_telp
                  }</td>
                  <td style="border: 1px solid #000; padding: 12px;">

                      ${item.mapel.nama_mapel}
                  </td>
                  <td style="border: 1px solid #000; padding: 12px;">
                      ${item.hari}
                  </td>
                  <td style="border: 1px solid #000; padding: 12px;">
                      ${item.kelas.nama}
                  </td>
                  <td style="border: 1px solid #000; padding: 12px;">
                      ${item.waktu_mulai} - ${item.waktu_selesai}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      tempDiv.innerHTML = pdfContent;

      // Create canvas from the styled content
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Calculate dimensions for A4 page
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF with proper scaling
      const pdf = new jsPDF("p", "mm", "a4");

      // Add the image with better positioning and scaling
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save PDF
      pdf.save("jadwal-siswa.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 w-full space-y-3">
      <h1 className="text-xl font-semibold">Jadwal Siswa</h1>

      <div className="bg-white w-full p-4 space-y-3">
        <div className="flex justify-end">
          <button
            onClick={generatePDF}
            className="px-4 py-2 rounded-md bg-lamaSky text-xs font-semibold hover:bg-blue-600 transition-colors"
          >
            Cetak PDF
          </button>
        </div>
        <div className="overflow-auto" ref={tableRef}>
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-gray-200">
                <th className="px-4 py-2 text-left border">No</th>
                <th className="px-4 py-2 text-left border">Guru</th>
                <th className="px-4 py-2 text-left border">No Telp</th>
                <th className="px-4 py-2 text-left border">Mapel</th>
                <th className="px-4 py-2 text-left border">Hari</th>
                <th className="px-4 py-2 text-left border">Kelas</th>
                <th className="px-4 py-2 text-left border">Waktu</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item: any, index: number) => (
                <tr key={index} className="border-gray-200">
                  <td className="px-4 py-2 text-left border">{index + 1}</td>
                  <td className="px-4 py-2 text-left border">
                    {item.guru.nama}
                  </td>
                  <td className="px-4 py-2 text-left border">
                    {item.guru.no_telp}
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-yellow-400 text-white">
                      {item.mapel.nama_mapel}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-blue-400 text-white">
                      {item.hari}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-green-400 text-white">
                      {item.kelas.nama}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left border">
                    <span className="px-2 py-1 rounded text-sm bg-red-400 text-white">
                      {item.waktu_mulai} - {item.waktu_selesai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JadwalSiswaView;
