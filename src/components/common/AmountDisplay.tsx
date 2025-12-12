import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/mockData";

interface AmountDisplayProps {
  amount: number;
  showSign?: boolean;
  className?: string;
}

export function AmountDisplay({ amount, showSign = true, className }: AmountDisplayProps) {
  const isNegative = amount < 0;
  const displayAmount = Math.abs(amount);

  return (
    <span className={cn(
      "font-semibold tabular-nums",
      isNegative ? "amount-negative" : "amount-positive",
      className
    )}>
      {showSign && (isNegative ? '−' : '+')}
      {formatCurrency(displayAmount)}
    </span>
  );
}
