import { useNotificationsStore } from "@/store/notificationsStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, Star, Bell, CheckCircle2 } from "lucide-react";

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationsStore();

  const getIcon = (type: string) => {
    switch(type) {
      case 'match': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'session': return <Calendar className="w-5 h-5 text-emerald-500" />;
      case 'review': return <Star className="w-5 h-5 text-amber-500" />;
      case 'request': return <Bell className="w-5 h-5 text-primary" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 sm:p-6 flex gap-4 transition-colors hover:bg-muted/30 cursor-pointer ${!notif.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-background border shadow-sm`}>
                      {getIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-base ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.body}</p>
                    
                    {!notif.isRead && (
                      <div className="mt-3">
                        <Badge variant="default" className="text-[10px] uppercase">New</Badge>
                      </div>
                    )}
                  </div>
                  {!notif.isRead && (
                    <div className="shrink-0 flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
