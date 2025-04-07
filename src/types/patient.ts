
export interface EyeDetails {
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
}

export interface PatientRecord {
  id?: string;
  date: string;
  patientName: string;
  mobileNumber: string;
  rightEye: EyeDetails;
  leftEye: EyeDetails;
  framePrice: number;
  glassPrice: number;
  totalPrice: number;
  remarks: string;
  createdAt?: string;
}

export interface SearchOptions {
  query: string;
  type: 'name' | 'mobile';
}
