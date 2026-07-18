import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, ArrowRight, UserCheck, Repeat } from "lucide-react";
import { Link } from "wouter";
import { MOCK_SESSIONS, MOCK_NOTIFICATIONS, MOCK_MATCHES } from "@/mock/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { currentUser } = useAuthStore();
  
  if (!currentUser) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your skill swaps today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/marketplace">
            <Button>Find New Skills</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_SESSIONS.filter(s => s.status === 'upcoming').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Next session in 2 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">From 1 conversation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            <Repeat className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Needs your response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Rating</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser.rating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">From {currentUser.reviewCount} reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
            <Link href="/scheduler" className="text-sm text-primary hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_SESSIONS.filter(s => s.status === 'upcoming').map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                  <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-md p-2 min-w-16">
                    <span className="text-xs font-semibold uppercase">{new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-none">{new Date(session.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{session.skill.name} with {session.withUser.name}</h4>
                    <p className="text-sm text-muted-foreground">{session.time} • {session.duration} mins</p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              ))}
              {MOCK_SESSIONS.filter(s => s.status === 'upcoming').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming sessions</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Matches</CardTitle>
            <Link href="/matches" className="text-sm text-primary hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_MATCHES.map((match) => (
                <div key={match.id} className="flex items-center gap-4">
                  <Avatar className={match.user.avatarColor}>
                    <AvatarFallback className="text-white bg-transparent">{match.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold truncate">{match.user.name}</h4>
                      <Badge variant="success" className="ml-2">{match.compatibilityScore}% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      Wants: {match.theyWant.map(s => s.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_NOTIFICATIONS.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-medium text-sm">{notif.title}</h4>
                    <p className="text-sm text-muted-foreground">{notif.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
