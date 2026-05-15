export interface SupplierNode {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'ACTIVE' | 'TOP_TIER' | 'AUDIT_PENDING';
  load_level: number;
  revenue_ytd: number;
  trend_percentage: number;
  annual_prediction: number;
  contact_person: string;
  created_at: string;
}