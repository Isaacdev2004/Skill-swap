import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER, USERS } from "@/mock/data";
import { Send, ArrowRightLeft } from "lucide-react";

export default function SwapRequest() {
  const [search] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  // wouter doesn't parse query strings automatically in useLocation, so we use window.location
  const toId = urlParams.get('to') || "2"; // Default to Sarah for demo
  
  const targetUser = USERS.find(u => u.id === toId) || USERS[1];
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 ml-1" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
          <p className="text-muted-foreground">We'll notify {targetUser.name} about your swap proposal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Propose a Skill Swap</h1>
        <p className="text-muted-foreground mt-1">Structure how you and {targetUser.name.split(' ')[0]} will trade knowledge.</p>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className={`h-20 w-20 ${CURRENT_USER.avatarColor} mb-3`}>
                <AvatarFallback className="text-white text-2xl bg-transparent">{CURRENT_USER.initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{CURRENT_USER.name}</h3>
              <p className="text-xs text-muted-foreground">You</p>
            </div>
            
            <div className="flex flex-col items-center">
              <ArrowRightLeft className="w-8 h-8 text-muted-foreground mb-2" />
              <Badge variant="outline" className="uppercase tracking-widest text-[10px]">Swap</Badge>
            </div>

            <div className="flex flex-col items-center text-center">
              <Avatar className={`h-20 w-20 ${targetUser.avatarColor} mb-3`}>
                <AvatarFallback className="text-white text-2xl bg-transparent">{targetUser.initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{targetUser.name}</h3>
              <p className="text-xs text-muted-foreground">Partner</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center border-b pb-2">
                  <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">1</span>
                  What you will teach
                </h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Select one of your skills</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {CURRENT_USER.skillsTeach.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center border-b pb-2">
                  <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">2</span>
                  What you want to learn
                </h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Select one of their skills</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {targetUser.skillsTeach.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center border-b pb-2">
                <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">3</span>
                Logistics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Frequency</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Once</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Duration per session</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option>30 minutes</option>
                    <option selected>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center border-b pb-2">
                <span className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">4</span>
                Message
              </h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Introduce yourself and your goals</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Hi! I noticed we're a great match..."
                  defaultValue={`Hi ${targetUser.name.split(' ')[0]}! I'd love to set up a skill swap. I can help you with what you want to learn, and I'm really eager to improve my skills with your help.`}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
              <Button type="submit" size="lg">Send Proposal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Temporary Badge component inline for SwapRequest
function Badge({ className, variant = "default", children }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variant === 'outline' ? 'text-foreground' : 'bg-primary text-primary-foreground'} ${className}`}>
      {children}
    </div>
  )
}
