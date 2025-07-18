import type React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode; // For breadcrumbs or other elements
}

export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  return (
    <header className="bg-card border-b p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
              {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </header>
  );
}
