import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_REVIEWS, CURRENT_USER } from "@/mock/data";
import { Star, ThumbsUp } from "lucide-react";

export default function Ratings() {
  const avgRating = CURRENT_USER.rating;
  const totalReviews = CURRENT_USER.reviewCount;
  
  // Mock distribution
  const distribution = [
    { stars: 5, pct: 85 },
    { stars: 4, pct: 10 },
    { stars: 3, pct: 5 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h1>
        <p className="text-muted-foreground mt-1">See what others say about learning from you.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-primary text-primary-foreground border-0">
          <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
            <h3 className="font-medium opacity-90 uppercase tracking-widest text-xs mb-2">Average Rating</h3>
            <div className="text-6xl font-extrabold mb-2">{avgRating.toFixed(1)}</div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-5 h-5 ${i <= Math.round(avgRating) ? 'fill-current' : 'fill-primary-foreground/20 text-primary-foreground/20'}`} />
              ))}
            </div>
            <p className="text-sm opacity-80">Based on {totalReviews} reviews</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {distribution.map(row => (
                <div key={row.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12 shrink-0">
                    <span className="font-medium text-sm">{row.stars}</span>
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm text-muted-foreground shrink-0">{row.pct}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="font-semibold text-xl mt-10 mb-4">Recent Reviews</h3>
      <div className="space-y-4">
        {MOCK_REVIEWS.map(review => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-6 sm:flex gap-6">
              <div className="flex flex-col items-center sm:w-32 shrink-0 mb-4 sm:mb-0 border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 pr-0 sm:pr-6 border-border/50">
                <Avatar className={`w-12 h-12 mb-2 ${review.reviewer.avatarColor}`}>
                  <AvatarFallback className="text-white bg-transparent">{review.reviewer.initials}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-semibold text-center">{review.reviewer.name}</div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-amber-500 text-amber-500' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  {review.recommend && (
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                      <ThumbsUp className="w-3 h-3" /> Recommends
                    </div>
                  )}
                </div>
                <p className="text-foreground leading-relaxed">{review.comment}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
