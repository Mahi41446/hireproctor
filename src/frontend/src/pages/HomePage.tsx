import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  LayoutDashboard,
  Play,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import type { ExamPublic } from "../types";
import { ExamStatus } from "../types";

function HomePageContent() {
  const { user, isAdmin, profile } = useAuth();
  const { actor, isFetching } = useBackend();
  const [exams, setExams] = useState<ExamPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || isFetching || !user) return;
    actor
      .listExams(user.sessionToken)
      .then((list) => setExams(list))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, [actor, isFetching, user]);

  const activeExams = exams.filter((e) => e.status === ExamStatus.active);
  const draftExams = exams.filter((e) => e.status === ExamStatus.draft);

  const statusBadge = (status: ExamStatus) => {
    switch (status) {
      case ExamStatus.active:
        return (
          <Badge className="bg-primary/10 text-primary border-primary/30">
            Active
          </Badge>
        );
      case ExamStatus.draft:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Draft
          </Badge>
        );
      case ExamStatus.closed:
        return <Badge variant="secondary">Closed</Badge>;
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome banner */}
        <div className="mb-8 p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground leading-tight">
              Welcome back{profile?.fullname ? `, ${profile.fullname}` : ""}
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {isAdmin
                ? "You have admin access. Manage exams, review candidates and configure assessments."
                : "Your proctored assessment portal. Start your exam when you're ready."}
            </p>
          </div>
          {isAdmin && (
            <Button
              asChild
              className="ml-auto shrink-0"
              data-ocid="home.admin_panel_button"
            >
              <Link to="/admin">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          )}
        </div>

        {/* Content area */}
        {loading ? (
          <div className="space-y-4" data-ocid="home.loading_state">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : isAdmin ? (
          /* Admin view */
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Active Exams
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({activeExams.length})
                </span>
              </h2>
              {activeExams.length === 0 ? (
                <Card
                  className="border-dashed"
                  data-ocid="home.active_exams.empty_state"
                >
                  <CardContent className="py-10 text-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No active exams. Go to Admin to create and activate one.
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link to="/admin">Go to Admin Panel</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeExams.map((exam, i) => (
                    <Card
                      key={exam.id.toString()}
                      className="hover:border-primary/40 transition-smooth"
                      data-ocid={`home.active_exam.item.${i + 1}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-display">
                            {exam.roleTitle}
                          </CardTitle>
                          {statusBadge(exam.status)}
                        </div>
                        <CardDescription className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exam.timerMinutes.toString()} min
                          </span>
                          <span>
                            Pass: {exam.passThresholdPercent.toString()}%
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <Link to="/admin">
                            View Details
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {draftExams.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  Draft Exams
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({draftExams.length})
                  </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {draftExams.map((exam, i) => (
                    <Card
                      key={exam.id.toString()}
                      className="opacity-80"
                      data-ocid={`home.draft_exam.item.${i + 1}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-display">
                            {exam.roleTitle}
                          </CardTitle>
                          {statusBadge(exam.status)}
                        </div>
                        <CardDescription className="text-xs flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {exam.timerMinutes.toString()} min
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <Link to="/admin">Manage in Admin</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Candidate view */
          <div className="space-y-6">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Available Exams
            </h2>
            {activeExams.length === 0 ? (
              <Card
                className="border-dashed"
                data-ocid="home.candidate_exams.empty_state"
              >
                <CardContent className="py-16 text-center">
                  <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-display font-medium text-foreground mb-2">
                    No exams available
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    There are no active exams at this time. Please check back
                    later or contact your hiring manager.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeExams.map((exam, i) => (
                  <Card
                    key={exam.id.toString()}
                    className="hover:border-primary/40 hover:shadow-md transition-smooth"
                    data-ocid={`home.exam.item.${i + 1}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-display">
                          {exam.roleTitle}
                        </CardTitle>
                        {statusBadge(exam.status)}
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {exam.timerMinutes.toString()} minutes
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          Pass: {exam.passThresholdPercent.toString()}%
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Camera and microphone monitoring will be active. Make
                        sure you are in a quiet, well-lit environment.
                      </p>
                      <Button
                        asChild
                        className="w-full gap-2"
                        data-ocid={`home.start_exam_button.${i + 1}`}
                      >
                        <Link
                          to="/consent"
                          search={{ examId: exam.id.toString() }}
                        >
                          <Play className="w-4 h-4" />
                          Start Exam
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}
