import type React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode; // For breadcrumbs or other elements
  className?: string;
}

export function PageHeader({ title, description, actions, children, className }: PageHeaderProps) {
  return (
    <header className={cn("bg-card border-b p-4 md:p-6", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </header>
  );
}
