import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src?: string;
  title: string;
  author: string;
  coverImage?: string;
}

function formatTime(seconds: number): string {
  if (Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  author,
  coverImage,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [volume, setVolume] = useState([80]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = Number.parseFloat(speed);
    }
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + seconds),
      );
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  return (
    <div
      data-ocid="audio_player.panel"
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      {src && (
        <audio ref={audioRef} src={src} preload="metadata">
          <track kind="captions" />
        </audio>
      )}

      {/* Cover + Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary flex items-center justify-center">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">🎧</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-foreground font-semibold truncate">{title}</h3>
          <p className="text-muted-foreground text-sm truncate">{author}</p>
          {!src && (
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Demo — no audio file
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <Slider
          data-ocid="audio_player.panel"
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full cursor-pointer [&>span[role=slider]]:bg-primary [&>span[data-orientation=horizontal]]:bg-secondary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="audio_player.panel"
            onClick={() => setMuted((m) => !m)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <div className="w-20">
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="[&>span[role=slider]]:bg-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ocid="audio_player.panel"
            onClick={() => skip(-15)}
            className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center"
          >
            <RotateCcw className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">15</span>
          </button>

          <button
            type="button"
            data-ocid="audio_player.panel"
            onClick={togglePlay}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white ml-0.5" />
            )}
          </button>

          <button
            type="button"
            data-ocid="audio_player.panel"
            onClick={() => skip(15)}
            className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center"
          >
            <RotateCw className="h-5 w-5" />
            <span className="text-[9px] mt-0.5">15</span>
          </button>
        </div>

        <Select value={speed} onValueChange={setSpeed}>
          <SelectTrigger
            data-ocid="audio_player.panel"
            className="w-[70px] h-8 text-xs bg-secondary border-border"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {["0.5", "0.75", "1", "1.25", "1.5", "2"].map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {s}x
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
