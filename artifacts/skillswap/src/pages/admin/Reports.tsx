import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminReports() {
  const reports = [
    { id: "1", reporter: "Sarah Johnson", reported: "Mike Anderson", reason: "No show to session", status: "open", date: "2024-11-15" },
    { id: "2", reporter: "Emily Davis", reported: "David Lee", reason: "Inappropriate behavior", status: "open", date: "2024-11-14" },
    { id: "3", reporter: "Arjun Sharma", reported: "Jane Smith", reason: "Spam", status: "resolved", date: "2024-11-10" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Reporter</th>
                  <th className="px-6 py-4 font-medium">Reported User</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{r.reporter}</td>
                    <td className="px-6 py-4 text-destructive font-medium">{r.reported}</td>
                    <td className="px-6 py-4">{r.reason}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={r.status === 'open' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-muted text-muted-foreground'}>
                        {r.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'open' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline">Dismiss</Button>
                          <Button size="sm" variant="destructive">Resolve</Button>
                        </div>
                      )}
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
