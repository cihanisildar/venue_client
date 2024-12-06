"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

import useUserProfile from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import PreferencesView from "./_components/preferences-view";
import PreferencesEditDialog from "./_components/preferences-edit";
import { z } from "zod";
import VenueSearchButton from "./_components/venue-search-button";
import {
  IUserPreference,
  mapNoisePreference,
  mapTimePreference,
} from "@/types/user.types";

// Define the schema for user preferences
const preferencesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  budget: z.number(),
  petsAllowed: z.boolean(),
  quiet: z.boolean(),
  outdoor: z.boolean(),
  wifi: z.boolean(),
  parking: z.boolean(),
  accessibility: z.boolean(),
  studyPlace: z.boolean(),
  noiseLevel: z.enum(["QUIET", "MODERATE", "LOUD"]).nullable(),
  preferredTime: z
    .enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT", "ANY"])
    .nullable(),
  groupSize: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer the TypeScript type for preferences
type Preferences = z.infer<typeof preferencesSchema>;

export default function UserPreferences() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userProfile) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/user/preferences",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data: IUserPreference | null = await response.json();

        if (data) {
          setPreferences({
            ...data,
            noiseLevel: mapNoisePreference(data.noiseLevel),
            preferredTime: mapTimePreference(data.preferredTime),
          });
        } else {
          setPreferences(null);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast({
          title: "Error",
          description: "Failed to load preferences. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [userProfile]);

  const handleUpdatePreferences = (
    updatedPreferences: Partial<Preferences>
  ) => {
    setPreferences((prevPreferences) => {
      if (!prevPreferences) return null; // Handle null state

      return {
        ...prevPreferences,
        ...updatedPreferences, // Merge updated fields
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading preferences...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 relative"
    >
      <div className="absolute top-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditDialogOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Edit className="w-6 h-6" />
        </motion.button>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-4">
          Your Preferences
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          A personalized view of your space and study preferences
        </p>
      </div>

      {preferences && (
        <PreferencesView
          preferences={{
            ...preferences,
            noiseLevel: preferences.noiseLevel ?? "QUIET", // Provide a default
            preferredTime: preferences.preferredTime ?? "ANY", // Provide a default
          }}
        />
      )}

      {preferences && (
        <VenueSearchButton
          preferences={{
            ...preferences,
            noiseLevel: preferences.noiseLevel ?? "QUIET", // Replace null with default
            preferredTime: preferences.preferredTime ?? "ANY", // Replace null with default
          }}
        />
      )}

      {isEditDialogOpen && preferences && (
        <PreferencesEditDialog
          initialPreferences={{
            ...preferences,
            noiseLevel: preferences.noiseLevel ?? "QUIET", // Default to "QUIET" if null
            preferredTime: preferences.preferredTime ?? "ANY", // Default to "ANY" if null
          }}
          onClose={() => setIsEditDialogOpen(false)}
          onUpdate={handleUpdatePreferences}
        />
      )}
    </motion.div>
  );
}
