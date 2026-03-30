import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Bookmark, Heart, MoreVertical, Play } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { DisplayContent } from "../context/AppContext";

interface ContentCardProps {
  content: DisplayContent;
  index: number;
}

const GRADIENT_COLORS = [
  "from-purple-900 to-blue-900",
  "from-rose-900 to-orange-900",
  "from-emerald-900 to-teal-900",
  "from-amber-900 to-red-900",
  "from-sky-900 to-indigo-900",
  "from-violet-900 to-pink-900",
];

export function ContentCard({ content, index }: ContentCardProps) {
  const { navigate, setAboutOwnerOpen } = useAppContext();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(content.likeCount ?? 0);

  const gradientClass = GRADIENT_COLORS[index % GRADIENT_COLORS.length];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => !prev);
  };

  return (
    <div
      data-ocid={`content.item.${index + 1}`}
      className="group relative shrink-0 w-[150px] md:w-[180px] cursor-pointer card-hover"
      onClick={() => navigate("detail", content)}
      onKeyDown={(e) => e.key === "Enter" && navigate("detail", content)}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-2">
        {content.coverImage ? (
          <img
            src={content.coverImage}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : content.thumbnailBlobId ? (
          <img
            src={content.thumbnailBlobId.getDirectURL()}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-4xl">
              {content.contentType === "audio" ? "🎧" : "📖"}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary rounded-full p-3">
            {content.contentType === "audio" ? (
              <Play className="h-5 w-5 text-white fill-white" />
            ) : (
              <BookOpen className="h-5 w-5 text-white" />
            )}
          </div>
        </div>

        {/* Type Badge */}
        <Badge className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 backdrop-blur-sm border-0 text-white px-1.5 py-0.5">
          {content.contentType === "audio" ? "🎧" : "📖"}
        </Badge>

        {/* Three-dot Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-ocid={`content.item.${index + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-full p-1 text-white hover:bg-black/80"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-popover border-border text-foreground z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => navigate("detail", content)}>
              {content.contentType === "audio" ? "▶ Play" : "📖 Read"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark(e as any);
              }}
            >
              {bookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
            </DropdownMenuItem>
            <DropdownMenuItem
              data-ocid="about_owner.button"
              onClick={(e) => {
                e.stopPropagation();
                setAboutOwnerOpen(true);
              }}
            >
              ℹ️ About Owner
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {content.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate mb-1.5">
          {content.authorName}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
            {content.genre}
          </span>
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>

      {/* Bookmark indicator */}
      {bookmarked && (
        <div className="absolute top-2 right-2">
          <Bookmark className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
      )}
    </div>
  );
}
