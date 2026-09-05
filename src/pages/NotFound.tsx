import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-(--color-cream) px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-(--color-terracotta-100) text-(--color-terracotta-600)">
        <Compass className="size-7" />
      </span>
      <div>
        <h1 className="font-display text-xl font-bold text-(--color-ink)">Page not found</h1>
        <p className="mt-1 text-sm text-(--color-ink-faint)">Let's get you back to the dashboard.</p>
      </div>
      <Button onClick={() => navigate("/home")}>Go to Home</Button>
    </div>
  );
}
