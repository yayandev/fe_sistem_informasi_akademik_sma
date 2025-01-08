"use client";
import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CountGuruChart = ({ totalBoys, totalGirls, totalTeachers }: any) => {
  // Check to prevent division by zero
  const boysPercentage =
    totalTeachers > 0 ? ((totalBoys / totalTeachers) * 100).toFixed(2) : "0";
  const girlsPercentage =
    totalTeachers > 0 ? ((totalGirls / totalTeachers) * 100).toFixed(2) : "0";

  const data = [
    {
      name: "Total",
      count: totalTeachers,
      fill: "white",
    },
    {
      name: "Girls",
      count: totalGirls,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: totalBoys,
      fill: "#C3EBFA",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Teachers</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt="Gender icon"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{totalBoys}</h1>
          <h2 className="text-xs text-gray-300">Boys ({boysPercentage}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{totalGirls}</h1>
          <h2 className="text-xs text-gray-300">Girls ({girlsPercentage}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountGuruChart;
