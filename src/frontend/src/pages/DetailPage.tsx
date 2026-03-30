import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Heart,
  MessageSquare,
  Send,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AudioPlayer } from "../components/AudioPlayer";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddCommentMutation,
  useBookmarkMutation,
  useGetBookmarks,
  useGetComments,
  useGetLikeCount,
  useLikeMutation,
} from "../hooks/useQueries";

export function DetailPage() {
  const { selectedContent, navigate, setLoginModalOpen } = useAppContext();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [localLiked, setLocalLiked] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<
    { id: number; userName: string; text: string }[]
  >([]);

  const contentId = selectedContent?.id ?? "";
  const isBackend = selectedContent?.isBackend ?? false;

  const { data: likeCountData } = useGetLikeCount(isBackend ? contentId : "");
  const { data: comments = [] } = useGetComments(isBackend ? contentId : "");
  const { data: bookmarks = [] } = useGetBookmarks();

  const likeMutation = useLikeMutation();
  const addCommentMutation = useAddCommentMutation();
  const bookmarkMutation = useBookmarkMutation();

  if (!selectedContent) {
    navigate("home");
    return null;
  }

  const likeCount = isBackend
    ? (likeCountData ?? selectedContent.likeCount ?? 0)
    : (selectedContent.likeCount ?? 0);
  const bookmarked = isBackend
    ? bookmarks.includes(contentId)
    : localBookmarked;

  const handleLike = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    if (isBackend) {
      likeMutation.mutate({ contentId, liked: localLiked });
    }
    setLocalLiked((prev) => !prev);
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    if (isBackend) {
      bookmarkMutation.mutate({ contentId, bookmarked });
      toast.success(bookmarked ? "Bookmark removed" : "Bookmarked!");
    } else {
      setLocalBookmarked((prev) => !prev);
      toast.success(localBookmarked ? "Bookmark removed" : "Bookmarked!");
    }
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    if (!commentText.trim()) return;

    const userName = `${identity!.getPrincipal().toString().slice(0, 10)}...`;
    if (isBackend) {
      await addCommentMutation.mutateAsync({
        contentId,
        userName,
        text: commentText,
      });
    } else {
      setLocalComments((prev) => [
        ...prev,
        { id: Date.now(), userName, text: commentText },
      ]);
    }
    setCommentText("");
    toast.success("Comment added!");
  };

  const audioSrc = selectedContent.blobId?.getDirectURL();

  const allComments = [
    ...comments.map((c) => ({ id: c.id, userName: c.userName, text: c.text })),
    ...localComments,
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <div className="relative h-[320px] md:h-[400px] overflow-hidden">
        {selectedContent.coverImage ? (
          <img
            src={selectedContent.coverImage}
            alt={selectedContent.title}
            className="w-full h-full object-cover"
          />
        ) : selectedContent.thumbnailBlobId ? (
          <img
            src={selectedContent.thumbnailBlobId.getDirectURL()}
            alt={selectedContent.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <button
          type="button"
          data-ocid="detail.back_button"
          onClick={() => navigate("home")}
          className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Cover */}
            <div className="shrink-0 w-40 h-56 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-2xl">
              {selectedContent.coverImage ? (
                <img
                  src={selectedContent.coverImage}
                  alt={selectedContent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/50 to-black flex items-center justify-center text-5xl">
                  {selectedContent.contentType === "audio" ? "🎧" : "📖"}
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex-1 pt-20 md:pt-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  {selectedContent.contentType === "audio"
                    ? "🎧 Audiobook"
                    : "📖 Story"}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground text-xs"
                >
                  {selectedContent.genre}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {selectedContent.title}
              </h1>
              <p className="text-muted-foreground mb-4">
                by {selectedContent.authorName}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {selectedContent.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {selectedContent.contentType === "story" && (
                  <Button
                    data-ocid="detail.primary_button"
                    onClick={() => navigate("reader", selectedContent)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Read Story
                  </Button>
                )}

                <button
                  type="button"
                  data-ocid="detail.toggle"
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    localLiked
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${localLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm">{likeCount}</span>
                </button>

                <button
                  type="button"
                  data-ocid="detail.toggle"
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    bookmarked || localBookmarked
                      ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                      : "bg-secondary border-border text-muted-foreground hover:border-yellow-500/50"
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${bookmarked || localBookmarked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm">Bookmark</span>
                </button>

                <button
                  type="button"
                  data-ocid="detail.button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {selectedContent.contentType === "audio" && (
            <div className="mb-8">
              <AudioPlayer
                src={audioSrc}
                title={selectedContent.title}
                author={selectedContent.authorName}
                coverImage={selectedContent.coverImage}
              />
            </div>
          )}

          <Separator className="bg-border mb-8" />

          {/* Comments Section */}
          <section data-ocid="comments.section">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Comments ({allComments.length})
            </h2>

            {/* Add Comment */}
            <div className="bg-card border border-border rounded-xl p-4 mb-6">
              <Textarea
                data-ocid="comments.textarea"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  isLoggedIn
                    ? "Write a comment..."
                    : "Login to leave a comment..."
                }
                disabled={!isLoggedIn}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none mb-3 min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button
                  data-ocid="comments.submit_button"
                  onClick={handleAddComment}
                  disabled={
                    !isLoggedIn ||
                    !commentText.trim() ||
                    addCommentMutation.isPending
                  }
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-9"
                >
                  <Send className="h-3.5 w-3.5" />
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Comment List */}
            <div className="space-y-4" data-ocid="comments.list">
              {allComments.length === 0 ? (
                <div
                  data-ocid="comments.empty_state"
                  className="text-center py-12 text-muted-foreground"
                >
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                allComments.map((comment, i) => (
                  <div
                    key={comment.id}
                    data-ocid={`comments.item.${i + 1}`}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {comment.userName}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
