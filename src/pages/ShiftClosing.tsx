import { useState } from "react";
import { ClipboardCheck, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShiftBadge } from "@/components/common/ShiftBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { currentShift, formatCurrency, users } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ShiftClosing() {
  const [physicalCash, setPhysicalCash] = useState("");
  const [handoverTo, setHandoverTo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const systemClosing = currentShift.systemClosingBalance;
  const physical = physicalCash ? parseFloat(physicalCash) : 0;
  const difference = physical - systemClosing;
  const isMatched = difference === 0;
  const hasPhysicalCash = physicalCash !== "";

  const handleConfirmAndLock = () => {
    if (!physicalCash) {
      toast.error("Please enter physical cash amount");
      return;
    }
    if (!handoverTo) {
      toast.error("Please select handover user");
      return;
    }
    if (!isMatched && !remarks) {
      toast.error("Remarks required for mismatched amount");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Shift closed and locked successfully");
    }, 1500);
  };

  const otherUsers = users.filter(u => u.id !== '1' && u.role === 'reception');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Shift Closing</h1>
            <p className="page-description">Close your shift and handover to the next user</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <ShiftBadge shift={currentShift.shiftType} size="lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Shift Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">Opening Balance</p>
                <p className="text-xl font-bold">{formatCurrency(currentShift.openingBalance)}</p>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground">Collections</p>
                <p className="text-xl font-bold text-success">+{formatCurrency(currentShift.totalCollections)}</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-xl font-bold text-destructive">−{formatCurrency(currentShift.totalRefunds)}</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-xl font-bold text-warning">−{formatCurrency(currentShift.totalExpenses)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Closing Balance</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Opening + Collections − Refunds − Expenses
                  </p>
                </div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(systemClosing)}</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <p className="font-medium mb-1">Breakdown:</p>
              <div className="grid grid-cols-2 gap-2">
                <span>POS Payments:</span>
                <span className="text-right font-medium">{formatCurrency(currentShift.totalPOS)}</span>
                <span>Direct Payments:</span>
                <span className="text-right font-medium">{formatCurrency(currentShift.totalDirect)}</span>
                <span>Cash Payments:</span>
                <span className="text-right font-medium">
                  {formatCurrency(currentShift.totalCollections - currentShift.totalPOS - currentShift.totalDirect)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Closing Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Close Shift
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="physicalCash">Physical Cash Counted *</Label>
              <Input
                id="physicalCash"
                type="number"
                placeholder="Enter counted cash amount"
                value={physicalCash}
                onChange={(e) => setPhysicalCash(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>

            {hasPhysicalCash && (
              <div className={cn(
                "p-4 rounded-lg border animate-scale-in",
                isMatched 
                  ? "bg-success/10 border-success/30" 
                  : "bg-destructive/10 border-destructive/30"
              )}>
                <div className="flex items-center gap-3">
                  {isMatched ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Difference</span>
                      <span className={cn(
                        "text-xl font-bold",
                        isMatched ? "text-success" : "text-destructive"
                      )}>
                        {difference > 0 ? '+' : ''}{formatCurrency(difference)}
                      </span>
                    </div>
                    <StatusBadge status={isMatched ? 'matched' : 'mismatched'} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="handoverTo">Handover To *</Label>
              <Select value={handoverTo} onValueChange={setHandoverTo}>
                <SelectTrigger id="handoverTo">
                  <SelectValue placeholder="Select next shift user" />
                </SelectTrigger>
                <SelectContent>
                  {otherUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">
                Remarks {!isMatched && hasPhysicalCash && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="remarks"
                placeholder={!isMatched && hasPhysicalCash 
                  ? "Remarks required for mismatched amount..." 
                  : "Optional notes..."
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={handleConfirmAndLock}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse">Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Confirm & Lock Shift
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Once locked, the shift cannot be edited. The next user must confirm the handover.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
