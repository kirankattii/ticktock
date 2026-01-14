import { type ReactNode, type RefObject, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownMenuItem[];
  trigger: ReactNode;
  align?: "left" | "right";
}

export default function DropdownMenu({
  isOpen,
  onClose,
  items,
  trigger,
  align = "right",
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside<HTMLElement>(menuRef as RefObject<HTMLElement>, () => {
    if (isOpen) {
      onClose();
    }
  });

  return (
    <div className="relative" ref={menuRef}>
      {trigger}
      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} top-7 z-50 w-28 rounded-md border border-gray-200 bg-white shadow-md`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`cursor-pointer w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                item.variant === "danger" ? "text-red-600" : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
