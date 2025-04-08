
import React, { useState } from 'react';
import SearchPatient from '@/components/SearchPatient';
import PatientList from '@/components/PatientList';
import { PatientRecord, SearchOptions } from '@/types/patient';
import { getAllPatients } from '@/utils/fileOperations';
import { toast } from 'sonner';

interface SearchViewProps {
  onViewPatient: (patient: PatientRecord) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ onViewPatient }) => {
  const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  return (
    <div className="app-container">
      <SearchPatient onSearch={handleSearch} />
      <PatientList 
        patients={searchResults} 
        onViewPatient={onViewPatient} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default SearchView;
