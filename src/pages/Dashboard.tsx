import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Receipt,
  CreditCard,
  Building2,
  Clock
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ShiftBadge } from "@/components/common/ShiftBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AmountDisplay } from "@/components/common/AmountDisplay";
import { currentShift, mockEntries, shifts, formatCurrency, getShiftTimeRange } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const recentEntries = mockEntries.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">Overview of your current shift and cash position</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
              <ShiftBadge shift={currentShift.shiftType} size="lg" />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {getShiftTimeRange(currentShift.shiftType)}
              </span>
            </div>
            <Link to="/cash-entry">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Opening Balance"
          value={formatCurrency(currentShift.openingBalance)}
          icon={Wallet}
          variant="primary"
          description="From previous shift"
        />
        <StatCard
          title="Collections"
          value={formatCurrency(currentShift.totalCollections)}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Refunds"
          value={formatCurrency(currentShift.totalRefunds)}
          icon={TrendingDown}
          variant="destructive"
        />
        <StatCard
          title="Running Balance"
          value={formatCurrency(currentShift.systemClosingBalance)}
          icon={Receipt}
          variant="primary"
          description="Current cash position"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="POS Payments"
          value={formatCurrency(currentShift.totalPOS)}
          icon={CreditCard}
          variant="default"
        />
        <StatCard
          title="Direct Payments"
          value={formatCurrency(currentShift.totalDirect)}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Expenses"
          value={formatCurrency(currentShift.totalExpenses)}
          icon={Receipt}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Link to="/cash-entry">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Particulars</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.particulars}</span>
                          {entry.customerName && (
                            <span className="text-xs text-muted-foreground">{entry.customerName}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                          {entry.paymentMode}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <AmountDisplay 
                          amount={entry.isRefund ? -entry.amount : entry.amount} 
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Previous Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Yesterday's Shifts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shifts.map((shift) => (
              <div 
                key={shift.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <ShiftBadge shift={shift.shiftType} showLabel={false} />
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{shift.shiftType}</span>
                    <span className="text-xs text-muted-foreground">
                      {shift.closedBy}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(shift.physicalCash || 0)}
                  </span>
                  <StatusBadge status={shift.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
