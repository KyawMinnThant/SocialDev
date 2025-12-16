import { create } from "zustand";
import { DocumentSnapshot } from "firebase/firestore";

type PaginationState = {
  currentPage: number;
  postsPerPage: number;
  totalPosts: number;
  totalPages: number;
  lastVisibleDocs: Record<number, DocumentSnapshot | null>;

  setPage: (page: number) => void;
  setTotalPosts: (count: number) => void;
  setLastVisibleDoc: (page: number, doc: DocumentSnapshot | null) => void;
};

export const usePaginationStore = create<PaginationState>((set, get) => ({
  currentPage: 1,
  postsPerPage: 5,
  totalPosts: 0,
  totalPages: 0,
  lastVisibleDocs: {},

  setPage: (page) => {
    const totalPages = get().totalPages || 1;
    const newPage = Math.max(1, Math.min(page, totalPages));
    set({ currentPage: newPage });
  },

  setTotalPosts: (count) => {
    const postsPerPage = get().postsPerPage;
    const totalPages = Math.ceil(count / postsPerPage) || 1;
    set({
      totalPosts: count,
      totalPages,
      currentPage: Math.min(get().currentPage, totalPages),
    });
  },

  setLastVisibleDoc: (page, doc) => {
    set((state) => ({
      lastVisibleDocs: { ...state.lastVisibleDocs, [page]: doc },
    }));
  },
}));
