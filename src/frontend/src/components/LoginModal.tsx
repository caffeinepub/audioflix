import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, LogIn, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen } = useAppContext();
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    await login();
    setLoginModalOpen(false);
  };

  return (
    <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent
        data-ocid="login.dialog"
        className="bg-card border-border text-foreground max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            Sign In to AudioFlix
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect your identity to like, comment, bookmark, and upload
            content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex flex-col items-center gap-4 p-6 bg-secondary rounded-xl">
            <span className="text-5xl">🎧</span>
            <div className="text-center">
              <p className="font-semibold text-foreground">Secure Login</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use Internet Identity for a private, secure experience.
              </p>
            </div>
          </div>

          <Button
            data-ocid="login.submit_button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No account needed. Your identity is managed securely on the
            blockchain.
          </p>
        </div>

        <button
          type="button"
          data-ocid="login.close_button"
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
