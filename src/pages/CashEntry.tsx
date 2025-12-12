import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShiftBadge } from "@/components/common/ShiftBadge";
import { AmountDisplay } from "@/components/common/AmountDisplay";
import { mockEntries, currentShift, formatCurrency, getShiftTimeRange } from "@/lib/mockData";
import { CashEntry, PaymentMode, EntryType } from "@/types/cashlog";
import { toast } from "sonner";

export default function CashEntryPage() {
  const [entries, setEntries] = useState<CashEntry[]>(mockEntries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [invoiceNo, setInvoiceNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [particulars, setParticulars] = useState("");
  const [amount, setAmount] = useState("");
  const [isRefund, setIsRefund] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [entryType, setEntryType] = useState<EntryType>("normal");
  const [remarks, setRemarks] = useState("");

  const runningBalance = currentShift.openingBalance + 
    entries.reduce((acc, entry) => {
      if (entry.entryType === 'expense') return acc - entry.amount;
      return acc + (entry.isRefund ? -entry.amount : entry.amount);
    }, 0);

  const filteredEntries = entries.filter(entry => 
    entry.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!particulars || !amount) {
      toast.error("Please fill in required fields");
      return;
    }

    const newEntry: CashEntry = {
      id: `entry-${Date.now()}`,
      shiftId: currentShift.id,
      date: new Date().toISOString().split('T')[0],
      invoiceNo: invoiceNo || undefined,
      customerName: customerName || undefined,
      particulars,
      amount: parseFloat(amount),
      isRefund,
      paymentMode,
      entryType,
      remarks: remarks || undefined,
      createdBy: "Mohammed",
      createdAt: new Date().toISOString(),
    };

    setEntries([newEntry, ...entries]);
    resetForm();
    setIsDialogOpen(false);
    toast.success("Entry added successfully");
  };

  const resetForm = () => {
    setInvoiceNo("");
    setCustomerName("");
    setParticulars("");
    setAmount("");
    setIsRefund(false);
    setPaymentMode("cash");
    setEntryType("normal");
    setRemarks("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Cash Entry</h1>
            <p className="page-description">Record collections, refunds, and expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <ShiftBadge shift={currentShift.shiftType} size="lg" />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Cash Transaction Entry</DialogTitle>
                    <DialogDescription>
                      Add a new cash collection, refund, or expense entry.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNo">Invoice No</Label>
                        <Input
                          id="invoiceNo"
                          placeholder="INV-001"
                          value={invoiceNo}
                          onChange={(e) => setInvoiceNo(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input
                          id="customerName"
                          placeholder="Customer name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="particulars">Particulars *</Label>
                      <Input
                        id="particulars"
                        placeholder="Description of transaction"
                        value={particulars}
                        onChange={(e) => setParticulars(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount *</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Refund</Label>
                        <div className="flex items-center gap-3 h-10">
                          <Switch
                            checked={isRefund}
                            onCheckedChange={setIsRefund}
                          />
                          <span className="text-sm text-muted-foreground">
                            {isRefund ? "This is a refund" : "Normal collection"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Payment Mode</Label>
                        <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v as PaymentMode)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="pos">POS</SelectItem>
                            <SelectItem value="direct">Direct</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Entry Type</Label>
                        <Select value={entryType} onValueChange={(v) => setEntryType(v as EntryType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        placeholder="Additional notes..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Entry</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Running Balance Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-primary-foreground/70 text-sm font-medium">Running Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(runningBalance)}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-primary-foreground/70 text-xs">Opening</p>
                <p className="font-semibold">{formatCurrency(currentShift.openingBalance)}</p>
              </div>
              <div className="text-center">
                <p className="text-primary-foreground/70 text-xs">Entries</p>
                <p className="font-semibold">{entries.length}</p>
              </div>
              <div className="text-center">
                <p className="text-primary-foreground/70 text-xs">Shift</p>
                <p className="font-semibold capitalize">{currentShift.shiftType}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by particulars, customer, or invoice..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.invoiceNo || '-'}
                    </TableCell>
                    <TableCell>{entry.customerName || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{entry.particulars}</span>
                        {entry.remarks && (
                          <span className="text-xs text-muted-foreground">{entry.remarks}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                        {entry.paymentMode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        entry.entryType === 'expense' 
                          ? 'bg-warning/10 text-warning' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {entry.entryType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <AmountDisplay 
                        amount={entry.isRefund || entry.entryType === 'expense' ? -entry.amount : entry.amount} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
