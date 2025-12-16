"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setAuthCookie } from "../lib/setAuthCookies";
import { useRouter } from "next/navigation";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  photo?: FileList; // file input for photo
};

const Registerform: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setFirebaseError(null);
    setLoading(true);

    try {
      let photoURL = ""; // Default empty photo

      // 1️⃣ Upload photo to ImageKit if provided
      if (data.photo && data.photo.length > 0) {
        const formData = new FormData();
        formData.append("file", data.photo[0]);

        const res = await fetch("/api/upload_image", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!res.ok || !result.url) {
          throw new Error("Failed to upload profile photo");
        }

        photoURL = result.url;
      }

      // 2️⃣ Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // 3️⃣ Update Firebase profile with name and ImageKit photo URL
      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL || undefined,
      });

      // 4️⃣ Get token + uid
      const token = await user.getIdToken();
      const uid = user.uid;

      // 5️⃣ Store cookie on server
      await setAuthCookie(token, uid);

      // 6️⃣ Redirect
      router.push("/");
    } catch (error: any) {
      setFirebaseError(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-mono mt-[80px] max-w-md mx-auto p-8 bg-white rounded-md shadow-md">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Register to SocialDev
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <label className="block text-gray-700 font-medium">Name</label>
        <input
          disabled={loading}
          {...register("name", { required: "Name is required" })}
          className={`w-full border px-4 py-3 rounded-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}

        <label className="block text-gray-700 font-medium">Email</label>
        <input
          disabled={loading}
          {...register("email", { required: "Email is required" })}
          className={`w-full border px-4 py-3 rounded-md ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        <label className="block text-gray-700 font-medium">Password</label>
        <input
          type="password"
          disabled={loading}
          {...register("password", { required: "Password is required" })}
          className={`w-full border px-4 py-3 rounded-md ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        <label className="block text-gray-700 font-medium">Profile Photo</label>
        <input
          type="file"
          disabled={loading}
          accept="image/*"
          {...register("photo")}
          className="w-full"
        />

        {firebaseError && (
          <p className="text-red-600 text-center">{firebaseError}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-8 text-center">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Registerform;
