export interface IUserProfile {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  age: number | null;
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

export enum TimePreference {
  EARLY_MORNING = "EARLY_MORNING",
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
  NIGHT = "NIGHT",
  ANY = "ANY",
}

export enum NoisePreference {
  SILENT = "SILENT",
  QUIET = "QUIET",
  MODERATE = "MODERATE",
  LIVELY = "LIVELY",
}
