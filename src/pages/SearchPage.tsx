
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

type ViewMode = 'search' | 'view' | 'edit';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');

  const handleSearch = (options: SearchOptions) => {
    try {
      // Get patients from localStorage
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');

      let filteredPatients: PatientRecord[];
      
      if (options.type === 'mobile') {
        filteredPatients = patients.filter((p: PatientRecord) => 
          p.mobileNumber.includes(options.query)
        );
      } else {
        filteredPatients = patients.filter((p: PatientRecord) => 
          p.patientName.toLowerCase().includes(options.query.toLowerCase())
        );
      }

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

  const handleSavePatient = (updatedPatient: PatientRecord) => {
    try {
      // Get patients from localStorage
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');
      
      // Find and update the patient
      const index = patients.findIndex((p: PatientRecord) => p.id === updatedPatient.id);
      
      if (index !== -1) {
        patients[index] = updatedPatient;
        localStorage.setItem('patients', JSON.stringify(patients));
        
        // Update search results
        setSearchResults(patients.filter((p: PatientRecord) => 
          searchResults.some(r => r.id === p.id)
        ));
        
        setSelectedPatient(updatedPatient);
        setViewMode('view');
        toast.success('Patient record updated successfully');
      }
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
          <PatientList patients={searchResults} onViewPatient={handleViewPatient} />
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
