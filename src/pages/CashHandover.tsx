import { useState } from "react";
import { HandCoins, Camera, Pen, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShiftBadge } from "@/components/common/ShiftBadge";
import { currentShift, formatCurrency, users, mockHandovers, currentUser } from "@/lib/mockData";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CashHandover() {
  const [handoverTo, setHandoverTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);

  const physicalCash = currentShift.systemClosingBalance; // In real app, this comes from shift closing
  const otherUsers = users.filter(u => u.id !== currentUser.id && u.role === 'reception');

  const handleSubmit = () => {
    if (!handoverTo) {
      toast.error("Please select the receiving user");
      return;
    }
    if (!signed) {
      toast.error("Please add your signature");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Cash handover submitted successfully");
    }, 1500);
  };

  const handleSign = () => {
    setSigned(true);
    toast.success("Signature captured");
  };

  const selectedUser = users.find(u => u.id === handoverTo);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Cash Handover</h1>
            <p className="page-description">Transfer cash to the next shift user</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <ShiftBadge shift={currentShift.shiftType} size="lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Handover Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-primary" />
              Handover Details
            </CardTitle>
            <CardDescription>
              Record the physical cash handover to the next shift
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Physical Cash Display */}
            <div className="p-6 rounded-xl bg-primary text-primary-foreground text-center">
              <p className="text-primary-foreground/70 text-sm mb-1">Physical Cash</p>
              <p className="text-4xl font-bold">{formatCurrency(physicalCash)}</p>
            </div>

            {/* From/To Users */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Handed By</Label>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Handed To *</Label>
                <Select value={handoverTo} onValueChange={setHandoverTo}>
                  <SelectTrigger className="h-auto py-3">
                    <SelectValue placeholder="Select user">
                      {selectedUser && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                              {selectedUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{selectedUser.name}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {otherUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <Label>Signature *</Label>
              {signed ? (
                <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-success font-medium">Signature captured</span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-24 border-dashed gap-2"
                  onClick={handleSign}
                >
                  <Pen className="h-5 w-5" />
                  Click to sign here
                </Button>
              )}
            </div>

            {/* Photo (Optional) */}
            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full h-16 border-dashed gap-2"
              >
                <Camera className="h-5 w-5" />
                Capture photo proof
              </Button>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Timestamp</span>
              </div>
              <span className="font-medium">
                {new Date().toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>

            <Button 
              className="w-full gap-2" 
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit Handover"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Handovers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Handovers</CardTitle>
            <CardDescription>
              Previous cash handover records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockHandovers.map((handover) => (
              <div 
                key={handover.id}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {handover.fromUser.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">→</span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {handover.toUser.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {handover.confirmed && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmed
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {handover.fromUser} → {handover.toUser}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(handover.timestamp).toLocaleString('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(handover.handoverAmount)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
