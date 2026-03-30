import { ArrowLeft } from "lucide-react";
import { Mail } from "lucide-react";
import { motion } from "motion/react";
import { SiInstagram } from "react-icons/si";
import { useAppContext } from "../context/AppContext";

export function AboutPage() {
  const { navigate } = useAppContext();

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <button
          type="button"
          data-ocid="about.back_button"
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🎧</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              About AudioFlix
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              A platform built with passion — for listeners who love stories and
              storytellers who want to be heard.
            </p>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                emoji: "🎧",
                title: "Listen",
                desc: "Immerse yourself in thousands of audiobooks across every genre.",
              },
              {
                emoji: "📖",
                title: "Read",
                desc: "Discover handcrafted stories from independent authors worldwide.",
              },
              {
                emoji: "🎙️",
                title: "Create",
                desc: "Upload your own audiobooks and stories and reach a global audience.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Owner Section */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-4xl shadow-xl">
                🎙️
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                  Founder & Creator
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Archit Tola
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Passionate about making storytelling accessible to everyone.
                  AudioFlix was born from a belief that great stories deserve to
                  be heard — and every voice deserves a stage.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a
                    href="mailto:archittola5@gmail.com"
                    className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    archittola5@gmail.com
                  </a>
                  <a
                    href="https://www.instagram.com/beingarchit.01?igsh=Njh2ZGtxd2wxOW5i"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <SiInstagram className="h-4 w-4 text-pink-500" />
                    @beingarchit.01
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Platform Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: "❤️", label: "Like Stories" },
                { emoji: "🔖", label: "Bookmark" },
                { emoji: "💬", label: "Comments" },
                { emoji: "📱", label: "Mobile Ready" },
                { emoji: "🔒", label: "Secure Login" },
                { emoji: "🌍", label: "Global Access" },
                { emoji: "⚡", label: "Fast Loading" },
                { emoji: "🎛️", label: "Audio Controls" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-xl text-center"
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-xs text-muted-foreground">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
