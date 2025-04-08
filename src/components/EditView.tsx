
import React from 'react';
import { PatientRecord } from '@/types/patient';
import PatientForm from '@/components/PatientForm';
import { updatePatientRecord } from '@/utils/fileOperations';
import { toast } from 'sonner';

interface EditViewProps {
  patient: PatientRecord;
  onSave: (updatedPatient: PatientRecord) => void;
}

const EditView: React.FC<EditViewProps> = ({ patient, onSave }) => {
  const handleSavePatient = async (updatedPatient: PatientRecord) => {
    try {
      if (updatePatientRecord(updatedPatient)) {
        toast.success('Patient record updated successfully');
        onSave(updatedPatient);
      } else {
        toast.error('Failed to update patient record');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient record');
    }
  };

  return (
    <PatientForm 
      existingRecord={patient}
      onSave={handleSavePatient}
    />
  );
};

export default EditView;
