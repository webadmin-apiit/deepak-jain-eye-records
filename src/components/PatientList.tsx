
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Eye, Loader2 } from 'lucide-react';
import { PatientRecord } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PatientListProps {
  patients: PatientRecord[];
  onViewPatient: (patient: PatientRecord) => void;
  isLoading?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onViewPatient, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="w-full mt-4">
        <CardContent className="pt-6 flex justify-center items-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading records...</span>
        </CardContent>
      </Card>
    );
  }

  if (patients.length === 0) {
    return (
      <Card className="w-full mt-4">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No patient records found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-xl">Search Results</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {patients.map((patient) => (
              <div key={patient.id} className="p-4 hover:bg-secondary/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{patient.patientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.mobileNumber} • {format(parseISO(patient.date), 'PP')}
                    </p>
                    <p className="text-sm mt-1">{patient.remarks}</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onViewPatient(patient)} 
                    className="h-8 w-8"
                  >
                    <Eye size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PatientList;
