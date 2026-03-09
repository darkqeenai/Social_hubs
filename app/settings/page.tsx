'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Moon, Sun, Palette, Bell, 
  Globe, Shield, User, LogOut, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, useThemeStore } from '@/lib/store';
import { toast } from 'sonner';

const accentColors = [
  { name: 'Red', value: '#ff3b3b' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, accentColor, setAccentColor, reducedMotion, setReducedMotion } = useThemeStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Separator />

            {/* Accent Color */}
            <div>
              <p className="font-medium mb-3">Accent Color</p>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAccentColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      accentColor === color.value ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reduced Motion</p>
                <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Email Notifications', description: 'Receive updates via email' },
              { label: 'Push Notifications', description: 'Receive push notifications' },
              { label: 'Likes', description: 'When someone likes your post' },
              { label: 'Comments', description: 'When someone comments on your post' },
              { label: 'Follows', description: 'When someone follows you' },
              { label: 'Mentions', description: 'When someone mentions you' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Public Profile', description: 'Make your profile visible to everyone' },
              { label: 'Show Email', description: 'Display your email on your profile' },
              { label: 'Allow Messages', description: 'Allow anyone to message you' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={item.label === 'Public Profile'} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between">
              Edit Profile
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              Change Password
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-destructive">
              Delete Account
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>SocialHub v1.0.0</p>
          <p>Powered by ImageTouch</p>
          <p>Developer: Black King | Primus Dev</p>
        </div>
      </main>
    </div>
  );
}
