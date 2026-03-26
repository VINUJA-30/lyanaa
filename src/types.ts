export type Activity = 'Walking' | 'Sitting' | 'Sleeping' | 'Fall';
export type AlertType = 'Fall Detected' | 'High Heart Rate' | 'No Movement' | 'Anomaly Detected';
export type Severity = 'low' | 'medium' | 'high';
export type AlertStatus = 'active' | 'resolved';
export type UserRole = 'elderly' | 'caregiver' | 'admin';

export interface SensorData {
  id?: string;
  user_id: string;
  timestamp: string;
  heart_rate: number;
  steps: number;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  activity: Activity;
  is_anomaly: boolean;
}

export interface Alert {
  id?: string;
  user_id: string;
  timestamp: string;
  type: AlertType;
  severity: Severity;
  message: string;
  status: AlertStatus;
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  age?: number;
  emergency_contact?: string;
  role: UserRole;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
