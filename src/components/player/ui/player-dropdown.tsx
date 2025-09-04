import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { forwardRef, RefObject } from "react";
import styled from "styled-components";

const PlayerDropdownMenu = DropdownMenu.Root;

const PlayerDropdownMenuTrigger = DropdownMenu.Trigger;

const PlayerDropdownMenuPortal = DropdownMenu.Portal;

const PlayerDropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  React.ComponentProps<typeof DropdownMenu.Content>
>(({ sideOffset = 4, ...props }, ref) => {
  return (
    <DropdownMenuContent
      ref={ref as RefObject<HTMLDivElement>}
      sideOffset={sideOffset}
      onCloseAutoFocus={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
});

PlayerDropdownMenuContent.displayName = "PlayerDropdownMenuContent";

const PlayerDropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  React.ComponentProps<typeof DropdownMenu.Item>
>((props, ref) => {
  return <DropdownMenuItem ref={ref as RefObject<HTMLDivElement>} {...props} />;
});

PlayerDropdownMenuItem.displayName = "PlayerDropdownMenuItem";

const DropdownMenuContent = styled(DropdownMenu.Content).withConfig({
  shouldForwardProp: (prop) => prop !== "ref",
})`
  padding: 0.25rem;
  min-width: 8rem;
  max-height: 8rem;
  overflow-y: auto;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
  z-index: 1000;

  @media (min-width: 768px) {
    max-height: 12rem;
  }

  &[data-state="open"][data-side="top"] {
    animation-name: slideDownAndFade;
  }

  &[data-state="open"][data-side="right"] {
    animation-name: slideLeftAndFade;
  }

  &[data-state="open"][data-side="bottom"] {
    animation-name: slideUpAndFade;
  }

  &[data-state="open"][data-side="left"] {
    animation-name: slideRightAndFade;
  }

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideRightAndFade {
    from {
      opacity: 0;
      transform: translateX(-2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const DropdownMenuItem = styled(DropdownMenu.Item)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.8125rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  line-height: 1;
  user-select: none;
  outline: none;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    pointer-events: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &[data-disabled] {
    color: rgba(255, 255, 255, 0.5);
    pointer-events: none;
  }
`;

export {
  PlayerDropdownMenu,
  PlayerDropdownMenuContent,
  PlayerDropdownMenuItem,
  PlayerDropdownMenuPortal,
  PlayerDropdownMenuTrigger,
};
