import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_SESSIONS } from "@/mock/data";
import { Calendar as CalendarIcon, Clock, Video, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function Scheduler() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 10)); // Nov 2024
  
  // Basic mock calendar grid generation
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground mt-1">Manage your upcoming skill swaps and schedule new ones.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Schedule Session</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-xl">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                // Mock highlighting the 20th and 22nd where we have sessions
                const hasSession = day === 20 || day === 22;
                return (
                  <div 
                    key={i} 
                    className={`min-h-[100px] p-2 border-r border-b last:border-r-0 hover:bg-muted/30 transition-colors ${!day ? 'bg-muted/10' : ''}`}
                  >
                    {day && (
                      <>
                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-sm ${hasSession ? 'bg-primary text-primary-foreground font-bold' : ''}`}>
                          {day}
                        </span>
                        {hasSession && (
                          <div className="mt-1">
                            <div className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded px-1.5 py-0.5 truncate font-medium">
                              {day === 20 ? 'Guitar with Sarah' : 'React with Mike'}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming List */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg border-b pb-2">Upcoming</h3>
          
          <div className="space-y-4">
            {MOCK_SESSIONS.filter(s => s.status === 'upcoming').map(session => (
              <Card key={session.id} className="border-l-4 border-l-primary">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="bg-background">{session.skill.name}</Badge>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {session.duration} min
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Session with {session.withUser.name.split(' ')[0]}
                  </h4>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-foreground" />
                      <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-foreground" />
                      <span>{session.time} (Your local time)</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <Avatar className={`w-8 h-8 ${session.withUser.avatarColor}`}>
                      <AvatarFallback className="text-white text-xs bg-transparent">{session.withUser.initials}</AvatarFallback>
                    </Avatar>
                    
                    {session.googleMeetLink ? (
                      <a href={session.googleMeetLink} target="_blank" rel="noreferrer">
                        <Button size="sm" className="gap-2">
                          <Video className="w-4 h-4" /> Join Meet
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline">Waiting for link</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
