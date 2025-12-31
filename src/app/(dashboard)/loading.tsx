import { LoadingSpinner } from "@/components/ui/spinner";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <LoadingSpinner size="md" text="Loading dashboard..." />
    </div>
  );
}
