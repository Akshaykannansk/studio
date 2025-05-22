import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/filmfriend";

interface UserAvatarBadgeProps {
  user: User;
}

export function UserAvatarBadge({ user }: UserAvatarBadgeProps) {
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.username.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatarUrl} alt={user.name || user.username} data-ai-hint="profile avatar" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-sidebar-foreground">{user.name || user.username}</span>
        <span className="text-xs text-sidebar-foreground/70">@{user.username}</span>
      </div>
    </div>
  );
}
