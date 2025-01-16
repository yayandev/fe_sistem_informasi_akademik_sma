"use client";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
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
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

          if (res.status === 400) {
            // delete cookie
            deleteCookie("token");
            setUser(null);
            setToken(null);
            router.push("/login");
            setLoading(false);
            return;
          }

          if (res.status === 200) {
            const data = await res.json();
            setUser(data.data?.user);
            setToken(token);
          } else {
            console.log(`Error ${res.status}: ${res.statusText}`);
            setToken(null);
            setUser(null);
            setError(true);
            const data = await res.json();
            setErrorMessage(data.message);
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

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="space-y-3 flex-col gap-3">
          <img src="/logo.png" alt="" width={80} />
          <h1 className="text-red-500">{errorMessage}</h1>
          <button
            onClick={() => {
              setError(false);
              setErrorMessage("");
              router.refresh();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh
          </button>
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
