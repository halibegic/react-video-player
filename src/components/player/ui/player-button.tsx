import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./player-button.module.css";

type PlayerButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  shape?: "square" | "circle";
};

const PlayerButton = forwardRef<HTMLButtonElement, PlayerButtonProps>(
  ({ shape = "circle", className, ...props }, ref) => {
    const shapeClass = shape === "circle" ? styles.playerButtonCircle : "";
    const combinedClassName = [styles.playerButton, shapeClass, className]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={combinedClassName} {...props} />;
  }
);

PlayerButton.displayName = "PlayerButton";

export { PlayerButton };
export type { PlayerButtonProps };
