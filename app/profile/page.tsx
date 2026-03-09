'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MapPin, Link as LinkIcon, Calendar, Settings, 
  Grid, Bookmark, UserPlus, UserCheck, LogOut,
  Instagram, Youtube, Twitter, Facebook, Music2, Send, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useThemeStore } from '@/lib/store';
import { PostCard } from '@/components/feed/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { User, Post } from '@/lib/types';

const networkIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  telegram: Send,
  whatsapp: MessageCircle,
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { darkMode } = useThemeStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    // Mock load posts
    setTimeout(() => {
      setPosts([]);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-lg">Profile</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-primary to-primary/50">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">{user?.displayName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              {user?.isVerified && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-background">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user?.displayName}</h2>
              <p className="text-muted-foreground">@{user?.username}</p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 mt-4">
                <div className="text-center">
                  <p className="font-bold text-lg">{formatNumber(user?.postsCount || 0)}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{formatNumber(user?.followers || 0)}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{formatNumber(user?.following || 0)}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>

              {/* Bio */}
              {user?.bio && (
                <p className="mt-4 text-sm whitespace-pre-wrap">{user.bio}</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                {user?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                )}
                {user?.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user?.createdAt || '').toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Connected Networks */}
              {user?.networks && user.networks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Connected Networks</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {user.networks.map((network, index) => {
                      const Icon = networkIcons[network.network];
                      return (
                        <a
                          key={index}
                          href={network.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs hover:bg-muted/80 transition-colors"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          <span className="capitalize">{network.network}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Edit Profile Button */}
              <Button className="mt-4 w-full md:w-auto" variant="outline">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="posts" className="flex-1 md:flex-none">
              <Grid className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 md:flex-none">
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="aspect-square" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <Grid className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-muted-foreground">Share your first post with the world!</p>
                <Button className="mt-4" onClick={() => router.push('/feed')}>
                  Create Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => {}}
                    onSave={() => {}}
                    onShare={() => {}}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No saved posts</p>
              <p className="text-muted-foreground">Posts you save will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden z-50">
        <div className="flex justify-around items-center h-16 pb-safe">
          <Button variant="ghost" size="icon" onClick={() => router.push('/feed')}>
            <Grid className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push('/explore')}>
            <MapPin className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push('/feed')}>
            <Grid className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <UserCheck className="w-5 h-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
