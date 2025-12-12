import { cn } from "@/lib/utils";
import { Check, X, AlertCircle, Clock } from "lucide-react";

type StatusType = 'matched' | 'mismatched' | 'pending' | 'approved' | 'rejected' | 'open' | 'closed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; icon: React.ElementType; className: string }> = {
  matched: {
    label: 'Matched',
    icon: Check,
    className: 'status-matched',
  },
  mismatched: {
    label: 'Mismatched',
    icon: AlertCircle,
    className: 'status-mismatched',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'status-pending',
  },
  approved: {
    label: 'Approved',
    icon: Check,
    className: 'status-approved',
  },
  rejected: {
    label: 'Rejected',
    icon: X,
    className: 'status-rejected',
  },
  open: {
    label: 'Open',
    icon: Clock,
    className: 'status-pending',
  },
  closed: {
    label: 'Closed',
    icon: Check,
    className: 'status-approved',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn("status-badge", config.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
