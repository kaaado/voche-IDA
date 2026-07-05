import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from './ui/select';
import { MessageSquare, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { apiClient } from '../lib/apiClient';
import { SYSTEM } from '../lib/api';
import { useErrorHandler } from '../hooks/useErrorHandler';

export default function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { handleError } = useErrorHandler();

  const [formData, setFormData] = useState({
    category: '',
    rating: 0,
    message: '',
  });
  
  const [hoverRating, setHoverRating] = useState(0);

  // Check 24 hour submission lock via Redis/Backend
  useEffect(() => {
    const checkLock = async () => {
      try {
        const res = await apiClient.get(SYSTEM.FEEDBACK_LOCK);
        if (res.data?.locked) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
      } catch (err) {
        // Fallback to localStorage if API/Redis check fails
        const submittedAt = localStorage.getItem('voche_feedback_submitted_at');
        if (submittedAt) {
          const timeDiff = Date.now() - Number(submittedAt);
          const twentyFourHours = 24 * 60 * 60 * 1000;
          if (timeDiff < twentyFourHours) {
            setIsLocked(true);
            return;
          }
        }
        setIsLocked(false);
      }
    };
    checkLock();
    // Check every minute in case they leave the page open
    const interval = setInterval(checkLock, 60000);
    return () => clearInterval(interval);
  }, [open]);

  if (isLocked) {
    return null;
  }

  const isFormValid = 
    formData.category !== '' && 
    formData.rating > 0 && 
    formData.message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      if (formData.rating === 0) {
        toast.error("Validation Error", { description: "Please select a star rating." });
      } else if (formData.category === '') {
        toast.error("Validation Error", { description: "Please select a category." });
      } else if (formData.message.trim().length < 10) {
        toast.error("Validation Error", { description: "Feedback message must be at least 10 characters long." });
      }
      return;
    }

    setLoading(true);
    try {
      await apiClient.post(SYSTEM.FEEDBACK, {
        category: formData.category,
        rating: formData.rating,
        message: formData.message.trim(),
      });

      toast.success("Feedback Submitted", {
        description: "Thank you for your valuable feedback! We appreciate it."
      });

      // Lock submissions for 24 hours
      localStorage.setItem('voche_feedback_submitted_at', Date.now().toString());
      setIsLocked(true);
      setOpen(false);
      setFormData({ category: '', rating: 0, message: '' });
    } catch (err: any) {
      handleError(err, "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--teal))] text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer border-0"
        title="Share Feedback"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform duration-300 text-white" />
      </button>

      {/* Feedback Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`sm:max-w-[450px] border shadow-xl ${
          !isDark 
            ? "bg-white text-zinc-950 border-zinc-200" 
            : "bg-zinc-900 text-white border-zinc-800"
        }`}>
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2 text-primary">
              <MessageSquare size={28} />
            </div>
            <DialogTitle className={`text-center text-xl font-bold ${!isDark ? 'text-zinc-950' : 'text-white'}`}>
              Share Your Feedback
            </DialogTitle>
            <DialogDescription className={`text-center px-4 ${!isDark ? 'text-zinc-650' : 'text-zinc-350'}`}>
              We'd love to hear your thoughts on how we can improve Voche.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-3">
            {/* Rating Stars */}
            <div className="space-y-2 text-center">
              <Label className={`text-sm font-semibold block ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Rate your experience *
              </Label>
              <div className="flex justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`transition-colors duration-200 ${
                        star <= (hoverRating || formData.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : !isDark ? 'text-zinc-300' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label className={`text-sm font-semibold ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select feedback category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="trial">Clinical Trials</SelectItem>
                  <SelectItem value="patient">Patient Experience</SelectItem>
                  <SelectItem value="feature">New Feature Suggestion</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <Label htmlFor="message" className={`text-sm font-semibold ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                Feedback Message *
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us what you like or what we can improve (at least 10 characters)..."
                className="resize-none min-h-[120px] bg-muted/30 focus-visible:bg-background border-border"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.message.length}/5000 characters
              </p>
            </div>

            {/* Actions */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
                className={`cursor-pointer ${!isDark ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="shadow-md cursor-pointer gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Feedback
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
