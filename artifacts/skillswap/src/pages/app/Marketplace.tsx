import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { USERS, SkillCategory } from "@/mock/data";
import { Search, SlidersHorizontal, Star, CheckCircle2, ChevronDown } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES: { name: SkillCategory; color: string }[] = [
  { name: "Technology", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300" },
  { name: "Creative Arts", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
  { name: "Music", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300" },
  { name: "Business", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  { name: "Languages", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" },
  { name: "Academics", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  { name: "Fitness", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" },
  { name: "Life Skills", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300" },
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">("All");

  const teachers = USERS.filter(u => u.id !== "1"); // Hide current user

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.skillsTeach.some(s => s.name.toLowerCase().includes(search.toLowerCase())) || 
                          t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.skillsTeach.some(s => s.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Find the perfect partner to trade skills with.</p>
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

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveCategory("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === "All" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.name 
                ? cat.color.replace('text-', 'text-foreground ').replace('bg-', 'border-2 border-').split(' ')[0] + ' bg-background border-2' 
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {filteredTeachers.map((teacher, i) => (
          <Card key={teacher.id} className="overflow-hidden hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-12 w-12 ${teacher.avatarColor}`}>
                      <AvatarFallback className="text-white bg-transparent">{teacher.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <Link href={`/profile/${teacher.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">{teacher.name}</h3>
                        </Link>
                        {teacher.verified && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
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
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Teaches</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.skillsTeach.map(skill => (
                        <Badge key={skill.id} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {skill.name} • {skill.level}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Wants to learn</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.skillsLearn.map(skill => (
                        <Badge key={skill.id} variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{teacher.availability.days.join(", ")}</span> • {teacher.availability.timeSlot}
                </div>
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
