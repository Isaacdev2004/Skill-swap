import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USERS, CURRENT_USER, MOCK_REVIEWS } from "@/mock/data";
import { Star, CalendarDays, Clock, MessageCircle, CheckCircle2, Award, Share2, Edit2 } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [match, params] = useRoute("/profile/:id");
  const userId = match && params?.id ? params.id : CURRENT_USER.id;
  const user = USERS.find(u => u.id === userId) || CURRENT_USER;
  const isMe = user.id === CURRENT_USER.id;
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">

        {/* ── Left column: info panel ── */}
        <div className="space-y-4">
          <Card className="border shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <Avatar className={cn("w-24 h-24 mb-4 text-white text-2xl font-bold", user.avatarColor)}>
                <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>

              {/* Name + verified */}
              <h1 className="text-xl font-bold flex items-center gap-1.5 justify-center">
                {user.name}
                {user.verified && <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={cn("w-4 h-4", i <= Math.round(user.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                  ))}
                </div>
                <span className="text-sm font-semibold">{user.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({user.reviewCount})</span>
              </div>

              {/* Divider */}
              <div className="w-full border-t my-5" />

              {/* Bio */}
              <p className="text-sm text-muted-foreground leading-relaxed text-left w-full">
                {user.bio}
              </p>

              {/* Languages */}
              <div className="w-full mt-4 space-y-2 text-sm text-left">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Languages: <span className="text-foreground font-medium">{user.languages.join(", ")}</span></span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Available: <span className="text-foreground font-medium">{user.availability.days.join(", ")}</span></span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Time: <span className="text-foreground font-medium">{user.availability.timeSlot}</span></span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Joined: <span className="text-foreground font-medium">
                    {new Date(user.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                  </span></span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full border-t my-5" />

              {/* Badges */}
              {user.badges.length > 0 && (
                <div className="w-full space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-left">Badges</p>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map(b => (
                      <Badge key={b.id} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                        <Award className="w-3 h-3" /> {b.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="w-full border-t my-5" />

              {/* Actions */}
              {isMe ? (
                <div className="w-full flex gap-2">
                  <Link href="/settings" className="flex-1">
                    <Button variant="outline" className="w-full gap-1.5">
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2">
                  <Link href={`/swap-request?to=${user.id}`}>
                    <Button className="w-full">Request Swap</Button>
                  </Link>
                  <Link href={`/chat/${user.id}`}>
                    <Button variant="outline" className="w-full gap-1.5">
                      <MessageCircle className="w-4 h-4" /> Send Message
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right column: tabs ── */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            {/* About */}
            <TabsContent value="about" className="space-y-4">
              <Card className="border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About Me</h3>
                    <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
                  </div>
                  <div className="border-t pt-4 grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Languages</p>
                      <p className="font-medium">{user.languages.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Availability</p>
                      <p className="font-medium">{user.availability.days.join(", ")} · {user.availability.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Member Since</p>
                      <p className="font-medium">{new Date(user.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Rating</p>
                      <p className="font-medium">{user.rating.toFixed(1)} / 5.0 from {user.reviewCount} reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="space-y-4">
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-primary">Skills I Can Teach</h3>
                  <div className="space-y-3">
                    {user.skillsTeach.map(skill => (
                      <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{skill.category}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-emerald-600 dark:text-emerald-400">Skills I Want to Learn</h3>
                  <div className="space-y-3">
                    {user.skillsLearn.map(skill => (
                      <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{skill.category}</p>
                        </div>
                        <Badge variant="outline" className="text-xs text-muted-foreground">{skill.level}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews">
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  {/* Aggregate */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{user.rating.toFixed(1)}</div>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={cn("w-4 h-4", i <= Math.round(user.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{user.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(n => {
                        const pct = n === 5 ? 65 : n === 4 ? 20 : n === 3 ? 10 : n === 2 ? 3 : 2;
                        return (
                          <div key={n} className="flex items-center gap-2 text-xs">
                            <span className="w-2 text-muted-foreground">{n}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-muted-foreground text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review list */}
                  {isMe ? (
                    <div className="space-y-6">
                      {MOCK_REVIEWS.map(review => (
                        <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className={cn("w-9 h-9", review.reviewer.avatarColor)}>
                              <AvatarFallback className="text-xs text-white bg-transparent">{review.reviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{review.reviewer.name}</p>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                          {review.recommend && (
                            <Badge variant="secondary" className="mt-2 text-xs bg-emerald-100 text-emerald-700">
                              Recommends
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No reviews to display.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Badges */}
            <TabsContent value="badges">
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Achievements & Badges</h3>
                  {user.badges.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {user.badges.map(b => (
                        <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl border bg-amber-50 dark:bg-amber-900/10">
                          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Award className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{b.name}</p>
                            <p className="text-xs text-muted-foreground">Earned for excellence</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Award className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No badges yet. Keep teaching and learning!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
