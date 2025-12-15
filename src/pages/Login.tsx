import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Eye, EyeOff, LogIn } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type UserRole = "reception" | "accountant" | "admin";

const mockUsers = [
  { id: "1", name: "Mohammed", email: "mohammed@tisco.com", role: "reception" as UserRole },
  { id: "2", name: "Ibrahim", email: "ibrahim@tisco.com", role: "reception" as UserRole },
  { id: "3", name: "Fatima", email: "fatima@tisco.com", role: "reception" as UserRole },
  { id: "4", name: "Ahmad", email: "ahmad@tisco.com", role: "accountant" as UserRole },
  { id: "5", name: "Admin User", email: "admin@tisco.com", role: "admin" as UserRole },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Logged in as ${selectedRole}`);
      navigate("/");
    }, 1000);
  };

  const handleQuickLogin = (user: typeof mockUsers[0]) => {
    setEmail(user.email);
    setSelectedRole(user.role);
    toast.success(`Quick login as ${user.name} (${user.role})`);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mx-auto">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">MyTISCO</h1>
          <p className="text-muted-foreground text-sm">Cash Log Module</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@tisco.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reception">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Reception
                      </div>
                    </SelectItem>
                    <SelectItem value="accountant">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-info" />
                        Accountant
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-warning" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or quick login as</span>
              </div>
            </div>

            {/* Quick Login Users */}
            <div className="grid grid-cols-2 gap-2">
              {mockUsers.slice(0, 4).map((user) => (
                <Button
                  key={user.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 text-xs h-auto py-2"
                  onClick={() => handleQuickLogin(user)}
                >
                  <span className={`h-2 w-2 rounded-full ${
                    user.role === 'reception' ? 'bg-primary' :
                    user.role === 'accountant' ? 'bg-info' : 'bg-warning'
                  }`} />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-muted-foreground capitalize">{user.role}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Demo mode - No authentication required
        </p>
      </div>
    </div>
  );
}
