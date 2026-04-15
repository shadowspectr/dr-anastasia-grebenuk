import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AdminPanel = () => {
  const { data: applications = [] } = useQuery({
    queryKey: ["admin_applications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("*, courses(title)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin_courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*").order("sort_order");
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Панель управления</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Заявки ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Заявок пока нет</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div>
                      <p className="font-medium text-sm">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.phone}</p>
                      {app.courses?.title && (
                        <p className="text-xs text-primary">{app.courses.title}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={app.status === "new" ? "default" : "secondary"}>
                        {app.status}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(app.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Курсы ({courses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Курсов пока нет</p>
            ) : (
              <div className="space-y-2">
                {courses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm">{c.title}</span>
                    <span className="text-sm text-primary font-medium">
                      {c.price ? `${Number(c.price).toLocaleString("ru-RU")} ₽` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
