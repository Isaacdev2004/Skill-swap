import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Activity, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    users: 0,
    skills: 0,
    sessions: 0,
    swapRequests: 0,
    reviews: 0,
    openReports: 0,
  });
  const [recentUsers, setRecentUsers] = useState<
    Awaited<ReturnType<typeof api.admin.users>>["users"]
  >([]);

  useEffect(() => {
    Promise.all([api.admin.stats(), api.admin.users()])
      .then(([statsData, usersData]) => {
        setStats(statsData);
        setRecentUsers(usersData.users.slice(0, 4));
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform statistics and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Swaps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.swapRequests}</div>
            <p className="text-xs text-muted-foreground">Total swap requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessions}</div>
            <p className="text-xs text-muted-foreground">Scheduled sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.openReports}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(u.joinedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">No users found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-sm mb-1">Skills catalog</h4>
              <p className="text-xs text-muted-foreground">{stats.skills} skills available</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-sm mb-1">Reviews</h4>
              <p className="text-xs text-muted-foreground">{stats.reviews} reviews submitted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
