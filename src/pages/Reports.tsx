import { BarChart3, FileDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dailySummary, formatCurrency } from "@/lib/mockData";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const weeklyData = [
  { day: 'Mon', collections: 85000, refunds: 5000, expenses: 2000 },
  { day: 'Tue', collections: 92000, refunds: 8000, expenses: 1500 },
  { day: 'Wed', collections: 78000, refunds: 3000, expenses: 2500 },
  { day: 'Thu', collections: 89000, refunds: 9000, expenses: 2200 },
  { day: 'Fri', collections: 95000, refunds: 4000, expenses: 1800 },
  { day: 'Sat', collections: 72000, refunds: 6000, expenses: 3000 },
  { day: 'Sun', collections: 45000, refunds: 2000, expenses: 1000 },
];

const paymentModeData = [
  { name: 'Cash', value: 45000, color: 'hsl(173, 58%, 28%)' },
  { name: 'POS', value: 40000, color: 'hsl(199, 89%, 48%)' },
  { name: 'Direct', value: 23000, color: 'hsl(38, 92%, 50%)' },
];

export default function Reports() {
  const handleExport = (type: 'pdf' | 'excel') => {
    toast.success(`Exporting ${type.toUpperCase()} report...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-description">Cash flow analytics and summaries</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="week">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={() => handleExport('pdf')}>
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleExport('excel')}>
              <FileDown className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Collections</p>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(weeklyData.reduce((acc, d) => acc + d.collections, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Refunds</p>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(weeklyData.reduce((acc, d) => acc + d.refunds, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(weeklyData.reduce((acc, d) => acc + d.expenses, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net Cash Flow</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(
                weeklyData.reduce((acc, d) => acc + d.collections - d.refunds - d.expenses, 0)
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Cash Flow
            </CardTitle>
            <CardDescription>Collections, refunds, and expenses by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="collections" name="Collections" fill="hsl(158, 64%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="refunds" name="Refunds" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Modes</CardTitle>
            <CardDescription>Distribution by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentModeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentModeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Daily Cash Summary', description: 'Complete daily cash position' },
          { title: 'Shift-wise Report', description: 'Breakdown by shift type' },
          { title: 'User-wise Report', description: 'Cash handled by each user' },
          { title: 'Variance Report', description: 'Mismatched cash differences' },
          { title: 'Refund Summary', description: 'All refunds with reasons' },
          { title: 'Expense Summary', description: 'Petty cash and parcel costs' },
        ].map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
