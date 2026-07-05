import { ShieldAlert, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function AuthModal({ isOpen, onClose, message }: AuthModalProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  const isDark = theme === "dark";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 relative shadow-2xl border ${
          !isDark 
            ? "bg-white text-zinc-950 border-zinc-200" 
            : "bg-zinc-900 text-white border-zinc-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
            !isDark 
              ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" 
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Lock / Alert Illustration */}
        <div className="w-16 h-16 bg-primary-color/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-primary-color/5">
          <ShieldAlert className="text-primary-color" size={32} />
        </div>

        {/* Modal Headings */}
        <h3 className="text-2xl font-bold text-center mb-2 tracking-tight">
          Authentication Required
        </h3>
        <p className={`text-center mb-8 text-sm leading-relaxed max-w-xs mx-auto ${
          !isDark ? "text-zinc-650" : "text-zinc-350"
        }`}>
          {message || "You need to be logged in to complete this action. Sign in to your Voche account to continue."}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleLogin}
            className="w-full cursor-pointer bg-primary-color text-white hover:bg-primary-color/90 transition-all font-bold h-12 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn size={18} />
            Sign In / Log In
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleSignup}
            className={`w-full cursor-pointer transition-all font-medium h-12 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] border ${
              !isDark 
                ? "border-zinc-200 hover:bg-zinc-50 text-zinc-900" 
                : "border-zinc-800 hover:bg-zinc-850 text-white"
            }`}
          >
            <UserPlus size={18} />
            Create an Account
          </Button>
        </div>

        {/* Dismiss Text Link */}
        <button
          onClick={onClose}
          className={`w-full cursor-pointer text-xs transition-colors mt-6 text-center font-medium hover:underline ${
            !isDark ? "text-zinc-500 hover:text-zinc-900" : "text-zinc-400 hover:text-white"
          }`}
        >
          Continue Browsing as Guest
        </button>
      </div>
    </div>
  );
}
