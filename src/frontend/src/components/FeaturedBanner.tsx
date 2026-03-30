import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import type { DisplayContent } from "../context/AppContext";

interface FeaturedBannerProps {
  content: DisplayContent;
}

export function FeaturedBanner({ content }: FeaturedBannerProps) {
  const { navigate } = useAppContext();

  return (
    <div className="relative w-full h-[480px] md:h-[560px] overflow-hidden">
      {/* Background Image */}
      {content.coverImage && (
        <img
          src={content.coverImage}
          alt={content.title}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative h-full flex flex-col justify-end pb-16 px-6 md:px-12 max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase border-0">
            {content.contentType === "audio" ? "🎧 Audiobook" : "📖 Story"}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-white/30 text-white/70"
          >
            {content.genre}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
          {content.title}
        </h1>

        <p className="text-sm text-white/80 mb-2">by {content.authorName}</p>

        <p className="text-white/70 text-sm md:text-base mb-6 line-clamp-2 max-w-lg">
          {content.description}
        </p>

        <div className="flex items-center gap-3">
          <Button
            data-ocid="featured.primary_button"
            onClick={() => navigate("detail", content)}
            className="bg-white hover:bg-white/90 text-black font-semibold h-11 px-6 gap-2"
          >
            {content.contentType === "audio" ? (
              <Play className="h-5 w-5 fill-black" />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
            {content.contentType === "audio" ? "Play Now" : "Read Now"}
          </Button>
          <Button
            data-ocid="featured.secondary_button"
            onClick={() => navigate("detail", content)}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-11 px-6"
          >
            More Info
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
