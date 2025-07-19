"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const listFormSchema = z.object({
  name: z.string().min(1, "List name is required").max(100, "List name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  isPublic: z.boolean().default(true),
});

type ListFormData = z.infer<typeof listFormSchema>;

export default function CreateListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ListFormData>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: true,
    },
  });

  const onSubmit = async (data: ListFormData) => {
    // Here you would call a server action to create the list in the database.
    console.log("Submitting list data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "List Created! (Simulated)",
      description: `Your list "${data.name}" would be created.`,
    });
    // Redirect to the new list's page or back to all lists
    router.push(`/lists`); 
  };

  return (
    <div>
      <PageHeader title="Create New Movie List" description="Organize your favorite films into custom collections.">
         <Button variant="outline" asChild>
          <Link href="/lists"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Lists</Link>
        </Button>
      </PageHeader>
      <div className="container mx-auto p-4 md:p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>List Details</CardTitle>
            <CardDescription>Provide a name and optional description for your new list.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">List Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input id="name" {...field} placeholder="e.g., My Favorite Horror Movies" />}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea id="description" {...field} placeholder="A brief summary of what this list is about." rows={4} />}
                />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                    name="isPublic"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                        id="isPublic"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="isPublic" className="text-sm font-normal">
                  Make this list public
                </Label>
              </div>
              {errors.isPublic && <p className="text-sm text-destructive mt-1">{errors.isPublic.message}</p>}


              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create List"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
