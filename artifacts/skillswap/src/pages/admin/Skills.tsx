import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminSkills() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight">Skill Taxonomy</h1>
        <Button>Add New Skill</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Skill Name</th>
                  <th className="px-6 py-4 font-medium">Active Users</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { cat: "Technology", name: "Python", users: 1240, status: "Active" },
                  { cat: "Technology", name: "React", users: 850, status: "Active" },
                  { cat: "Music", name: "Guitar", users: 620, status: "Active" },
                  { cat: "Creative Arts", name: "Photography", users: 430, status: "Active" },
                  { cat: "Business", name: "Digital Marketing", users: 510, status: "Active" }
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-muted-foreground">{s.cat}</td>
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4">{s.users}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 border-0">{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
