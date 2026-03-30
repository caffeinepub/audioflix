import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Variant_audio_story } from "../backend";
import type { ContentItem } from "../backend";
import { useActor } from "./useActor";

export function useGetTrending() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllContent() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allContent"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAudiobooks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["audiobooks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentByType(Variant_audio_story.audio);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStories() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContentByType(Variant_audio_story.story);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecentUploads() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["recentUploads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentUploads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLikeCount(contentId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["likeCount", contentId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLikeCount(contentId);
    },
    enabled: !!actor && !isFetching && !!contentId,
  });
}

export function useGetComments(contentId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["comments", contentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommentsForContent(contentId);
    },
    enabled: !!actor && !isFetching && !!contentId,
  });
}

export function useGetBookmarks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBookmarks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchContent(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["search", term],
    queryFn: async () => {
      if (!actor || !term.trim()) return [];
      return actor.searchContentByTitle(term);
    },
    enabled: !!actor && !isFetching && term.trim().length > 0,
  });
}

export function useLikeMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contentId,
      liked,
    }: { contentId: string; liked: boolean }) => {
      if (!actor) throw new Error("Not connected");
      if (liked) {
        return actor.unlikeContent(contentId);
      }
      return actor.likeContent(contentId);
    },
    onSuccess: (_, { contentId }) => {
      qc.invalidateQueries({ queryKey: ["likeCount", contentId] });
      qc.invalidateQueries({ queryKey: ["trending"] });
    },
  });
}

export function useAddCommentMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contentId,
      userName,
      text,
    }: {
      contentId: string;
      userName: string;
      text: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(contentId, userName, text);
    },
    onSuccess: (_, { contentId }) => {
      qc.invalidateQueries({ queryKey: ["comments", contentId] });
    },
  });
}

export function useBookmarkMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contentId,
      bookmarked,
    }: { contentId: string; bookmarked: boolean }) => {
      if (!actor) throw new Error("Not connected");
      if (bookmarked) {
        return actor.unbookmarkContent(contentId);
      }
      return actor.bookmarkContent(contentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useUploadContentMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: ContentItem) => {
      if (!actor) throw new Error("Not connected");
      return actor.uploadContent(content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allContent"] });
      qc.invalidateQueries({ queryKey: ["trending"] });
      qc.invalidateQueries({ queryKey: ["recentUploads"] });
    },
  });
}
