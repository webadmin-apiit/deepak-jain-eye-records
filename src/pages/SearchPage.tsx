
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientRecord } from '@/types/patient';
import { toast } from 'sonner';
import SearchView from '@/components/SearchView';
import PatientView from '@/components/PatientView';
import EditView from '@/components/EditView';
import { exportPatientData, importPatientData } from '@/utils/fileOperations';

type ViewMode = 'search' | 'view' | 'edit';

const SearchPage = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');

  const handleViewPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setViewMode('view');
  };

  const handleEditPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setViewMode('edit');
  };

  const handleSavePatient = (updatedPatient: PatientRecord) => {
    setSelectedPatient(updatedPatient);
    setViewMode('view');
  };

  const handleBackToSearch = () => {
    setViewMode('search');
    setSelectedPatient(null);
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-background p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
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
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={exportPatientData} title="Export Data">
              <Download size={18} className="mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => importPatientData()} title="Import Data">
              <Upload size={18} className="mr-2" />
              Import
            </Button>
          </div>
        )}
      </div>

      {viewMode === 'search' && (
        <SearchView onViewPatient={handleViewPatient} />
      )}

      {viewMode === 'view' && selectedPatient && (
        <PatientView 
          patient={selectedPatient} 
          onBack={handleBackToSearch}
          onEdit={handleEditPatient} 
        />
      )}

      {viewMode === 'edit' && selectedPatient && (
        <EditView 
          patient={selectedPatient}
          onSave={handleSavePatient}
        />
      )}
    </div>
  );
};

export default SearchPage;
