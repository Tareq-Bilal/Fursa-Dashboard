import { LoadingSpinner } from "@/components/ui/spinner";

export default function ProjectsLoading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <LoadingSpinner size="xl" text="Loading projects..." />
    </div>
  );
}
