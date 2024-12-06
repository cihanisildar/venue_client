import React from "react";
import {
  Dog,
  Volume2,
  Cloud,
  ParkingSquare,
  Wifi,
  Accessibility,
  GraduationCap,
  SunMedium,
  Users,
  Coins,
} from "lucide-react";
import { motion } from "framer-motion";

// Define types for the PreferenceCard props
type PreferenceCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  color: string;
};

// Define types for the preferences prop
type Preferences = {
  budget: number;
  petsAllowed: boolean;
  noiseLevel: string;
  preferredTime: string;
  groupSize: string | number;
  wifi: boolean;
  parking: boolean;
  accessibility: boolean;
  studyPlace: boolean;
};

// PreferenceCard component with type annotations
const PreferenceCard: React.FC<PreferenceCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-4 rounded-xl shadow-md flex items-center space-x-4 ${color}`}
  >
    <div className="bg-white/20 p-3 rounded-full">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-white/80">{value}</p>
    </div>
  </motion.div>
);

// PreferencesView component with type annotations
const PreferencesView: React.FC<{ preferences: Preferences }> = ({
  preferences,
}) => {
  const preferencesConfig = [
    {
      icon: Coins,
      title: "Budget",
      value: `$${preferences.budget}`,
      color: "bg-green-500",
    },
    {
      icon: Dog,
      title: "Pets Allowed",
      value: preferences.petsAllowed ? "Yes" : "No",
      color: "bg-purple-500",
    },
    {
      icon: Volume2,
      title: "Noise Level",
      value: preferences.noiseLevel ?? "Not Specified", // Handle null
      color: "bg-blue-500",
    },
    {
      icon: SunMedium,
      title: "Preferred Time",
      value: preferences.preferredTime ?? "Any", // Handle null
      color: "bg-orange-500",
    },
    {
      icon: Users,
      title: "Group Size",
      value: preferences.groupSize,
      color: "bg-teal-500",
    },
  ];

  const amenitiesConfig = [
    {
      icon: Wifi,
      title: "WiFi",
      value: preferences.wifi ? "Available" : "Not Available",
      color: "bg-indigo-500",
    },
    {
      icon: ParkingSquare,
      title: "Parking",
      value: preferences.parking ? "Available" : "Not Available",
      color: "bg-pink-500",
    },
    {
      icon: Accessibility,
      title: "Accessibility",
      value: preferences.accessibility ? "Yes" : "No",
      color: "bg-cyan-500",
    },
    {
      icon: GraduationCap,
      title: "Study Place",
      value: preferences.studyPlace ? "Preferred" : "Not Important",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-3 gap-4 grid-cols-2"
      >
        {preferencesConfig.map((pref) => (
          <PreferenceCard key={pref.title} {...pref} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid md:grid-cols-4 gap-4 grid-cols-2"
      >
        {amenitiesConfig.map((amenity) => (
          <PreferenceCard key={amenity.title} {...amenity} />
        ))}
      </motion.div>
    </div>
  );
};

export default PreferencesView;
