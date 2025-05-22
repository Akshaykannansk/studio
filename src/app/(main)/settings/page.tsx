import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your account and application preferences." />
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="cinephile_jane" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="jane.doe@example.com" />
            </div>
            <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea id="bio" rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" defaultValue="Lover of classic cinema, sci-fi, and everything in between."></textarea>
            </div>
            <Button>Save Profile Changes</Button>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account security and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Current password" />
              <Input className="mt-2" type="password" placeholder="New password" />
              <Input className="mt-2" type="password" placeholder="Confirm new password" />
            </div>
            <Button variant="outline">Update Password</Button>
            <Separator className="my-6" />
             <div className="space-y-2">
                <h3 className="text-md font-medium">Privacy Settings</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="publicProfile" defaultChecked />
                    <Label htmlFor="publicProfile" className="font-normal">Make my profile public</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="activityPublic" defaultChecked />
                    <Label htmlFor="activityPublic" className="font-normal">Make my activity (watched films, ratings) public</Label>
                </div>
            </div>
            <Button>Save Privacy Settings</Button>
          </CardContent>
        </Card>
        
        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
            <p className="text-xs text-muted-foreground mt-2">This action is permanent and cannot be undone.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
