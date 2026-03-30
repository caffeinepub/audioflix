import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import type { DisplayContent } from "../context/AppContext";
import { ContentCard } from "./ContentCard";

interface ContentRowProps {
  title: string;
  emoji: string;
  items: DisplayContent[];
}

export function ContentRow({ title, emoji, items }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "right" ? 320 : -320,
        behavior: "smooth",
      });
    }
  };

  if (!items.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 px-6 md:px-12">
        {emoji} {title}
      </h2>

      <div className="relative group/row">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-8 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <div className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-full p-2 transition-colors">
            <ChevronLeft className="h-5 w-5 text-white" />
          </div>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-2"
        >
          {items.map((item, i) => (
            <ContentCard key={item.id} content={item} index={i} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-8 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <div className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-full p-2 transition-colors">
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
        </button>
      </div>
    </motion.section>
  );
}
