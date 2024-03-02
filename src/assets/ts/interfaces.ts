import { type User } from "firebase/auth";

interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface IResponse {
  data: User | null;
  code: string;
  message: string;
}

interface ICreateRecord {
  boatName: string;
  serialNumber: string;
  destination: string;
}

interface IRealtimeDbResponse {
  IsAvailable: boolean;
  IsDeparted: boolean;
  IsLoading: boolean;
  LoadingStatus: string;
  PassengerCount: number;
}

export type { IFirebaseConfig, IResponse, ICreateRecord, IRealtimeDbResponse };
