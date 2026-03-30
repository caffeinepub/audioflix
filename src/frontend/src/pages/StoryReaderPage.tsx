import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Minus, Plus, Type } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

export function StoryReaderPage() {
  const { selectedContent, navigate } = useAppContext();
  const [fontSize, setFontSize] = useState(18);

  if (!selectedContent) {
    navigate("home");
    return null;
  }

  const adjustFont = (delta: number) => {
    setFontSize((prev) => Math.min(28, Math.max(12, prev + delta)));
  };

  const paragraphs = selectedContent.textContent
    ? selectedContent.textContent.split("\n\n").filter(Boolean)
    : [];

  return (
    <main className="min-h-screen pt-16 pb-20 bg-background">
      {/* Reader Toolbar */}
      <div className="sticky top-16 z-30 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <button
            type="button"
            data-ocid="reader.back_button"
            onClick={() => navigate("detail", selectedContent)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">
              {selectedContent.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <button
              type="button"
              data-ocid="reader.button"
              onClick={() => adjustFont(-1)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs text-foreground w-7 text-center">
              {fontSize}
            </span>
            <button
              type="button"
              data-ocid="reader.button"
              onClick={() => adjustFont(1)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reading Area */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-10">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          data-ocid="reader.panel"
        >
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-border">
            <h1
              className="font-bold text-foreground mb-3"
              style={{ fontSize: `${fontSize + 12}px` }}
            >
              {selectedContent.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              by {selectedContent.authorName} · {selectedContent.genre}
            </p>
          </div>

          {/* Text Content */}
          {paragraphs.length > 0 ? (
            <div
              className="space-y-5 text-foreground/90 leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              {paragraphs.map((paragraph, i) => (
                <p key={`p-${paragraph.slice(0, 20)}-${i}`} className="">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No text content available for this story.</p>
              <Button
                variant="outline"
                className="mt-4 border-border text-foreground"
                onClick={() => navigate("detail", selectedContent)}
              >
                Go Back
              </Button>
            </div>
          )}

          {/* End of story */}
          {paragraphs.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-muted-foreground text-sm italic">
                — End of "{selectedContent.title}" —
              </p>
              <Button
                data-ocid="reader.button"
                variant="outline"
                className="mt-6 border-border text-foreground hover:bg-secondary"
                onClick={() => navigate("detail", selectedContent)}
              >
                Back to Details
              </Button>
            </div>
          )}
        </motion.article>
      </div>
    </main>
  );
}
