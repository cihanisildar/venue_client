"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

// Venue schema for type safety
const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  address: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

// Preferences schema (match the one in the main component)
const PreferencesSchema = z.object({
  budget: z.number(),
  petsAllowed: z.boolean(),
  quiet: z.boolean(),
  outdoor: z.boolean(),
  wifi: z.boolean(),
  parking: z.boolean(),
  accessibility: z.boolean(),
  studyPlace: z.boolean(),
  noiseLevel: z.enum(["QUIET", "MODERATE", "LOUD"]),
  preferredTime: z.enum(["MORNING", "AFTERNOON", "EVENING", "NIGHT", "ANY"]),
  groupSize: z.number(),
});

// Type definitions
type Venue = z.infer<typeof VenueSchema>;
type Preferences = z.infer<typeof PreferencesSchema>;

interface VenueSearchButtonProps {
  preferences: Preferences;
}

export default function VenueSearchButton({ preferences }: VenueSearchButtonProps) {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [venues, setVenues] = useState<Venue[]>([]);

  const handleVenueSearch = async () => {
    setIsSearching(true);
    
    try {
      const response = await fetch(
        "http://localhost:8000/api/venues/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search for venues");
      }

      const data: Venue[] = await response.json();
      
      // Optional: Validate the response with Zod
      const validatedVenues = VenueSchema.array().parse(data);
      
      setVenues(validatedVenues);

      toast({
        title: "Venues Found",
        description: `${validatedVenues.length} venues match your preferences`,
      });
    } catch (error) {
      console.error("Error searching venues:", error);
      toast({
        title: "Error",
        description: "Failed to search for venues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <motion.button
        onClick={handleVenueSearch}
        disabled={isSearching}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-full flex items-center justify-center 
          py-4 rounded-xl 
          bg-gradient-to-r from-blue-500 to-purple-600 
          text-white font-semibold 
          shadow-lg hover:shadow-xl 
          transition-all duration-300
          ${isSearching ? 'cursor-not-allowed opacity-70' : ''}
        `}
      >
        {isSearching ? (
          <Loader2 className="mr-2 animate-spin" />
        ) : (
          <Search className="mr-2" />
        )}
        {isSearching ? 'Searching...' : 'Find Matching Venues'}
      </motion.button>

      {venues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {venues.map((venue) => (
            <motion.div
              key={venue.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-4 border"
            >
              <div className="flex items-center space-x-3 mb-2">
                <MapPin className="text-blue-500" />
                <h3 className="font-semibold">{venue.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{venue.description}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span>Capacity: {venue.capacity}</span>
                <span className="text-green-600">Available</span>
              </div>
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {venue.amenities.slice(0, 3).map((amenity) => (
                    <span 
                      key={amenity} 
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}