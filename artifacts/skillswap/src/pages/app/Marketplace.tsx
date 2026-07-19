import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, SlidersHorizontal, Star, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { api, mapUser } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type MarketplaceTeacher = ReturnType<typeof mapUser> & {
  skillsTeach: { id: string; name: string; level: string }[];
};

export default function Marketplace() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState<MarketplaceTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.marketplace
      .browse(search || undefined)
      .then((data) => setTeachers(data.teachers))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false));
  }, [search]);

  const filteredTeachers = teachers.filter((t) => t.id !== user?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Find the perfect partner to trade skills with.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for Python, Guitar, UI Design..."
            className="pl-9 h-12 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6">
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading marketplace...</p>}

      {!loading && filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No teachers found. Try a different search term.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {filteredTeachers.map((teacher, i) => (
          <Card
            key={teacher.id}
            className="overflow-hidden hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-12 w-12 ${teacher.avatarColor}`}>
                      <AvatarFallback className="text-white bg-transparent">
                        {teacher.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <Link href={`/profile/${teacher.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                            {teacher.name}
                          </h3>
                        </Link>
                        {teacher.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
                        <span className="font-medium text-foreground">{teacher.rating}</span>
                        <span className="mx-1">({teacher.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Teaches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.skillsTeach.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {skill.name} • {skill.level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Available on SkillSwap</div>
                <Link href={`/swap-request?to=${teacher.id}`}>
                  <Button size="sm">Request Swap</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
