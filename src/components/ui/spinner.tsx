import { cn } from "@/utils/cn";
import { LoaderCircleIcon, type LucideProps } from "lucide-react";

function Spinner({ className, ...props }: LucideProps) {
  return (
    <LoaderCircleIcon className={cn("animate-spin", className)} {...props} />
  );
}

export { Spinner };
