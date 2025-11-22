import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ComponentProps, ElementRef, forwardRef, RefObject } from "react";
import styles from "./player-dropdown.module.css";

const PlayerDropdownMenu = DropdownMenu.Root;

const PlayerDropdownMenuTrigger = DropdownMenu.Trigger;

const PlayerDropdownMenuPortal = DropdownMenu.Portal;

const PlayerDropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenu.Content>,
  ComponentProps<typeof DropdownMenu.Content>
>(({ sideOffset = 4, className, ...props }, ref) => {
  return (
    <DropdownMenu.Content
      ref={ref as RefObject<HTMLDivElement>}
      sideOffset={sideOffset}
      className={[styles.dropdownMenuContent, className].filter(Boolean).join(" ")}
      onCloseAutoFocus={(event: Event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
});

PlayerDropdownMenuContent.displayName = "PlayerDropdownMenuContent";

const PlayerDropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenu.Item>,
  ComponentProps<typeof DropdownMenu.Item>
>(({ className, ...props }, ref) => {
  return (
    <DropdownMenu.Item
      ref={ref as RefObject<HTMLDivElement>}
      className={[styles.dropdownMenuItem, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

PlayerDropdownMenuItem.displayName = "PlayerDropdownMenuItem";

export {
  PlayerDropdownMenu,
  PlayerDropdownMenuContent,
  PlayerDropdownMenuItem,
  PlayerDropdownMenuPortal,
  PlayerDropdownMenuTrigger,
};
