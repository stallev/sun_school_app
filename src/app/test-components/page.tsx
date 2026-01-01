"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Icon } from "@/components/atoms/icon";
import { Logo } from "@/components/atoms/logo";
import { Spinner } from "@/components/atoms/spinner";
import { Home, User, Calendar as CalendarIcon } from "@/lib/utils/icons";

export default function TestComponentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Component Test Page</h1>
        <p className="text-muted-foreground">
          This page demonstrates all installed Shadcn UI components and custom atoms.
        </p>
      </div>

      {/* Custom Atoms */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Atoms</h2>
        <div className="flex gap-4 items-center">
          <Logo size="sm" />
          <Logo size="md" />
          <Logo size="lg" />
          <Icon icon={Home} size={24} />
          <Icon icon={User} size={24} />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Input id="input" placeholder="Enter text" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="textarea">Textarea</Label>
            <Textarea id="textarea" placeholder="Enter text" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="select">Select</Label>
            <Select>
              <SelectTrigger id="select">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Dialog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description text</DialogDescription>
            </DialogHeader>
            <p>Dialog content goes here</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Dropdown Menu */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dropdown Menu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* Calendar */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Calendar</h2>
        <div className="flex gap-4">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* Avatar */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatar</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Sheet */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sheet</h2>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description text</SheetDescription>
            </SheetHeader>
            <p className="mt-4">Sheet content goes here</p>
          </SheetContent>
        </Sheet>
      </section>

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Toast (Sonner)</h2>
        <div className="flex gap-4">
          <Button
            onClick={() => toast.success("Success message")}
          >
            Success Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast.error("Error message")}
          >
            Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("Info message")}
          >
            Info Toast
          </Button>
        </div>
      </section>
    </div>
  );
}

