export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export type ItemType = 'lost' | 'found';

export type ItemStatus = 'open' | 'claimed' | 'matched' | 'resolved';

export type ItemCategory =
  | 'electronics'
  | 'ids-wallets'
  | 'keys'
  | 'bags-backpacks'
  | 'bottles-mugs'
  | 'books-stationery'
  | 'clothing'
  | 'glasses'
  | 'other';

export interface CampusItem {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  type: ItemType;
  location: string;
  locationDetails?: string;
  date: string;
  relativeDate?: string;
  time?: string;
  imageUrl: string;
  status: ItemStatus;
  reportedBy: {
    name: string;
    studentId?: string;
    email?: string;
  };
  color?: string;
  brand?: string;
  tags: string[];
  aiSimilarity?: number;
  privateDetails?: string;
}


export interface AiMatch {
  id: string;
  queryItemTitle: string;
  queryImageUrl: string;
  matchItem: CampusItem;
  similarityScore: number; // e.g. 92
  matchConfidence: 'very_high' | 'high' | 'medium';
  featureMatches: {
    name: string;
    score: number;
    description: string;
  }[];
  detectedLabels: string[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  campusEmail: string;
  studentId: string;
  department: string;
  gradYear: string;
  avatarUrl: string;
  phone?: string;
  itemsReportedCount: number;
  itemsRecoveredCount: number;
}

export interface ClaimRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  imageUrl: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  verificationDetails: string;
  hubPickupLocation: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
