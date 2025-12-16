"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { setAuthCookie } from "../lib/setAuthCookies"; // your cookie setter function

type LoginFormInputs = {
  email: string;
  password: string;
};

const Loginform: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setError(null);
    setLoading(true);
    try {
      // 1️⃣ Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // 2️⃣ Get token and uid
      const token = await user.getIdToken();
      const uid = user.uid;

      // 3️⃣ Store cookies on server via API
      await setAuthCookie(token, uid);

      // 4️⃣ Redirect user after successful login
      router.push("/");
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const user = userCredential.user;

      const token = await user.getIdToken();
      const uid = user.uid;

      await setAuthCookie(token, uid);

      router.push("/");
    } catch (error: any) {
      setError(error.message || "Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-mono mt-[80px] font-mono max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Login To SocialDev
      </h2>

      {error && (
        <div className="mb-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <label className="block text-gray-700 font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: true })}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading}
        />

        <label className="block text-gray-700 font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: true })}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
          placeholder="Your password"
          autoComplete="current-password"
          disabled={loading}
        />

        <button
          type="submit"
          className={`w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-900 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <hr className="flex-grow border-gray-300" />
        <span className="text-gray-500 font-medium">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 border border-gray-700 py-3 rounded-md font-semibold hover:bg-gray-100 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <img
          src="https://icon2.cleanpng.com/20240216/fty/transparent-google-logo-flat-google-logo-with-blue-green-red-1710875585155.webp"
          alt="Google Logo"
          className="w-6 h-6"
        />
        <span>{loading ? "Please wait..." : "Login with Google"}</span>
      </button>

      <p className="mt-8 text-center text-gray-600 font-medium">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-black font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default Loginform;
