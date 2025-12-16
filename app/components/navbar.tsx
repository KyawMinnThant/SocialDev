"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiMenu,
  FiX,
  FiHash,
  FiUsers,
  FiTrendingUp,
  FiCompass,
  FiLogOut,
  FiBookmark,
} from "react-icons/fi";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useSidebarStore } from "../store/useSidebarStore";
import { useAuthStore } from "../store/useAuthStore";
import { clearAuthCookie } from "../lib/setAuthCookies";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  description: string;
  userimage: string;
}

export default function Navbar() {
  const { sidebarOpen, toggleSidebar } = useSidebarStore();
  const { user, setUser } = useAuthStore();

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showSearchCard, setShowSearchCard] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [searching, setSearching] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [cookieValid, setCookieValid] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- Screen size ---------------- */
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- Auth ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, [setUser]);

  /* ---------------- Outside click ---------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowSearchCard(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- Search ---------------- */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchPosts = async () => {
      setSearching(true);
      try {
        const q = query(
          collection(db, "posts"),
          where("title", ">=", searchTerm),
          where("title", "<=", searchTerm + "\uf8ff"),
          limit(3)
        );
        const snap = await getDocs(q);
        setResults(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Post, "id">),
          }))
        );
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    };

    fetchPosts();
  }, [searchTerm]);

  useEffect(() => {
    // Call your API route to validate cookies
    const validateCookies = async () => {
      try {
        const res = await fetch("/api/auth/session"); // Adjust your API route if needed
        if (!res.ok) throw new Error("Failed to validate cookies");
        const data = await res.json();
        console.log(data);
        setCookieValid(data.loggedIn);
      } catch {
        setCookieValid(false);
      }
    };

    validateCookies();
  }, []);
  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;
    await signOut(auth);
    await clearAuthCookie();
    setUser(null);
    setCookieValid(false);
  };

  const isSidebarActive = !isLargeScreen;

  console.log(cookieValid);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 px-0 md:px-2 lg:px-10 overflow-x-hidden w-full bg-white shadow-sm font-mono z-[4000]">
        <div className="flex justify-between items-center px-6 py-3 relative">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-2xl text-gray-700 lg:hidden"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>

            {sidebarOpen && isSidebarActive && (
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={toggleSidebar}
              />
            )}

            {isSidebarActive && (
              <aside
                className={`fixed inset-y-0 left-0 w-64 bg-gray-100 border-r border-gray-300 z-50 flex flex-col
                transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              >
                <div className="flex justify-end p-4">
                  <button onClick={toggleSidebar} className="text-2xl">
                    <FiX />
                  </button>
                </div>
                <Sidebar />
              </aside>
            )}

            <Link href="/" className="text-2xl font-semibold">
              SocialDev
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Search (lg) */}
            <div
              className="hidden lg:flex items-center bg-gray-100 p-2 rounded-full w-80 cursor-text"
              onClick={() => setShowSearchCard(true)}
            >
              <FiSearch />
              <input
                ref={searchInputRef}
                className="bg-transparent outline-none ml-3 w-full"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Search icon */}
            <button
              className="md:flex lg:hidden ml-5 text-xl p-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowSearchCard(true)}
            >
              <FiSearch />
            </button>

            {user && cookieValid === true && (
              <>
                <Link href="/createcontent" className="hidden md:flex gap-2">
                  <FiEdit /> Write
                </Link>
                <Link href="/bookmark">
                  <FiBookmark className="hidden lg:inline text-xl" />
                </Link>
              </>
            )}

            {loadingAuth ? (
              <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-full" />
            ) : !user || cookieValid === false ? (
              <Link
                href="/login"
                className="border px-5 py-1.5 rounded-full hover:bg-gray-100"
              >
                Login
              </Link>
            ) : (
              <div className="flex gap-5">
                <Link href="/profile" className="flex items-center gap-2">
                  {user?.photoURL && (
                    <img src={user.photoURL} className="w-8 h-8 rounded-full" />
                  )}
                  <span className="hidden md:inline">
                    {user?.displayName || "User"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-2 text-red-600"
                >
                  Logout <FiLogOut />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SEARCH POPUP */}
      {showSearchCard && (
        <div
          ref={cardRef}
          className={`bg-white shadow-xl border rounded-lg p-5 overflow-auto max-h-[60vh]
          ${
            isLargeScreen
              ? "absolute mt-1 w-[360px] lg:w-[400px] z-50"
              : "fixed top-[112px] left-1/2 -translate-x-1/2 w-80 z-50"
          }`}
          style={
            isLargeScreen && searchInputRef.current
              ? {
                  top:
                    searchInputRef.current.getBoundingClientRect().bottom +
                    window.scrollY +
                    4,
                  left:
                    searchInputRef.current.getBoundingClientRect().left +
                    window.scrollX,
                }
              : undefined
          }
        >
          {!isLargeScreen && (
            <div className="flex bg-gray-100 p-2 rounded-full mb-4">
              <FiSearch />
              <input
                className="bg-transparent outline-none ml-3 w-full"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <h3 className="text-lg font-semibold mb-4">Explore Content</h3>

          {searching && <p>Searching...</p>}
          {!searching && !results.length && searchTerm && (
            <p>No results found</p>
          )}

          <div className="space-y-3">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/content/${p.id}`}
                className="p-3 border flex gap-3 rounded-lg hover:bg-gray-50"
                onClick={() => setShowSearchCard(false)}
              >
                <Image
                  alt={p.title}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  width={30}
                  height={30}
                  src={p.userimage}
                  className=" rounded-full"
                />
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-gray-500">
                    {p.description.slice(0, 80)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-3">
            <Link href="/exploretopic" className="flex gap-3">
              <FiHash /> Explore Topics
            </Link>
            <div className="flex gap-3">
              <FiUsers /> People to Follow
            </div>
            <div className="flex gap-3">
              <FiTrendingUp /> Trending Posts
            </div>
            <div className="flex gap-3">
              <FiCompass /> Explore Feed
            </div>
          </div>
        </div>
      )}
    </>
  );
}
