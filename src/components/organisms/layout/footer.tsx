/**
 * Footer component for application footer
 * Server Component - displays app information, links, and copyright
 */

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Sunday School App. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 (MVP)
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center md:items-end md:text-right">
            <p className="text-sm text-muted-foreground">
              Sunday School Management System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
