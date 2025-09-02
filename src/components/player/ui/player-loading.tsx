import { useDebounce } from "@/components/hooks/use-debounce";
import { Spinner } from "@/components/ui/spinner";
import { usePlayerStore } from "@/stores/player-store";
import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

type PlayerLoadingProps = HTMLAttributes<HTMLDivElement>;

function PlayerLoading({ className, ...props }: PlayerLoadingProps) {
  const isLoading = usePlayerStore((s) => s.isLoading);
  const isVisible = useDebounce(isLoading, 50);

  return isVisible ? (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex size-full items-center justify-center",
        className
      )}
      {...props}
    >
      <Spinner className="size-10" />
    </div>
  ) : null;
}

export { PlayerLoading };
