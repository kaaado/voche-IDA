import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Calendar, Building, AlignLeft, Type } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../contexts/ThemeContext';

export function SuggestEventModal({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [formData, setFormData] = useState({
        title: '',
        organizer: '',
        date: '',
        description: ''
    });

    const isFormValid = formData.title.trim() !== '' && formData.date !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            toast.error("Missing Information", {
                description: "Please provide at least a title and date."
            });
            return;
        }

        // Mock submission logic
        const suggestions = JSON.parse(localStorage.getItem('voce_event_suggestions') || '[]');
        suggestions.push({ ...formData, id: Date.now(), status: 'pending' });
        localStorage.setItem('voce_event_suggestions', JSON.stringify(suggestions));

        toast.success("Event Suggested", {
            description: "Thank you! Your event suggestion has been submitted for review."
        });

        setOpen(false);
        setFormData({ title: '', organizer: '', date: '', description: '' });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2">
                        <Plus size={16} />
                        Suggest Event
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[500px] border shadow-xl ${
                !isDark 
                    ? "bg-white text-zinc-950 border-zinc-200" 
                    : "bg-zinc-900 text-white border-zinc-800"
            }`}>
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2 text-primary">
                        <Calendar size={28} />
                    </div>
                    <DialogTitle className={`text-center text-xl font-bold ${!isDark ? 'text-zinc-950' : 'text-white'}`}>Suggest an Event</DialogTitle>
                    <DialogDescription className={`text-center px-4 ${!isDark ? 'text-zinc-650' : 'text-zinc-350'}`}>
                        Know of an upcoming conference, webinar, or workshop? Share it with the community.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className={`flex items-center gap-2 ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                            <Type size={14} /> Event Title
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Annual Global Health Summit 2024"
                            className="bg-muted/30 focus-visible:bg-background border-border"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="organizer" className={`flex items-center gap-2 ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                                <Building size={14} /> Organizer
                            </Label>
                            <Input
                                id="organizer"
                                value={formData.organizer}
                                onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                                placeholder="Organization Name"
                                className="bg-muted/30 focus-visible:bg-background border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className={`flex items-center gap-2 ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                                <Calendar size={14} /> Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="bg-muted/30 focus-visible:bg-background border-border"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className={`flex items-center gap-2 ${!isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>
                            <AlignLeft size={14} /> Description
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of the event..."
                            className="resize-none bg-muted/30 focus-visible:bg-background border-border min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className={`cursor-pointer ${!isDark ? 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>Cancel</Button>
                        <Button type="submit" className="gap-2 shadow-md cursor-pointer" disabled={!isFormValid}>
                            <Plus size={16} />
                            Submit Suggestion
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
