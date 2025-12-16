import { create } from "zustand";

type CommentStore = {
  commentCount: number;
  setCommentCount: (count: number) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  commentCount: 0,
  setCommentCount: (count: number) => set({ commentCount: count }),
}));
