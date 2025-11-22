import { HTMLAttributes } from "react";
import styles from "./player-spinner.module.css";

function PlayerSpinner(props: HTMLAttributes<HTMLDivElement>) {
  return <div className={styles.spinner} {...props} />;
}

export { PlayerSpinner };
