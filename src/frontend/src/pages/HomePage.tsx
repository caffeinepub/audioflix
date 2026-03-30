import { useMemo } from "react";
import { Variant_audio_story } from "../backend";
import type { ContentItem, ContentItemWithLikes } from "../backend";
import { ContentRow } from "../components/ContentRow";
import { FeaturedBanner } from "../components/FeaturedBanner";
import type { DisplayContent } from "../context/AppContext";
import { SAMPLE_CONTENT } from "../data/sampleContent";
import {
  useGetAudiobooks,
  useGetRecentUploads,
  useGetStories,
  useGetTrending,
} from "../hooks/useQueries";

function toDisplay(item: ContentItem | ContentItemWithLikes): DisplayContent {
  return {
    id: item.id,
    title: item.title,
    authorName: item.authorName,
    description: item.description,
    genre: item.genre,
    contentType:
      item.contentType === Variant_audio_story.audio ? "audio" : "story",
    textContent: item.textContent,
    likeCount: (item as ContentItemWithLikes).likeCount,
    blobId: item.blobId,
    thumbnailBlobId: item.thumbnailBlobId,
    isBackend: true,
    originalItem: item,
  };
}

export function HomePage() {
  const { data: trending = [] } = useGetTrending();
  const { data: audiobooks = [] } = useGetAudiobooks();
  const { data: stories = [] } = useGetStories();
  const { data: recentUploads = [] } = useGetRecentUploads();

  const trendingDisplay = useMemo(
    () =>
      trending.length > 0
        ? trending.map(toDisplay)
        : SAMPLE_CONTENT.filter((c) => c.contentType === "audio"),
    [trending],
  );

  const audiobooksDisplay = useMemo(
    () =>
      audiobooks.length > 0
        ? audiobooks.map(toDisplay)
        : SAMPLE_CONTENT.filter((c) => c.contentType === "audio"),
    [audiobooks],
  );

  const storiesDisplay = useMemo(
    () =>
      stories.length > 0
        ? stories.map(toDisplay)
        : SAMPLE_CONTENT.filter((c) => c.contentType === "story"),
    [stories],
  );

  const recentDisplay = useMemo(
    () =>
      recentUploads.length > 0 ? recentUploads.map(toDisplay) : SAMPLE_CONTENT,
    [recentUploads],
  );

  const featuredItem = trendingDisplay[0] ?? SAMPLE_CONTENT[0];

  return (
    <main>
      <FeaturedBanner content={featuredItem} />

      <div className="pt-6">
        <ContentRow
          title="Trending Audiobooks"
          emoji="🔥"
          items={audiobooksDisplay}
        />
        <ContentRow title="Popular Stories" emoji="📖" items={storiesDisplay} />
        <ContentRow title="New Uploads" emoji="🆕" items={recentDisplay} />
        <ContentRow title="All Content" emoji="🎧" items={trendingDisplay} />
      </div>
    </main>
  );
}
