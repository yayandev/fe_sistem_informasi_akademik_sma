"use client";
import { useAuth } from "@/context/useAuth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard",
        visible: ["admin", "siswa", "guru"],
      },
      {
        icon: "/teacher.png",
        label: "Data Guru",
        href: "/list/guru",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        label: "Data Siswa",
        href: "/list/siswa",
        visible: ["admin"],
      },
      {
        icon: "/student.png",
        label: "Data Siswa",
        href: "/list/guru/siswa",
        visible: ["guru"],
      },
      {
        label: "Data Kelas",
        href: "/list/kelas",
        visible: ["admin"],
        icon: "/lesson.png",
      },
      {
        label: "Jadwal",
        href: "/jadwal_siswa",
        visible: ["siswa"],
        icon: "/calendar.png",
      },
      {
        label: "Nilai",
        href: "/nilai_siswa",
        visible: ["siswa"],
        icon: "/result.png",
      },
      {
        label: "Absen Siswa",
        href: "/absen_siswa",
        visible: ["siswa"],
        icon: "/lesson.png",
      },
      {
        label: "Data Absensi Siswa",
        href: "/list/absensi_siswa",
        visible: ["admin"],
        icon: "/lesson.png",
      },
      {
        label: "Data Absensi Guru",
        href: "/list/absensi_guru",
        visible: ["admin"],
        icon: "/lesson.png",
      },
      {
        label: "Data Absensi Siswa",
        href: "/list/guru/absensi_siswa",
        visible: ["guru"],
        icon: "/lesson.png",
      },
      {
        label: "Data Absensi Anda",
        href: "/list/guru/absensi_me",
        visible: ["guru"],
        icon: "/lesson.png",
      },
      {
        label: "Jadwal",
        href: "/jadwal_guru",
        visible: ["guru"],
        icon: "/calendar.png",
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "guru", "siswa"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "guru", "siswa"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "guru", "siswa"],
      },
    ],
  },
];

const Menu = () => {
  const { user }: any = useAuth();
  const pathname = usePathname();
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(user?.role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight ${
                    pathname === item.href && "bg-lamaSkyLight"
                  }`}
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
