import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  ArrowLeft,
  Share2,
  CalendarPlus,
  CheckCircle2,
  Video
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { toast } from 'sonner';
import { useAuthContext } from '../../contexts/AuthContext';
import { isEventPassed } from './Events';

import {
  useEventById,
  useRegisterEvent,
  useCancelRegistration
} from '../../hooks/useEvents';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuthContext();

  const { data: event, isLoading, isError } = useEventById(id);
  const registerMutation = useRegisterEvent(id);
  const cancelMutation = useCancelRegistration(id);

  const isRegistered = event?.is_registered;

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <Skeleton className="h-9 w-32" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4 animate-pulse" />
            <Skeleton className="h-[360px] w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error 
  if (isError || !event) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Button onClick={() => navigate('/events')} className="cursor-pointer">Return to Events</Button>
      </div>
    );
  }

  const handleRegister = () => {
    if (!isAuthenticated) {
      openAuthModal("Sign in to your Voche account to register for events.");
      return;
    }
    if (isEventPassed(event)) {
      toast.error('Registration deadline has passed');
      return;
    }
    if (isRegistered) {
      cancelMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link Copied', {
      description: 'Event link copied to clipboard.'
    });
  };

  const handleAddToCalendar = () => {
    if (!isAuthenticated) {
      openAuthModal("Sign in to your Voche account to add events to your calendar.");
      return;
    }
    toast.success('Added to Calendar', {
      description: 'Event has been added to your calendar.'
    });
  };

  const locationText =
    event.location || (event.type === 'webinar' ? 'Online' : 'Global');

  const distanceText = event.timezone ?? 'Online';

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate('/events')}
        className="mb-4 pl-0 hover:pl-2 transition-all cursor-pointer"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Events
      </Button>

      <PageHeader
        title={event.title}
        description={event.description}
        variant="green"
        badgeText={`${event.type} • ${distanceText}`}
        action={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="shadow-lg hover:scale-105 transition-transform font-bold gap-2 cursor-pointer"
              onClick={handleAddToCalendar}
            >
              <CalendarPlus size={20} />
              Add to Calendar
            </Button>

          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-border/60 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building className="text-accent-color" />
              Event Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-100/90 to-orange-200/40 dark:from-orange-950/40 dark:to-orange-900/20 border border-orange-200/80 dark:border-orange-900/30 transition-all hover:shadow-sm hover:from-orange-100 dark:hover:from-orange-950/50">
                  <Calendar className="text-orange-700 dark:text-orange-400 mt-0.5 shrink-0" size={22} />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Date</h4>
                    <p className="text-zinc-800 dark:text-zinc-300 text-sm font-semibold mt-0.5">
                      {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-100/90 to-blue-200/40 dark:from-blue-950/40 dark:to-blue-900/20 border border-blue-200/80 dark:border-blue-900/30 transition-all hover:shadow-sm hover:from-blue-100 dark:hover:from-blue-950/50">
                  <Clock className="text-blue-700 dark:text-blue-400 mt-0.5 shrink-0" size={22} />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Time</h4>
                    <p className="text-zinc-800 dark:text-zinc-300 text-sm font-semibold mt-0.5">
                      {event.event_time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-green-100/90 to-green-200/40 dark:from-green-950/40 dark:to-green-900/20 border border-green-200/80 dark:border-green-900/30 transition-all hover:shadow-sm hover:from-green-100 dark:hover:from-green-950/50">
                  <MapPin className="text-green-700 dark:text-green-400 mt-0.5 shrink-0" size={22} />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Location</h4>
                    <p className="text-zinc-800 dark:text-zinc-300 text-sm font-semibold mt-0.5">{locationText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-100/90 to-purple-200/40 dark:from-purple-950/40 dark:to-purple-900/20 border border-purple-200/80 dark:border-purple-900/30 transition-all hover:shadow-sm hover:from-purple-100 dark:hover:from-purple-950/50">
                  <Users className="text-purple-700 dark:text-purple-400 mt-0.5 shrink-0" size={22} />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Organizer</h4>
                    <p className="text-zinc-800 dark:text-zinc-300 text-sm font-semibold mt-0.5">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {event.tags?.map(tag => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 border-border/60 shadow-sm sticky top-24">
            <h3 className="font-bold mb-4">Registration Status</h3>

            {isRegistered ? (
              <div className="text-center p-5 bg-green-500/10 dark:bg-green-500/15 border border-green-500/20 rounded-xl mb-4 text-green-700 dark:text-green-400">
                <CheckCircle2 className="mx-auto mb-2 text-green-600 dark:text-green-400 animate-bounce" size={28} />
                <p className="text-sm font-bold">
                  You are registered
                </p>
                <p className="text-xs opacity-80 mt-1">
                  We look forward to seeing you there!
                </p>
              </div>
            ) : isEventPassed(event) ? (
              <Button className="w-full mb-4 cursor-pointer text-white bg-zinc-400 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-700 font-bold py-6 text-base rounded-xl" disabled>
                Event Passed
              </Button>
            ) : (
              <Button 
                className="w-full mb-4 cursor-pointer bg-gradient-to-r from-primary to-teal-color hover:opacity-90 font-bold transition-all shadow-md py-6 text-base rounded-xl" 
                onClick={handleRegister}
              >
                Register Now
              </Button>
            )}

            <div className="space-y-3">
              <Button variant="outline" className="w-full cursor-pointer gap-2" onClick={handleShare}>
                <Share2 size={16} /> Share
              </Button>

              {event.type === 'webinar' && (
                <Button variant="outline" className="w-full cursor-pointer gap-2">
                  <Video size={16} /> Test Video Access
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}