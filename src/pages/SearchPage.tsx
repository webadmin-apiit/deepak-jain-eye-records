
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchPatient from '@/components/SearchPatient';
import PatientList from '@/components/PatientList';
import PatientView from '@/components/PatientView';
import PatientForm from '@/components/PatientForm';
import { PatientRecord, SearchOptions } from '@/types/patient';
import { toast } from 'sonner';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ViewMode = 'search' | 'view' | 'edit';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (options: SearchOptions) => {
    try {
      setIsLoading(true);
      const patientsRef = collection(db, 'patients');
      let q;
      
      if (options.type === 'mobile') {
        q = query(patientsRef, where("mobileNumber", ">=", options.query), where("mobileNumber", "<=", options.query + '\uf8ff'));
      } else {
        q = query(patientsRef, where("patientName", ">=", options.query.toLowerCase()), where("patientName", "<=", options.query.toLowerCase() + '\uf8ff'));
      }

      const querySnapshot = await getDocs(q);
      
      const filteredPatients: PatientRecord[] = [];
      querySnapshot.forEach((doc) => {
        // Fix: Convert Firestore document to PatientRecord type explicitly
        const data = doc.data();
        filteredPatients.push({
          id: doc.id,
          date: data.date,
          patientName: data.patientName,
          mobileNumber: data.mobileNumber,
          rightEye: data.rightEye,
          leftEye: data.leftEye,
          framePrice: data.framePrice,
          glassPrice: data.glassPrice,
          totalPrice: data.totalPrice,
          remarks: data.remarks,
          createdAt: data.createdAt
        } as PatientRecord);
      });

      // Sort by date, most recent first
      filteredPatients.sort((a: PatientRecord, b: PatientRecord) => 
        new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
      );

      setSearchResults(filteredPatients);
      
      if (filteredPatients.length === 0) {
        toast.info('No matching records found');
      }
    } catch (error) {
      console.error('Error searching patients:', error);
      toast.error('Error searching for records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setViewMode('view');
  };

  const handleEditPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setViewMode('edit');
  };

  const handleSavePatient = async (updatedPatient: PatientRecord) => {
    try {
      if (!updatedPatient.id) {
        toast.error('Patient ID is missing');
        return;
      }

      // Update the patient in Firestore
      const patientRef = doc(db, "patients", updatedPatient.id);
      
      // Fix: Create a clean object without the id field for updating Firestore
      const patientData = {
        date: updatedPatient.date,
        patientName: updatedPatient.patientName,
        mobileNumber: updatedPatient.mobileNumber,
        rightEye: updatedPatient.rightEye,
        leftEye: updatedPatient.leftEye,
        framePrice: updatedPatient.framePrice,
        glassPrice: updatedPatient.glassPrice,
        totalPrice: updatedPatient.totalPrice,
        remarks: updatedPatient.remarks,
        createdAt: updatedPatient.createdAt
      };
      
      await updateDoc(patientRef, patientData);
      
      // Update the patient in the search results
      setSearchResults(prev => prev.map(p => 
        p.id === updatedPatient.id ? updatedPatient : p
      ));
      
      setSelectedPatient(updatedPatient);
      setViewMode('view');
      toast.success('Patient record updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient record');
    }
  };

  const handleBackToSearch = () => {
    setViewMode('search');
    setSelectedPatient(null);
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => {
          if (viewMode !== 'search') {
            handleBackToSearch();
          } else {
            navigate('/dashboard');
          }
        }}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold ml-4">
          {viewMode === 'search' ? 'Search Records' : 
           viewMode === 'view' ? 'Patient Details' : 'Edit Patient'}
        </h1>
      </div>

      {viewMode === 'search' && (
        <div className="app-container">
          <SearchPatient onSearch={handleSearch} />
          <PatientList patients={searchResults} onViewPatient={handleViewPatient} isLoading={isLoading} />
        </div>
      )}

      {viewMode === 'view' && selectedPatient && (
        <PatientView 
          patient={selectedPatient} 
          onBack={handleBackToSearch}
          onEdit={handleEditPatient} 
        />
      )}

      {viewMode === 'edit' && selectedPatient && (
        <PatientForm 
          existingRecord={selectedPatient}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

export default SearchPage;
