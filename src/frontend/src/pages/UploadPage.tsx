import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import {
  ArrowLeft,
  BookText,
  Image as ImageIcon,
  Loader2,
  Music,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, Variant_audio_story } from "../backend";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUploadContentMutation } from "../hooks/useQueries";

const GENRES = [
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Action",
  "Mystery",
  "Horror",
  "Drama",
  "Comedy",
  "Biography",
  "Self-Help",
  "History",
  "Children",
];

export function UploadPage() {
  const { navigate } = useAppContext();
  const { identity } = useInternetIdentity();
  const uploadMutation = useUploadContentMutation();

  const [contentType, setContentType] = useState<"audio" | "story">("story");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [genre, setGenre] = useState("");
  const [textContent, setTextContent] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    if (!title.trim() || !authorName.trim() || !genre) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (contentType === "story" && !textContent.trim()) {
      toast.error("Please enter the story text");
      return;
    }
    if (contentType === "audio" && !audioFile) {
      toast.error("Please upload an audio file");
      return;
    }

    try {
      let blobId: ExternalBlob | undefined;
      let thumbnailBlobId: ExternalBlob | undefined;

      if (audioFile) {
        const bytes = new Uint8Array(await audioFile.arrayBuffer());
        blobId = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
          setUploadProgress(Math.round(p * 50)),
        );
      }

      if (thumbnailFile) {
        const bytes = new Uint8Array(await thumbnailFile.arrayBuffer());
        thumbnailBlobId = ExternalBlob.fromBytes(bytes).withUploadProgress(
          (p) => setUploadProgress(50 + Math.round(p * 50)),
        );
      }

      const contentItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        uploaderPid: identity.getPrincipal() as Principal,
        title: title.trim(),
        contentType:
          contentType === "audio"
            ? Variant_audio_story.audio
            : Variant_audio_story.story,
        authorName: authorName.trim(),
        description: description.trim(),
        genre,
        textContent: textContent.trim(),
        createdAt: BigInt(Date.now() * 1_000_000),
        blobId,
        thumbnailBlobId,
      };

      await uploadMutation.mutateAsync(contentItem);
      toast.success("Content uploaded successfully! 🎉");
      navigate("home");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploadProgress(0);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <button
          type="button"
          data-ocid="upload.back_button"
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Upload Content
          </h1>
          <p className="text-muted-foreground">
            Share your audiobook or story with the world
          </p>
        </div>

        {/* Content Type Toggle */}
        <div className="flex gap-3 mb-8 p-1.5 bg-secondary rounded-xl">
          {(["story", "audio"] as const).map((type) => (
            <button
              type="button"
              key={type}
              data-ocid="upload.toggle"
              onClick={() => setContentType(type)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                contentType === type
                  ? "bg-card text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "audio" ? (
                <>
                  <Music className="h-4 w-4" /> Audiobook
                </>
              ) : (
                <>
                  <BookText className="h-4 w-4" /> Story
                </>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">
              Title *
            </Label>
            <Input
              data-ocid="upload.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title..."
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11"
              required
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">
              Author Name *
            </Label>
            <Input
              data-ocid="upload.input"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name or pen name"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11"
              required
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">
              Genre *
            </Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger
                data-ocid="upload.select"
                className="bg-secondary border-border text-foreground h-11"
              >
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">
              Description
            </Label>
            <Textarea
              data-ocid="upload.textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content..."
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[100px]"
            />
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">
              Thumbnail Image
            </Label>
            <button
              type="button"
              data-ocid="upload.dropzone"
              onClick={() => thumbInputRef.current?.click()}
              className="w-full border border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-24 h-32 object-cover rounded-lg"
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Upload Thumbnail
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </>
              )}
            </button>
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
          </div>

          {/* Audio File (for audiobooks) */}
          {contentType === "audio" && (
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">
                Audio File *
              </Label>
              <button
                type="button"
                data-ocid="upload.dropzone"
                onClick={() => audioInputRef.current?.click()}
                className="w-full border border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {audioFile ? audioFile.name : "Upload Audio File"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP3, WAV, M4A up to 50MB
                  </p>
                </div>
              </button>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>
          )}

          {/* Story Text (for stories) */}
          {contentType === "story" && (
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">
                Story Text *
              </Label>
              <Textarea
                data-ocid="upload.textarea"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write your story here... Use double line breaks for paragraphs."
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[300px] font-mono text-sm leading-relaxed"
                required
              />
              <p className="text-xs text-muted-foreground">
                {textContent.length} characters ·{" "}
                {textContent.split(" ").filter(Boolean).length} words
              </p>
            </div>
          )}

          {/* Progress */}
          {isUploading && uploadProgress > 0 && (
            <div data-ocid="upload.loading_state" className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            data-ocid="upload.submit_button"
            type="submit"
            disabled={isUploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Publish {contentType === "audio" ? "Audiobook" : "Story"}
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
