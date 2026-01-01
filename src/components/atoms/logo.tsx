import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

/**
 * Logo component - Application logo placeholder
 * @param size - Logo size (sm, md, lg)
 * @param className - Additional CSS classes
 */
export const Logo = ({ size = "md", className }: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold",
        sizeClasses[size],
        className
      )}
      aria-label="Sunday School App Logo"
    >
      SS
    </div>
  );
};

