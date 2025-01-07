import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Definisikan jalur untuk role admin, user, dan publik
  const adminPath = ["/list/guru", "/list/siswa"];
  const publicPath = ["/login", "/"];

  const isAdminPath = adminPath.some((adminRoute) => adminRoute === path);
  const isPublicPath = publicPath.some((publicRoute) => publicRoute === path);

  // Ambil token dari cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Jika tidak ada token dan bukan jalur publik, arahkan ke login
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    // Izinkan jalur publik tanpa token
    return NextResponse.next();
  }

  try {
    // Request ke API untuk mendapatkan role
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const role = data.data.user.role;

      // Logika role berdasarkan jalur
      if (isAdminPath && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      }

      if (isPublicPath && role) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      }
    } else {
      // Jika token tidak valid, arahkan ke login
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Izinkan permintaan jika semua kondisi terpenuhi
  return NextResponse.next();
}

// Configurasi matcher untuk mencocokkan jalur
export const config = {
  matcher: ["/", "/dashboard", "/login", "/gurus", "/siswas", "/logout"],
};
