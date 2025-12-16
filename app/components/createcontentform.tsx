"use client";

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { FiX, FiUpload } from "react-icons/fi";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"; // Adjust your path accordingly
import { useRouter } from "next/navigation";

const categories = [
  "Design",
  "UI/UX",
  "Creativity",
  "Development",
  "Marketing",
  "Business",
  "Photography",
  "Writing",
  "Music",
  "Art",
  "Technology",
  "Science",
  "Health",
  "Travel",
  "Food",
];

type FormValues = {
  title: string;
  description: string;
  categories: string[];
};

const CreateContentForm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      categories: [],
    },
  });

  const selectedCategories = watch("categories");

  /* ====== AUTH STATE ====== */
  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, setUser);
    return unsubscribe;
  }, []);

  /* ====== HANDLE CATEGORY CHANGE ====== */
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Get selected options as array of strings
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setValue("categories", values, { shouldValidate: true });
  };

  /* ====== REMOVE CATEGORY (for pills) ====== */
  const removeCategory = (category: string) => {
    setValue(
      "categories",
      selectedCategories.filter((c) => c !== category),
      { shouldValidate: true }
    );
  };

  /* ====== HANDLE IMAGE CHANGE ====== */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ====== SUBMIT FORM ====== */
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      alert("You must be logged in to submit content.");
      return;
    }

    setIsSubmitting(true);

    let imageUrl = "";
    let fileId = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const res = await fetch("/api/upload_image", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();

        if (res.ok && result.url) {
          imageUrl = result.url;
          fileId = result.fileId || "";
        } else {
          alert("Image upload failed. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await addDoc(collection(db, "posts"), {
        title: data.title,
        description: data.description,
        categories: data.categories,
        image: {
          url: imageUrl,
          fileId,
        },
        likes: 0,
        comments: 0,
        userId: user.uid,
        username: user.displayName,
        userimage: user.photoURL,
        createdAt: serverTimestamp(),
      });

      reset();
      setImagePreview(null);
      setImageFile(null);

      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md font-mono">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Content
      </h2>

      {/* User info */}
      <label className="block mb-2 font-semibold">User Name</label>
      <input
        value={user?.displayName || ""}
        disabled
        className="w-full p-3 mb-4 bg-gray-100 border rounded cursor-not-allowed"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <label className="block mb-2 font-semibold">Title</label>
        <textarea
          {...register("title", { required: "Title is required" })}
          rows={2}
          className="w-full p-3 mb-2 border rounded"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>
        )}

        {/* Categories */}
        <label className="block mb-2 font-semibold">Categories</label>
        <select
          multiple
          size={categories.length}
          value={selectedCategories}
          onChange={handleCategoryChange}
          className="w-full p-3 border rounded mb-3"
          disabled={isSubmitting}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Selected categories pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  disabled={isSubmitting}
                >
                  <FiX />
                </button>
              </span>
            ))
          ) : (
            <p className="text-gray-500">No categories selected.</p>
          )}
        </div>

        {/* Description */}
        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={4}
          className="w-full p-3 mb-2 border rounded"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mb-2">
            {errors.description.message}
          </p>
        )}

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={isSubmitting}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 mb-4 border-2 border-dashed rounded flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          <FiUpload /> Select Image
        </button>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded mb-4 border max-h-64 object-contain"
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Submitting, please wait..." : "Submit Content"}
        </button>
      </form>
    </div>
  );
};

export default CreateContentForm;
