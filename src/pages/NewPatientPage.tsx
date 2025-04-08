
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PatientForm from '@/components/PatientForm';
import { PatientRecord } from '@/types/patient';
import { toast } from 'sonner';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const NewPatientPage = () => {
  const navigate = useNavigate();

  const handleSavePatient = async (record: PatientRecord) => {
    try {
      // Generate a timestamp for createdAt
      record.createdAt = new Date().toISOString();
      
      // Save to Firebase Firestore instead of localStorage
      const docRef = await addDoc(collection(db, "patients"), record);
      
      // Set the id from Firestore document ID
      record.id = docRef.id;
      
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
