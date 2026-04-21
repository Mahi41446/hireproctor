import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronLeft,
  Mic,
  Monitor,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";

const DATA_ITEMS = [
  {
    icon: Camera,
    title: "Camera Snapshots",
    desc: "A still image is captured every 10 seconds to verify your identity and presence throughout the exam.",
  },
  {
    icon: Mic,
    title: "Microphone Audio Levels",
    desc: "Background noise is analyzed every 5 seconds. Audio content is never recorded — only volume levels are checked.",
  },
  {
    icon: Monitor,
    title: "Tab & Window Activity",
    desc: "The browser tab focus state is monitored. Switching away from the exam window twice will automatically submit your exam.",
  },
];

function ConsentPageContent() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { examId?: string };
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [micError, setMicError] = useState("");

  const examId = search?.examId ?? "";

  const handleGrantCamera = async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      for (const t of stream.getTracks()) t.stop();
      setCameraGranted(true);
    } catch {
      setCameraError(
        "Camera access denied. Please allow camera in browser settings.",
      );
    }
  };

  const handleGrantMic = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      for (const t of stream.getTracks()) t.stop();
      setMicGranted(true);
    } catch {
      setMicError(
        "Microphone access denied. Please allow microphone in browser settings.",
      );
    }
  };

  const canProceed = cameraGranted && micGranted && agreed;

  const handleStart = () => {
    if (!canProceed || !examId) return;
    navigate({
      to: "/exam/$sessionId",
      params: { sessionId: `new-${examId}` },
    });
  };

  const handleDecline = () => {
    navigate({ to: "/" });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-foreground mb-2">
            Enable Proctoring to Continue
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            To maintain exam integrity, this session requires camera and
            microphone access. Please review what is collected and grant the
            required permissions below.
          </p>
        </div>

        {/* Data collection notice */}
        <Card
          className="mb-6 border-border"
          data-ocid="consent.data_notice_card"
        >
          <CardContent className="pt-5 pb-5 space-y-4">
            <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-3">
              What data is collected
            </h2>
            {DATA_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex gap-2 items-start p-3 rounded-lg bg-accent/10 border border-accent/30 mt-2">
              <AlertTriangle className="w-4 h-4 text-accent-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">
                Camera snapshots and proctoring logs are retained for up to 7
                days and then automatically deleted. They are only accessible to
                authorized hiring administrators.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <div className="space-y-3 mb-6">
          {/* Camera */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
            data-ocid="consent.camera_permission_card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Camera className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Camera Access
                </p>
                <p className="text-xs text-muted-foreground">
                  Required for identity verification
                </p>
                {cameraError && (
                  <p className="text-xs text-destructive mt-1">{cameraError}</p>
                )}
              </div>
            </div>
            {cameraGranted ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <CheckCircle className="w-4 h-4" />
                Granted
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="border-accent/60 text-accent-foreground hover:bg-accent/10 text-xs gap-1.5"
                onClick={handleGrantCamera}
                data-ocid="consent.grant_camera_button"
              >
                <AlertTriangle className="w-3 h-3" />
                Grant Access
              </Button>
            )}
          </div>

          {/* Microphone */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
            data-ocid="consent.mic_permission_card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Mic className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Microphone Access
                </p>
                <p className="text-xs text-muted-foreground">
                  Required for noise level monitoring
                </p>
                {micError && (
                  <p className="text-xs text-destructive mt-1">{micError}</p>
                )}
              </div>
            </div>
            {micGranted ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <CheckCircle className="w-4 h-4" />
                Granted
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="border-accent/60 text-accent-foreground hover:bg-accent/10 text-xs gap-1.5"
                onClick={handleGrantMic}
                data-ocid="consent.grant_mic_button"
              >
                <AlertTriangle className="w-3 h-3" />
                Grant Access
              </Button>
            )}
          </div>
        </div>

        {/* Consent checkbox */}
        <div className="flex items-start gap-3 mb-8 p-4 rounded-xl bg-muted/40 border border-border">
          <Checkbox
            id="consent-agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
            data-ocid="consent.agree_checkbox"
          />
          <label
            htmlFor="consent-agree"
            className="text-sm text-foreground leading-relaxed cursor-pointer select-none"
          >
            I understand and consent to my camera, microphone activity, and
            tab-switch behaviour being monitored and logged during this exam for
            the purpose of academic integrity.
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDecline}
            data-ocid="consent.decline_button"
          >
            <ChevronLeft className="w-4 h-4" />
            Decline &amp; Go Back
          </Button>
          <Button
            className="flex-1 gap-2"
            disabled={!canProceed}
            onClick={handleStart}
            data-ocid="consent.start_exam_button"
          >
            <Shield className="w-4 h-4" />I Agree, Start Exam
          </Button>
        </div>

        {!canProceed && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {!cameraGranted || !micGranted
              ? "Grant both camera and microphone access to continue."
              : "Please check the consent box to continue."}
          </p>
        )}
      </div>
    </Layout>
  );
}

export default function ConsentPage() {
  return (
    <ProtectedRoute>
      <ConsentPageContent />
    </ProtectedRoute>
  );
}
