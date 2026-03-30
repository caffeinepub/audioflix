import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, X } from "lucide-react";
import { SiInstagram, SiSpotify } from "react-icons/si";
import { useAppContext } from "../context/AppContext";

export function AboutOwnerModal() {
  const { aboutOwnerOpen, setAboutOwnerOpen } = useAppContext();

  return (
    <Dialog open={aboutOwnerOpen} onOpenChange={setAboutOwnerOpen}>
      <DialogContent
        data-ocid="about_owner.modal"
        className="bg-card border-border text-foreground max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg">
            About the Owner
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-4">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-4xl shadow-xl">
            🎙️
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Archit Tola</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Creator & Founder of AudioFlix
            </p>
          </div>

          <div className="w-full space-y-3">
            <a
              href="mailto:archittola5@gmail.com"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors group"
            >
              <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  archittola5@gmail.com
                </p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/beingarchit.01?igsh=Njh2ZGtxd2wxOW5i"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors group"
            >
              <div className="w-9 h-9 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <SiInstagram className="h-4 w-4 text-pink-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Instagram</p>
                <p className="text-sm font-medium text-foreground group-hover:text-pink-400 transition-colors">
                  @beingarchit.01
                </p>
              </div>
            </a>

            <a
              href="https://open.spotify.com/show/4kCNuGNukCaccXpzyANxnE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors group"
            >
              <div className="w-9 h-9 bg-[#1DB954]/20 rounded-lg flex items-center justify-center">
                <SiSpotify className="h-4 w-4 text-[#1DB954]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spotify</p>
                <p className="text-sm font-medium text-foreground group-hover:text-[#1DB954] transition-colors">
                  AudioFlix on Spotify
                </p>
              </div>
            </a>
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Passionate about storytelling and making audiobooks accessible to
            everyone. AudioFlix is built with love for readers and listeners
            worldwide.
          </p>
        </div>

        <button
          type="button"
          data-ocid="about_owner.close_button"
          onClick={() => setAboutOwnerOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
