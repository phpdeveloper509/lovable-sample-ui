import { useState } from "react";
import { UserCheck, Check, X, Lock, FileDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShiftBadge } from "@/components/common/ShiftBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { shifts, dailySummary, formatCurrency } from "@/lib/mockData";
import { toast } from "sonner";
import { ShiftClosing } from "@/types/cashlog";

export default function Verification() {
  const [selectedShift, setSelectedShift] = useState<ShiftClosing | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [allApproved, setAllApproved] = useState(false);

  const handleApprove = (shift: ShiftClosing) => {
    toast.success(`${shift.shiftType} shift approved`);
  };

  const handleReject = () => {
    if (!rejectRemarks.trim()) {
      toast.error("Remarks required for rejection");
      return;
    }
    toast.success(`Shift rejected and sent back for correction`);
    setRejectDialogOpen(false);
    setRejectRemarks("");
    setSelectedShift(null);
  };

  const handleLockDay = () => {
    setAllApproved(true);
    toast.success("Day locked successfully. No further edits allowed.");
  };

  const handleExportPDF = () => {
    toast.success("Exporting PDF report...");
  };

  const handleExportExcel = () => {
    toast.success("Exporting Excel report...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Accountant Verification</h1>
            <p className="page-description">Review and approve shift closings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
              <FileDown className="h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Daily Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Daily Summary - {dailySummary.date}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <p className="text-xs text-muted-foreground mb-1">Opening</p>
              <p className="font-bold">{formatCurrency(dailySummary.opening)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-xs text-muted-foreground mb-1">Collections</p>
              <p className="font-bold text-success">+{formatCurrency(dailySummary.totalCollections)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-info/10 border border-info/20">
              <p className="text-xs text-muted-foreground mb-1">POS</p>
              <p className="font-bold text-info">{formatCurrency(dailySummary.totalPOS)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary border border-border">
              <p className="text-xs text-muted-foreground mb-1">Direct</p>
              <p className="font-bold">{formatCurrency(dailySummary.totalDirect)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-muted-foreground mb-1">Refunds</p>
              <p className="font-bold text-destructive">−{formatCurrency(dailySummary.totalRefunds)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-muted-foreground mb-1">Expenses</p>
              <p className="font-bold text-warning">−{formatCurrency(dailySummary.totalExpenses)}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Closing</p>
              <p className="font-bold text-primary">{formatCurrency(dailySummary.closing)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shift Details</CardTitle>
          <CardDescription>Review each shift's closing and verify accuracy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="table-container overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift</TableHead>
                  <TableHead>Opening</TableHead>
                  <TableHead>Closing</TableHead>
                  <TableHead>Physical</TableHead>
                  <TableHead>Diff</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ShiftBadge shift={shift.shiftType} size="sm" />
                        <span className="text-sm text-muted-foreground">{shift.closedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(shift.openingBalance)}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(shift.systemClosingBalance)}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(shift.physicalCash || 0)}
                    </TableCell>
                    <TableCell className={shift.difference !== 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                      {shift.difference !== undefined ? (
                        shift.difference !== 0 ? formatCurrency(shift.difference) : '0'
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {shift.matchStatus && <StatusBadge status={shift.matchStatus} />}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shift.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedShift(shift)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {shift.status !== 'approved' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-success hover:text-success hover:bg-success/10"
                              onClick={() => handleApprove(shift)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setSelectedShift(shift);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lock Day Button */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="gap-2 px-8"
          onClick={handleLockDay}
          disabled={allApproved}
        >
          <Lock className="h-4 w-4" />
          {allApproved ? "Day Locked" : "Lock Day"}
        </Button>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Shift</DialogTitle>
            <DialogDescription>
              This shift will be sent back to the receptionist for correction.
              Please provide mandatory remarks.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
