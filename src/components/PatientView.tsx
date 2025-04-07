
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Edit } from 'lucide-react';
import { PatientRecord } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PatientViewProps {
  patient: PatientRecord;
  onBack: () => void;
  onEdit: (patient: PatientRecord) => void;
}

const PatientView: React.FC<PatientViewProps> = ({ patient, onBack, onEdit }) => {
  return (
    <div className="app-container space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold">Patient Details</h2>
        <Button variant="ghost" onClick={() => onEdit(patient)} className="p-2">
          <Edit size={20} />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{patient.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mobile</p>
              <p className="font-medium">{patient.mobileNumber}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{format(parseISO(patient.date), 'PPP')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Right Eye</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Sphere</p>
                <p className="font-medium">{patient.rightEye.sphere || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cylinder</p>
                <p className="font-medium">{patient.rightEye.cylinder || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Axis</p>
                <p className="font-medium">{patient.rightEye.axis || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Add</p>
                <p className="font-medium">{patient.rightEye.add || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Left Eye</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Sphere</p>
                <p className="font-medium">{patient.leftEye.sphere || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cylinder</p>
                <p className="font-medium">{patient.leftEye.cylinder || '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Axis</p>
                <p className="font-medium">{patient.leftEye.axis || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Add</p>
                <p className="font-medium">{patient.leftEye.add || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frame Price:</span>
            <span>₹ {patient.framePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Glass Price:</span>
            <span>₹ {patient.glassPrice.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹ {patient.totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{patient.remarks}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientView;
