
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientForm from '@/components/PatientForm';
import { PatientRecord } from '@/types/patient';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Local storage key for patient records (same as in SearchPage)
const PATIENTS_STORAGE_KEY = 'patient_records';

const NewPatientPage = () => {
  const navigate = useNavigate();

  const handleSavePatient = async (record: PatientRecord) => {
    try {
      // Generate a timestamp for createdAt
      record.createdAt = new Date().toISOString();
      
      // Generate a unique ID for the record
      record.id = uuidv4();
      
      // Get existing records from localStorage
      const existingRecordsJson = localStorage.getItem(PATIENTS_STORAGE_KEY);
      const existingRecords: PatientRecord[] = existingRecordsJson 
        ? JSON.parse(existingRecordsJson) 
        : [];
      
      // Add the new record
      const updatedRecords = [...existingRecords, record];
      
      // Save back to localStorage
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedRecords));
      
      toast.success('Patient record saved successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save patient record');
      console.error('Error saving patient:', error);
    }
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold ml-4">New Patient Record</h1>
      </div>
      
      <PatientForm onSave={handleSavePatient} />
    </div>
  );
};

export default NewPatientPage;
