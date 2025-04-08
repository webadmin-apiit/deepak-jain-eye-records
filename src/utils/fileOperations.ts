
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { PatientRecord } from '@/types/patient';

// Local storage key for patient records
export const PATIENTS_STORAGE_KEY = 'patient_records';

// Helper function to get all patients from localStorage
export const getAllPatients = (): PatientRecord[] => {
  const patientsJson = localStorage.getItem(PATIENTS_STORAGE_KEY);
  return patientsJson ? JSON.parse(patientsJson) : [];
};

// Helper function to update a patient record
export const updatePatientRecord = (updatedPatient: PatientRecord): boolean => {
  try {
    if (!updatedPatient.id) {
      console.error('Patient ID is missing');
      return false;
    }
    
    // Get all patients from localStorage
    const allPatients = getAllPatients();
    
    // Update the patient in the array
    const updatedPatients = allPatients.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    );
    
    // Save back to localStorage
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
    return true;
  } catch (error) {
    console.error('Error updating patient:', error);
    return false;
  }
};

// Helper function to add a new patient record
export const savePatientRecord = (record: PatientRecord): boolean => {
  try {
    // Generate a timestamp for createdAt and ID if not present
    record.createdAt = record.createdAt || new Date().toISOString();
    record.id = record.id || uuidv4();
    
    // Get existing records from localStorage
    const existingRecords = getAllPatients();
    
    // Add the new record
    const updatedRecords = [...existingRecords, record];
    
    // Save back to localStorage
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedRecords));
    return true;
  } catch (error) {
    console.error('Error saving patient:', error);
    return false;
  }
};

// Export all patient data to a JSON file
export const exportPatientData = async (): Promise<boolean> => {
  try {
    const allPatients = getAllPatients();
    
    if (allPatients.length === 0) {
      toast.info('No records to export');
      return false;
    }
    
    const jsonData = JSON.stringify(allPatients, null, 2);
    const fileName = `patient_records_${new Date().toISOString().slice(0, 10)}.json`;
    
    // Write the file to device storage
    await Filesystem.writeFile({
      path: fileName,
      data: jsonData,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    
    toast.success(`Exported ${allPatients.length} records to ${fileName} in Documents folder`);
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    toast.error('Failed to export data');
    return false;
  }
};

// Import patient data from a JSON file
export const importPatientData = async (filePath?: string): Promise<boolean> => {
  try {
    // Get file path from user if not provided
    const path = filePath || prompt('Enter the file path to import (e.g., patient_records_2023-04-08.json):');
    
    if (!path) return false;
    
    const result = await Filesystem.readFile({
      path,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    
    // Check if result.data is a string before parsing
    if (typeof result.data !== 'string') {
      toast.error('Invalid file format: could not read file data as text');
      return false;
    }
    
    const importedPatients = JSON.parse(result.data) as PatientRecord[];
    
    if (!Array.isArray(importedPatients)) {
      toast.error('Invalid file format');
      return false;
    }
    
    // Merge with existing records, avoiding duplicates by ID
    const existingPatients = getAllPatients();
    const existingIds = new Set(existingPatients.map(p => p.id));
    
    const newPatients = [
      ...existingPatients,
      ...importedPatients.filter(p => p.id && !existingIds.has(p.id))
    ];
    
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(newPatients));
    
    toast.success(`Imported ${importedPatients.length} records successfully`);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    toast.error('Failed to import data');
    return false;
  }
};
