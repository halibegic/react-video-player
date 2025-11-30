import * as Popover from "@radix-ui/react-popover";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  ComponentProps,
  ElementRef,
  forwardRef,
  HTMLAttributes,
  RefObject,
} from "react";
import styles from "./player-menu.module.css";

const PlayerMenu = Popover.Root;

const PlayerMenuTrigger = Popover.Trigger;

const PlayerMenuPortal = Popover.Portal;

const PlayerMenuContent = forwardRef<
  ElementRef<typeof Popover.Content>,
  ComponentProps<typeof Popover.Content>
>(({ sideOffset = 4, className, children, ...props }, ref) => {
  return (
    <Popover.Content
      ref={ref as RefObject<HTMLDivElement>}
      sideOffset={sideOffset}
      className={[styles.dropdownMenuContent, className]
        .filter(Boolean)
        .join(" ")}
      onOpenAutoFocus={(event: Event) => {
        event.preventDefault();
      }}
      onCloseAutoFocus={(event: Event) => {
        event.preventDefault();
      }}
      {...props}
    >
      <ScrollArea.Root
        className={styles.scrollAreaRoot}
        type="always"
        scrollHideDelay={0}
      >
        <ScrollArea.Viewport className={styles.scrollAreaViewport}>
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className={styles.scrollAreaScrollbar}
          orientation="vertical"
        >
          <ScrollArea.Thumb className={styles.scrollAreaThumb} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Popover.Content>
  );
});

PlayerMenuContent.displayName = "PlayerMenuContent";

const PlayerMenuItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, onClick, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <Popover.Close asChild>
      <div
        ref={ref}
        className={[styles.dropdownMenuItem, className]
          .filter(Boolean)
          .join(" ")}
        role="menuitem"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </Popover.Close>
  );
});

PlayerMenuItem.displayName = "PlayerMenuItem";

export {
  PlayerMenu,
  PlayerMenuContent,
  PlayerMenuItem,
  PlayerMenuPortal,
  PlayerMenuTrigger,
};
