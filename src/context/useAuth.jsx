"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect, createContext } from "react";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  logout: () => {},
  token: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const token = getCookie("token");

      if (token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            setUser(data.data?.user);
            setToken(token);
          } else {
            console.error(`Error ${res.status}: ${res.statusText}`);
            setUser(null);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (res.ok) {
        deleteCookie("token");
        setUser(null);
        setToken(null);
        router.push("/login");
      } else {
        console.log(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="space-y-3">
          <img src="/logo.png" alt="" width={80} />
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
