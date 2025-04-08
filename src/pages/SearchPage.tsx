import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchPatient from '@/components/SearchPatient';
import PatientList from '@/components/PatientList';
import PatientView from '@/components/PatientView';
import PatientForm from '@/components/PatientForm';
import { PatientRecord, SearchOptions } from '@/types/patient';
import { toast } from 'sonner';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

type ViewMode = 'search' | 'view' | 'edit';

// Local storage key for patient records
const PATIENTS_STORAGE_KEY = 'patient_records';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper function to get all patients from localStorage
  const getAllPatients = (): PatientRecord[] => {
    const patientsJson = localStorage.getItem(PATIENTS_STORAGE_KEY);
    return patientsJson ? JSON.parse(patientsJson) : [];
  };

  const handleSearch = async (options: SearchOptions) => {
    try {
      setIsLoading(true);
      const allPatients = getAllPatients();
      
      let filteredPatients: PatientRecord[] = [];
      
      if (options.type === 'mobile') {
        filteredPatients = allPatients.filter(patient => 
          patient.mobileNumber.toLowerCase().includes(options.query.toLowerCase())
        );
      } else {
        filteredPatients = allPatients.filter(patient => 
          patient.patientName.toLowerCase().includes(options.query.toLowerCase())
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

      // Get all patients from localStorage
      const allPatients = getAllPatients();
      
      // Update the patient in the array
      const updatedPatients = allPatients.map(p => 
        p.id === updatedPatient.id ? updatedPatient : p
      );
      
      // Save back to localStorage
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(updatedPatients));
      
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

  // Export all patient data to a JSON file
  const exportData = async () => {
    try {
      const allPatients = getAllPatients();
      
      if (allPatients.length === 0) {
        toast.info('No records to export');
        return;
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
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Import patient data from a JSON file
  const importData = async () => {
    try {
      // This will need a file picker, but for now we can import a specific file
      const filePath = prompt('Enter the file path to import (e.g., patient_records_2023-04-08.json):');
      
      if (!filePath) return;
      
      const result = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      
      // Check if result.data is a string before parsing
      if (typeof result.data !== 'string') {
        toast.error('Invalid file format: could not read file data as text');
        return;
      }
      
      const importedPatients = JSON.parse(result.data) as PatientRecord[];
      
      if (!Array.isArray(importedPatients)) {
        toast.error('Invalid file format');
        return;
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
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data');
    }
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
            <Button variant="outline" size="sm" onClick={exportData} title="Export Data">
              <Download size={18} className="mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={importData} title="Import Data">
              <Upload size={18} className="mr-2" />
              Import
            </Button>
          </div>
        )}
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
