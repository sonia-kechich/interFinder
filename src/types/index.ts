export type WorkType = 'Remote' | 'Hybrid' | 'On-site';

export type ApplicationStatus =
  | 'Draft'
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Offer Received'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface Company {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  rating: number;
  industry: string;
  size: string;
  location: string;
  description: string;
  website: string;
}

export interface Internship {
  id: string;
  title: string;
  company: Company;
  field: string[];
  workType: WorkType;
  location: string;
  stipend: number | null;
  duration: string;
  startDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  postedDate: string;
  applicantsCount: number;
  isSaved: boolean;
}

export interface Application {
  id: string;
  internship: {
    title: string;
    company: { name: string };
    workType: WorkType;
  };
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  field: string;
  university: string;
  graduationYear: number;
  location: string;
  bio: string;
  skills: string[];
  applications: string[];
  savedInternships: string[];
}

export interface FilterState {
  searchQuery: string;
  workTypes: WorkType[];
  fields: string[];
  durations: string[];
  minStipend: number | null;
}
