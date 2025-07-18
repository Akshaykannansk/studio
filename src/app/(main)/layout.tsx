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

// Mock user data
const mockUser: UserType = {
  id: '1',
  username: 'cinephile_jane',
  name: 'Jane Doe',
  avatarUrl: 'https://placehold.co/100x100.png',
};

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-2">
            <Link href="/dashboard" className="flex items-center gap-2 p-2 font-semibold text-lg text-sidebar-foreground hover:text-sidebar-primary transition-colors">
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
                  <Link href="/dashboard"><Home /> <span className="group-data-[collapsible=icon]:hidden">Dashboard</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Search Movies">
                  <Link href="/movies/search"><Search /> <span className="group-data-[collapsible=icon]:hidden">Search Movies</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Lists">
                  <Link href="/lists"><List /> <span className="group-data-[collapsible=icon]:hidden">My Lists</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Recommendations">
                  <Link href="/recommendations"><ThumbsUp /> <span className="group-data-[collapsible=icon]:hidden">Recommendations</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile">
                  <Link href="/profile"><User /> <span className="group-data-[collapsible=icon]:hidden">Profile</span></Link>
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
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Logout">
                    {/* In a real app, this would trigger a logout action */}
                    <Link href="/"> 
                        <LogOut />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
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
                {/* Global Search can go here */}
            </div>
            {/* Other header items like notifications or user menu can go here for mobile if needed */}
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}