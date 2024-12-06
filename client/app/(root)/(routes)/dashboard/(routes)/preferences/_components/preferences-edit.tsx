"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import useUserProfile from "@/hooks/useProfile";

// Define schema for form data
const formSchema = z.object({
  budget: z.number().min(0, "Budget must be a positive number"),
  petsAllowed: z.boolean().default(false),
  quiet: z.boolean().default(false),
  outdoor: z.boolean().default(false),
  wifi: z.boolean().default(false),
  parking: z.boolean().default(false),
  accessibility: z.boolean().default(false),
  studyPlace: z.boolean().default(false),
  noiseLevel: z.enum(["QUIET", "MODERATE", "LOUD"]).default("MODERATE"),
  preferredTime: z
    .enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT", "ANY"])
    .default("ANY"),
  groupSize: z.number().int().min(1, "Group size must be at least 1"),
});

// Define TypeScript types for props
type Preferences = z.infer<typeof formSchema>;

type PreferencesEditDialogProps = {
  initialPreferences: Preferences;
  onClose: () => void;
  onUpdate: (updatedPreferences: Preferences) => void;
};

export default function PreferencesEditDialog({
  initialPreferences,
  onClose,
  onUpdate,
}: PreferencesEditDialogProps) {
  const { userProfile } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<Preferences>({
    resolver: zodResolver(formSchema),
    defaultValues: initialPreferences,
  });

  async function onSubmit(values: Preferences) {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "You must be logged in to update preferences.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/user/preferences",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userProfile.id,
            ...values,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      const data = await response.json();
      toast({
        title: "Preferences updated",
        description: "Your preferences have been successfully updated.",
      });
      onUpdate(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Edit Preferences
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Budget Field */}
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="rounded-[4px] border-slate-300 focus:border-slate-500"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>Set your preferred budget.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkboxes */}
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  "petsAllowed",
                  "quiet",
                  "outdoor",
                  "wifi",
                  "parking",
                  "accessibility",
                  "studyPlace",
                ] as const
              ).map((pref) => (
                <FormField
                  key={pref}
                  control={form.control}
                  name={pref}
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
                          {pref.charAt(0).toUpperCase() + pref.slice(1)}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Noise Level Radio Group */}
            <FormField
              control={form.control}
              name="noiseLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Noise Level Preference</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {(["QUIET", "MODERATE", "LOUD"] as const).map((level) => (
                        <FormItem
                          key={level}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={level} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {level.charAt(0) + level.slice(1).toLowerCase()}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Time Select */}
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="rounded-[4px] border-slate-300 focus:border-slate-500">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {(
                          [
                            "MORNING",
                            "AFTERNOON",
                            "EVENING",
                            "NIGHT",
                            "ANY",
                          ] as const
                        ).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time.charAt(0) + time.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select your preferred time for activities or events.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Size Field */}
            <FormField
              control={form.control}
              name="groupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Size</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[4px] border-slate-300 focus:border-slate-500"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the number of people in your group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                className="rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white "
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[8px] bg-green-600 hover:bg-green-700 text-white "
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
}
