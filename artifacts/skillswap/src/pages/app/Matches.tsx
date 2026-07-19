import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { HeartHandshake, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { api } from "@/lib/api";
import type { Match } from "@/mock/data";

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.matches
      .list()
      .then((data) => setMatches(data.matches))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Top Matches</h1>
          <p className="text-muted-foreground mt-1">
            Users whose teaching and learning goals align with yours.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading matches...</p>
      )}

      {!loading && matches.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No matches yet. Add skills to your profile to get matched with other users.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0 sm:flex">
              <div className="bg-gradient-to-b from-primary to-secondary p-6 text-white flex flex-col items-center justify-center sm:w-48 shrink-0 text-center relative overflow-hidden">
                <HeartHandshake className="w-10 h-10 mb-3 opacity-80" />
                <div className="text-5xl font-extrabold tracking-tighter mb-1">
                  {match.compatibilityScore}%
                </div>
                <div className="text-sm font-medium text-white/80 uppercase tracking-widest">
                  Match
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        className={`h-14 w-14 ${match.user.avatarColor} ring-4 ring-background shadow-sm`}
                      >
                        <AvatarFallback className="text-white text-lg bg-transparent">
                          {match.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-xl">{match.user.name}</h3>
                          {match.user.verified && (
                            <CheckCircle2 className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Rating {match.user.rating.toFixed(1)} • {match.user.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                    {match.compatibilityScore > 70 && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm hidden sm:flex items-center">
                        <Zap className="w-3 h-3 mr-1" /> Highly Compatible
                      </Badge>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/30 p-4 rounded-xl border border-muted">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        You Teach → They Learn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.theyWant.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl border border-muted">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        They Teach → You Learn
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.theyTeach.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:justify-end border-t pt-4">
                  <Link href={`/profile/${match.user.id}`}>
                    <Button variant="ghost" className="w-full sm:w-auto">
                      View Profile
                    </Button>
                  </Link>
                  <Link href={`/swap-request?to=${match.user.id}`}>
                    <Button className="w-full sm:w-auto">
                      Send Swap Request <ChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
