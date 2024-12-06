export interface IUserProfile {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  surname?: string | null;
  birthdate: Date | null;
  phoneNumber: string | null;
  role: UserRole;
  reliabilityScore: number;
  restrictedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  preferences?: IUserPreference;
}

export interface IUserPreference {
  id: string;
  userId: string;
  budget: number;
  petsAllowed: boolean;
  quiet: boolean;
  outdoor: boolean;
  wifi: boolean;
  parking: boolean;
  accessibility: boolean;
  studyPlace: boolean;
  noiseLevel: NoisePreference | null;
  preferredTime: TimePreference | null;
  groupSize: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  CAFE_OWNER = "CAFE_OWNER",
  VENUE_MANAGER = "VENUE_MANAGER",
  ADMIN = "ADMIN",
}

export type NoisePreference = "SILENT" | "QUIET" | "MODERATE" | "LIVELY" | null;
export type TimePreference =
  | "EARLY_MORNING"
  | "MORNING"
  | "AFTERNOON"
  | "EVENING"
  | "NIGHT"
  | "ANY"
  | null;

export type FrontendNoisePreference = "QUIET" | "MODERATE" | "LOUD" | null;
export type FrontendTimePreference =
  | "MORNING"
  | "AFTERNOON"
  | "EVENING"
  | "NIGHT"
  | "ANY"
  | null;

export function mapNoisePreference(
  backendNoiseLevel: "SILENT" | "QUIET" | "MODERATE" | "LIVELY" | null
): FrontendNoisePreference {
  switch (backendNoiseLevel) {
    case "SILENT":
      return "QUIET"; // Map "SILENT" to "QUIET"
    case "LIVELY":
      return "LOUD"; // Map "LIVELY" to "LOUD"
    default:
      return backendNoiseLevel; // "QUIET", "MODERATE", or null
  }
}

export function mapTimePreference(
  backendTimePreference: TimePreference
): FrontendTimePreference {
  switch (backendTimePreference) {
    case "EARLY_MORNING":
      return "MORNING"; // Map "EARLY_MORNING" to "MORNING"
    default:
      return backendTimePreference; // Return "MORNING", "AFTERNOON", "EVENING", "NIGHT", "ANY", or null as-is
  }
}
