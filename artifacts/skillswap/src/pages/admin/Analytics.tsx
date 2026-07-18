import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform growth and usage metrics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> User Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t mt-4 bg-muted/10">
            <p className="text-muted-foreground text-sm italic">Line chart visualization placeholder</p>
          </CardContent>
        </Card>

        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Sessions per Month
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t mt-4 bg-muted/10">
            <p className="text-muted-foreground text-sm italic">Bar chart visualization placeholder</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Top Skill Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t mt-4 bg-muted/10">
            <p className="text-muted-foreground text-sm italic">Donut chart visualization placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
