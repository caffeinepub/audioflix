import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  LogIn,
  LogOut,
  Menu,
  Search,
  Upload,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import type { DisplayContent } from "../context/AppContext";
import { SAMPLE_CONTENT } from "../data/sampleContent";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Header() {
  const { navigate, setLoginModalOpen } = useAppContext();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<DisplayContent[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const fullPrincipal = identity ? identity.getPrincipal().toString() : "";

  const handleCopyPrincipal = () => {
    navigator.clipboard.writeText(fullPrincipal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length > 0) {
      const results = SAMPLE_CONTENT.filter(
        (c) =>
          c.title.toLowerCase().includes(value.toLowerCase()) ||
          c.authorName.toLowerCase().includes(value.toLowerCase()) ||
          c.genre.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (content: DisplayContent) => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearch(false);
    navigate("detail", content);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm border-b border-white/5">
      {/* Temporary: Show full principal for owner setup */}
      {isLoggedIn && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-yellow-300">
          <span className="font-mono">{fullPrincipal}</span>
          <button
            type="button"
            onClick={handleCopyPrincipal}
            className="flex items-center gap-1 bg-yellow-500/20 hover:bg-yellow-500/40 px-2 py-0.5 rounded transition-colors"
          >
            <Copy className="h-3 w-3" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => navigate("home")}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="text-2xl font-bold text-primary tracking-tight">
            🎧 AudioFlix
          </span>
        </button>

        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6 ml-6">
          <button
            type="button"
            data-ocid="home.link"
            onClick={() => navigate("home")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </button>
          <button
            type="button"
            data-ocid="upload.link"
            onClick={() =>
              isLoggedIn ? navigate("upload") : setLoginModalOpen(true)
            }
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Upload
          </button>
          <button
            type="button"
            data-ocid="about.link"
            onClick={() => navigate("about")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </button>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-ocid="header.search_input"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stories, audiobooks..."
              className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-2xl overflow-hidden z-50">
              {searchResults.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSearchSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-10 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.authorName} · {item.genre}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 md:hidden" />

        {/* Mobile Search Toggle */}
        <button
          type="button"
          data-ocid="header.search_input"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Auth Button */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="upload.button"
              onClick={() => navigate("upload")}
              className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary rounded-full px-3 py-1.5">
              <User className="h-3 w-3" />
              <span className="hidden md:block">
                {fullPrincipal.slice(0, 8)}...
              </span>
            </div>
            <Button
              data-ocid="logout.button"
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            data-ocid="login.button"
            variant="default"
            size="sm"
            onClick={() => setLoginModalOpen(true)}
            disabled={isLoggingIn}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 text-sm font-medium"
          >
            <LogIn className="h-4 w-4 mr-1.5" />
            {isLoggingIn ? "Connecting..." : "Login"}
          </Button>
        )}

        {/* Mobile Menu */}
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stories, audiobooks..."
              className="pl-9 bg-secondary border-border h-9 text-sm"
              autoFocus
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 bg-popover border border-border rounded-lg shadow-2xl overflow-hidden z-50">
              {searchResults.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSearchSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.authorName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur">
          <nav className="flex flex-col px-4 py-3 gap-3">
            <button
              type="button"
              onClick={() => {
                navigate("home");
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm text-foreground py-2"
            >
              🏠 Home
            </button>
            <button
              type="button"
              onClick={() => {
                isLoggedIn ? navigate("upload") : setLoginModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm text-foreground py-2"
            >
              🎙️ Upload Content
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("about");
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm text-foreground py-2"
            >
              ℹ️ About
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
