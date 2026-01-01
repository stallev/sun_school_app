import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

/**
 * Icon component - Wrapper for Lucide React icons
 * @param icon - Lucide icon component
 * @param size - Icon size in pixels (default: 20)
 * @param className - Additional CSS classes
 */
export const Icon = ({ icon: IconComponent, size = 20, className }: IconProps) => {
  return <IconComponent className={cn("flex-shrink-0", className)} size={size} />;
};

