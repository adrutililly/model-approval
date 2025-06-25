import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  version: z.string().min(1, "Version is required"),
  category: z.string().min(1, "Category is required"),
  infrastructure: z.string().min(1, "Infrastructure is required"),
  license: z.string().min(1, "License is required"),
  confirmation: z.boolean().refine((val) => val === true, {
    message: "You must confirm this statement",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewModelFormProps {
  onModelAdded: () => void; // Callback to refetch data
}

export function NewModelForm({ onModelAdded }: NewModelFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modelName: "",
      version: "",
      category: "",
      infrastructure: "",
      license: "",
      confirmation: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit model");
      }

      toast.success("Model added successfully");
      form.reset();
      setOpen(false);
      onModelAdded(); // Trigger refetch
    } catch (error) {
      console.error("Error submitting model:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit model");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#d52b1e] hover:bg-[#b3241a] text-white">
          + New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Model Request</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="modelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter version" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="infrastructure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Infrastructure</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter infrastructure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter license" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I have searched the list for the software, and there is no previous approval decision, or the license has changed since the last decision. Version number changes do not require a new approval.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-[#e1241b] hover:bg-[#b3241a]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 