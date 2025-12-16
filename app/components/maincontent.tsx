"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

import ContentCard from "./contentcard";
import ContentTabs from "./contenttab";
import RightPanel from "./righttab";
import Pagination from "./pagination";
import { usePaginationStore } from "../store/usePaginationStore";
import ContentCardSkeleton from "./contentcardskeleton";
import { useAuthStore } from "../store/useAuthStore";

const Maincontent = () => {
  const {
    currentPage,
    postsPerPage,
    setTotalPosts,
    lastVisibleDocs,
    setLastVisibleDoc,
    setPage,
  } = usePaginationStore();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuthStore();

  // Track screen size for responsive behavior
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    function onResize() {
      setWindowWidth(window.innerWidth);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Get total posts count
  useEffect(() => {
    const fetchTotalPosts = async () => {
      try {
        const snapshot = await getCountFromServer(collection(db, "posts"));
        setTotalPosts(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching total posts count:", error);
      }
    };

    fetchTotalPosts();
  }, [setTotalPosts]);

  // Prevent fetching if lastVisibleDoc for previous page missing on pages > 1
  useEffect(() => {
    if (currentPage > 1 && !lastVisibleDocs[currentPage - 1]) {
      setPage(1);
    }
  }, [currentPage, lastVisibleDocs, setPage]);

  // Fetch posts based on currentPage using cursor pagination
  useEffect(() => {
    let isCancelled = false;

    const fetchPosts = async () => {
      setLoading(true);

      try {
        let q;

        if (currentPage === 1) {
          q = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            limit(postsPerPage)
          );
        } else {
          const lastDoc = lastVisibleDocs[currentPage - 1] as
            | DocumentSnapshot
            | undefined;

          if (!lastDoc) {
            q = query(
              collection(db, "posts"),
              orderBy("createdAt", "desc"),
              limit(postsPerPage)
            );
          } else {
            q = query(
              collection(db, "posts"),
              orderBy("createdAt", "desc"),
              startAfter(lastDoc),
              limit(postsPerPage)
            );
          }
        }

        const snapshot = await getDocs(q);

        if (isCancelled) return;

        if (snapshot.docs.length > 0) {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          setLastVisibleDoc(currentPage, lastVisible);
        }

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(data);
      } catch (error) {
        if (!isCancelled) console.error("Error fetching posts:", error);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, postsPerPage, lastVisibleDocs, setLastVisibleDoc]);

  return (
    <main className="font-mono min-h-screen pt-16 bg-white relative">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <section className="flex-1 flex flex-col overflow-y-auto px-6 py-6">
          <ContentTabs />
          {loading && posts.length === 0 ? (
            <ContentCardSkeleton />
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">No posts found.</p>
          ) : (
            <>
              <div className="flex flex-col gap-6 mt-6">
                {posts.map((post) => {
                  // Merge fresh user info if post.userId matches currentUser.uid
                  const updatedPost = {
                    ...post,
                    username:
                      post.userId === currentUser?.uid
                        ? currentUser?.displayName || post.username
                        : post.username,
                    userimage:
                      post.userId === currentUser?.uid
                        ? currentUser?.photoURL || post.userimage
                        : post.userimage,
                  };
                  return <ContentCard key={post.id} post={updatedPost} />;
                })}
              </div>
              <Pagination />
            </>
          )}
        </section>

        <aside className="hidden md:block w-1/3 bg-gray-50 border-l p-10 overflow-y-auto">
          <RightPanel />
        </aside>
      </div>
    </main>
  );
};

export default Maincontent;
