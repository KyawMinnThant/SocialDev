"use client";

import { useState, useRef, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

const ProfileForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ✅ Load user once */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      setUser(firebaseUser);
      setUsername(firebaseUser.displayName || "");
      setPhotoPreview(firebaseUser.photoURL || null);
    });

    return unsub;
  }, [setUser]);

  /* ✅ Trigger image select */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  /* ✅ Image preview */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ✅ Update profile */
  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !user) return;

    setLoading(true);

    try {
      let photoURL = user.photoURL || null;

      // ✅ Upload image only if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const res = await fetch("/api/upload_image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.url) {
          throw new Error("Image upload failed");
        }

        photoURL = data.url;
      }

      // ✅ Update Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: photoURL || undefined,
      });

      // ✅ THIS IS THE MOST IMPORTANT PART
      setUser({
        ...auth.currentUser,
        displayName: username,
        photoURL,
      });

      alert("Profile updated successfully ✅");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  return (
    <div className="max-w-lg mx-auto p-6 font-mono">
      <h1 className="text-2xl font-semibold text-center mb-6">Profile</h1>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img
            src={photoPreview || "/default-avatar.png"}
            className="w-24 h-24 rounded-full border object-cover"
            alt="avatar"
          />

          <button
            type="button"
            disabled={loading}
            onClick={triggerFileInput}
            className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow"
          >
            <FiEdit2 />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            disabled={loading}
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm">Username</label>
          <input
            value={username}
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            value={user.email || ""}
            disabled
            className="w-full border px-4 py-2 rounded bg-gray-100"
          />
        </div>

        <button
          disabled={loading}
          onClick={handleUpdateProfile}
          className={`w-full py-2 text-white rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
