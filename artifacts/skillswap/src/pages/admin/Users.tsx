import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Awaited<ReturnType<typeof api.admin.users>>["users"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.admin
      .users(search || undefined)
      .then((data) => setUsers(data.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b flex gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          {loading && (
            <p className="p-6 text-sm text-muted-foreground">Loading users...</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className={`w-8 h-8 ${user.avatarColor}`}>
                          <AvatarFallback className="text-white text-xs bg-transparent">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1">
                            {user.name}
                            {user.verified && (
                              <CheckCircle2 className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                          <div className="text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                            : "bg-muted text-muted-foreground border-0"
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{user.rating.toFixed(1)}</span> (
                      {user.reviewCount})
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={user.isAdmin ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && users.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground">No users found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
