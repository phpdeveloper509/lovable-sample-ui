import { ShiftType } from "@/types/cashlog";
import { cn } from "@/lib/utils";
import { Sun, Sunset, Moon } from "lucide-react";

interface ShiftBadgeProps {
  shift: ShiftType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const shiftConfig = {
  morning: {
    label: 'Morning',
    icon: Sun,
    className: 'shift-badge-morning',
  },
  evening: {
    label: 'Evening',
    icon: Sunset,
    className: 'shift-badge-evening',
  },
  night: {
    label: 'Night',
    icon: Moon,
    className: 'shift-badge-night',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-xs gap-1.5',
  lg: 'px-4 py-1.5 text-sm gap-2',
};

export function ShiftBadge({ shift, showLabel = true, size = 'md', className }: ShiftBadgeProps) {
  const config = shiftConfig[shift];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      config.className,
      sizeClasses[size],
      className
    )}>
      <Icon className={cn(
        size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'
      )} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
