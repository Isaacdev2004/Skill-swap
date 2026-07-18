import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { USERS, CURRENT_USER, MOCK_REVIEWS } from "@/mock/data";
import { MapPin, Star, CalendarDays, Award, MessageCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const [match, params] = useRoute("/profile/:id");
  const userId = match && params?.id ? params.id : CURRENT_USER.id;
  const user = USERS.find(u => u.id === userId) || CURRENT_USER;
  const isMe = user.id === CURRENT_USER.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Profile Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-secondary/80 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] mix-blend-overlay opacity-20 bg-cover"></div>
        </div>
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-4">
            <Avatar className={`w-24 h-24 sm:w-32 sm:h-32 border-4 border-background ${user.avatarColor} shadow-lg`}>
              <AvatarFallback className="text-white text-3xl sm:text-4xl bg-transparent">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  {user.name}
                  {user.verified && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
                </h1>
                <p className="text-muted-foreground font-medium">{user.email}</p>
              </div>
              <div className="flex gap-3">
                {!isMe ? (
                  <>
                    <Link href={`/chat/${user.id}`}>
                      <Button variant="outline"><MessageCircle className="w-4 h-4 mr-2" /> Message</Button>
                    </Link>
                    <Link href={`/swap-request?to=${user.id}`}>
                      <Button>Request Swap</Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/settings">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">About</h3>
                <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Speaks: {user.languages.join(", ")}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" /> Joined {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-5 rounded-xl border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Stats</h3>
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-bold leading-none">{user.rating.toFixed(1)}</span>
                <span className="text-muted-foreground mb-1">avg rating</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">From {user.reviewCount} total reviews</p>
              
              {user.badges.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map(b => (
                      <Badge key={b.id} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <Award className="w-3 h-3 mr-1" /> {b.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-primary">Teaches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.skillsTeach.map(skill => (
                  <div key={skill.id} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <div>
                      <h4 className="font-semibold">{skill.name}</h4>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                    <Badge variant="outline">{skill.level}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">Wants to Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.skillsLearn.map(skill => (
                  <div key={skill.id} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                    <div>
                      <h4 className="font-semibold">{skill.name}</h4>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">{skill.level}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-muted/50 rounded-lg border flex-1 text-center">
                  <span className="block text-xs font-medium uppercase text-muted-foreground mb-1">Days</span>
                  <span className="font-semibold">{user.availability.days.join(", ")}</span>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border flex-1 text-center">
                  <span className="block text-xs font-medium uppercase text-muted-foreground mb-1">Preferred Time</span>
                  <span className="font-semibold">{user.availability.timeSlot}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {isMe ? (
                <div className="space-y-6">
                  {MOCK_REVIEWS.map(review => (
                    <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className={`w-8 h-8 ${review.reviewer.avatarColor}`}>
                          <AvatarFallback className="text-xs text-white bg-transparent">{review.reviewer.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium text-sm">{review.reviewer.name}</h5>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-amber-500 text-amber-500' : 'fill-muted text-muted'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Reviews are only visible on your own profile in this demo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
