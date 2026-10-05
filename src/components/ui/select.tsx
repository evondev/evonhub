"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, onPointerDown, onKeyDown, onBlur, ...props }, ref) => {
  // Chọn bằng chuột xong Radix trả focus về nút, Chrome vẫn coi đó là
  // :focus-visible nên viền focus ở lại sau khi danh sách đã đóng. Nhớ lần cuối
  // mở bằng chuột hay phím, chỉ hiện viền focus khi dùng phím.
  const [isPointerInput, setIsPointerInput] = React.useState(false);

  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    setIsPointerInput(true);
    onPointerDown?.(event);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    setIsPointerInput(false);
    onKeyDown?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLButtonElement>) {
    const nextFocusTarget = event.relatedTarget as HTMLElement | null;
    const isMovingIntoList = Boolean(
      nextFocusTarget?.closest('[role="listbox"]')
    );

    if (!isMovingIntoList) setIsPointerInput(false);
    onBlur?.(event);
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-input={isPointerInput ? "pointer" : "keyboard"}
      className={cn(
        "group flex h-11 md:h-10 w-full items-center justify-between gap-2 rounded-xl border border-border-strong bg-surface px-3 py-2 text-left text-sm font-medium text-foreground outline-none transition-colors [&>span]:line-clamp-1",
        "data-[placeholder]:text-muted dark:data-[placeholder]:text-muted",
        "data-[input=keyboard]:focus-visible:border-primary data-[input=keyboard]:focus-visible:ring-2 data-[input=keyboard]:focus-visible:ring-primary/15",
        "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 text-muted transition-transform duration-150 group-data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-center py-1 text-muted",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-center py-1 text-muted",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      position = "popper",
      sideOffset = 8,
      collisionPadding = 8,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-[min(19rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-popover",
          "origin-[var(--radix-select-content-transform-origin)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-150 data-[state=open]:ease-out",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100 data-[state=closed]:ease-in",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
          position === "popper" && "w-[var(--radix-select-trigger-width)]",
          className
        )}
        position={position}
        sideOffset={position === "popper" ? sideOffset : undefined}
        collisionPadding={collisionPadding}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-xs font-medium text-muted", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex h-10 w-full cursor-pointer select-none items-center rounded-[10px] pl-3 pr-9 text-sm text-foreground outline-none",
      "data-[highlighted]:bg-item-hover data-[state=checked]:font-medium",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="truncate">
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </span>

    <span className="absolute right-3 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1.5 my-1 h-px bg-border", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
