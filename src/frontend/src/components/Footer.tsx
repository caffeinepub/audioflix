import { Heart } from "lucide-react";
import { SiInstagram, SiSpotify } from "react-icons/si";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const OWNER_PRINCIPAL =
  "osefq-ix4ug-7frr4-b6wja-g32j3-iuzrq-gd7bf-3q52s-jxqjr-vy27l-3ae";

export function Footer() {
  const { navigate, setAboutOwnerOpen } = useAppContext();
  const { identity } = useInternetIdentity();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const fullPrincipal = identity ? identity.getPrincipal().toString() : "";
  const isOwner = fullPrincipal === OWNER_PRINCIPAL;

  const navLinks = [
    { label: "Home", action: () => navigate("home") },
    ...(isOwner
      ? [{ label: "Upload Content", action: () => navigate("upload") }]
      : []),
    { label: "About", action: () => navigate("about") },
    { label: "About Owner", action: () => setAboutOwnerOpen(true) },
  ];

  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-3">
              🎧 AudioFlix
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your destination for audiobooks and stories. Listen, read, and
              share the power of storytelling.
            </p>
            {/* Spotify Badge */}
            <a
              href="https://open.spotify.com/show/4kCNuGNukCaccXpzyANxnE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/30 transition-colors group"
            >
              <SiSpotify className="h-4 w-4 text-[#1DB954]" />
              <span className="text-sm font-medium text-[#1DB954] group-hover:text-[#1DB954]">
                Listen on Spotify
              </span>
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    data-ocid="footer.link"
                    onClick={link.action}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-2">
              <a
                href="mailto:archittola5@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ✉️ archittola5@gmail.com
              </a>
              <a
                href="https://www.instagram.com/beingarchit.01?igsh=Njh2ZGtxd2wxOW5i"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-pink-400 transition-colors"
              >
                <SiInstagram className="h-3.5 w-3.5" />
                @beingarchit.01
              </a>
              <a
                href="https://open.spotify.com/show/4kCNuGNukCaccXpzyANxnE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#1DB954] transition-colors"
              >
                <SiSpotify className="h-3.5 w-3.5" />
                AudioFlix on Spotify
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with{" "}
            <Heart className="inline h-3 w-3 text-primary fill-primary" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button
              type="button"
              data-ocid="footer.link"
              onClick={() => navigate("about")}
              className="hover:text-foreground transition-colors"
            >
              About
            </button>
            <span>·</span>
            <a
              href="mailto:archittola5@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <span>·</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
