import { useInterval } from "@/hooks/use-interval";
import { useState } from "react";

function useStateRefresh(delay: number | null) {
  const [, setState] = useState<number>(0);

  useInterval(() => setState((state) => state + 1), delay);
}

export { useStateRefresh };
