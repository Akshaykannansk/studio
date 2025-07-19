"use client"; // SidebarProvider and useIsMobile require client context

import Link from 'next/link';
import { Home, User, Search, List, ThumbsUp, Settings, LogOut, Clapperboard, SearchIcon } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { User as UserType } from '@/types/filmfriend';
import { UserAvatarBadge } from '@/components/user-avatar-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

// Mock user data
const mockUser: UserType = {
  id: '1',
  username: 'cinephile_jane',
  name: 'Jane Doe',
  avatarUrl: 'https://placehold.co/100x100.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <Sidebar collapsible="icon" className="border-r">
              <SidebarHeader className="p-2">
                <Link href="/" className="flex items-center gap-2 p-2 font-semibold text-lg text-sidebar-foreground hover:text-sidebar-primary transition-colors">
                  <Clapperboard className="h-7 w-7 text-sidebar-primary" />
                  <span className="group-data-[collapsible=icon]:hidden">FilmFriend</span>
                </Link>
                {/* User Avatar and Name */}
                <div className="mt-2 group-data-[collapsible=icon]:hidden">
                  <UserAvatarBadge user={mockUser} />
                </div>
              </SidebarHeader>

              <SidebarContent className="flex-1 overflow-y-auto">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <Link href="/"><Home /> <span className="group-data-[collapsible=icon]:hidden md:group-data-[collapsible=icon]:hidden">Dashboard</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="My Lists">
                      <Link href="/lists"><List /> <span className="group-data-[collapsible=icon]:hidden md:group-data-[collapsible=icon]:hidden">My Lists</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Recommendations">
                      <Link href="/recommendations"><ThumbsUp /> <span className="group-data-[collapsible=icon]:hidden md:group-data-[collapsible=icon]:hidden">Recommendations</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Profile">
                      <Link href="/profile"><User /> <span className="group-data-[collapsible=icon]:hidden md:group-data-[collapsible=icon]:hidden">Profile</span></Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>

              <SidebarFooter className="p-2 border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Settings">
                        <Link href="/settings">
                            <Settings />
                            <span className="group-data-[collapsible=icon]:hidden md:group-data-[collapsible=icon]:hidden">Settings</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Logout">
                        {/* In a real app, this would trigger a logout action */}
                        <Link href="/auth/logout"> 
                            <LogOut />
                            <span className="group-data-[collapsible=icon]:hidden md:group-data-[collapsible=icon]:hidden">Logout</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            <SidebarInset className="flex-1 flex flex-col bg-background">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                  <form>
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search movies, lists, users..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                      />
                    </div>
                  </form>
                </div>
                <div className="md:hidden">
                  <UserAvatarBadge user={mockUser} />
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
