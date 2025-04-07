
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PatientRecord, EyeDetails } from '@/types/patient';
import { toast } from 'sonner';

interface PatientFormProps {
  onSave: (record: PatientRecord) => void;
  existingRecord?: PatientRecord;
}

const defaultEyeDetails: EyeDetails = {
  sphere: '',
  cylinder: '',
  axis: '',
  add: '',
};

const PatientForm: React.FC<PatientFormProps> = ({ onSave, existingRecord }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [rightEye, setRightEye] = useState<EyeDetails>(defaultEyeDetails);
  const [leftEye, setLeftEye] = useState<EyeDetails>(defaultEyeDetails);
  const [framePrice, setFramePrice] = useState<string>('0');
  const [glassPrice, setGlassPrice] = useState<string>('0');
  const [totalPrice, setTotalPrice] = useState(0);
  const [remarks, setRemarks] = useState('');
  
  useEffect(() => {
    if (existingRecord) {
      setDate(new Date(existingRecord.date));
      setPatientName(existingRecord.patientName);
      setMobileNumber(existingRecord.mobileNumber);
      setRightEye(existingRecord.rightEye);
      setLeftEye(existingRecord.leftEye);
      setFramePrice(existingRecord.framePrice.toString());
      setGlassPrice(existingRecord.glassPrice.toString());
      setTotalPrice(existingRecord.totalPrice);
      setRemarks(existingRecord.remarks);
    }
  }, [existingRecord]);

  // Calculate total price whenever frame or glass price changes
  useEffect(() => {
    const framePriceNum = parseFloat(framePrice) || 0;
    const glassPriceNum = parseFloat(glassPrice) || 0;
    setTotalPrice(framePriceNum + glassPriceNum);
  }, [framePrice, glassPrice]);

  const updateEyeDetails = (eye: 'right' | 'left', field: keyof EyeDetails, value: string) => {
    if (eye === 'right') {
      setRightEye(prev => ({ ...prev, [field]: value }));
    } else {
      setLeftEye(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!patientName.trim()) {
      toast.error('Patient name is required');
      return;
    }

    if (!mobileNumber.trim()) {
      toast.error('Mobile number is required');
      return;
    }

    if (!remarks.trim()) {
      toast.error('Remarks are required');
      return;
    }
    
    const record: PatientRecord = {
      id: existingRecord?.id,
      date: format(date, 'yyyy-MM-dd'),
      patientName,
      mobileNumber,
      rightEye,
      leftEye,
      framePrice: parseFloat(framePrice) || 0,
      glassPrice: parseFloat(glassPrice) || 0,
      totalPrice,
      remarks,
    };
    
    onSave(record);
  };

  return (
    <form onSubmit={handleSubmit} className="app-container space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal android-input",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="android-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="android-input"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Right Eye Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rightSphere">Sphere</Label>
            <Input
              id="rightSphere"
              value={rightEye.sphere}
              onChange={(e) => updateEyeDetails('right', 'sphere', e.target.value)}
              className="android-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rightCylinder">Cylinder</Label>
            <Input
              id="rightCylinder"
              value={rightEye.cylinder}
              onChange={(e) => updateEyeDetails('right', 'cylinder', e.target.value)}
              className="android-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rightAxis">Axis</Label>
            <Input
              id="rightAxis"
              value={rightEye.axis}
              onChange={(e) => updateEyeDetails('right', 'axis', e.target.value)}
              className="android-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rightAdd">Add</Label>
            <Input
              id="rightAdd"
              value={rightEye.add}
              onChange={(e) => updateEyeDetails('right', 'add', e.target.value)}
              className="android-input"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Left Eye Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="leftSphere">Sphere</Label>
            <Input
              id="leftSphere"
              value={leftEye.sphere}
              onChange={(e) => updateEyeDetails('left', 'sphere', e.target.value)}
              className="android-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leftCylinder">Cylinder</Label>
            <Input
              id="leftCylinder"
              value={leftEye.cylinder}
              onChange={(e) => updateEyeDetails('left', 'cylinder', e.target.value)}
              className="android-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leftAxis">Axis</Label>
            <Input
              id="leftAxis"
              value={leftEye.axis}
              onChange={(e) => updateEyeDetails('left', 'axis', e.target.value)}
              className="android-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leftAdd">Add</Label>
            <Input
              id="leftAdd"
              value={leftEye.add}
              onChange={(e) => updateEyeDetails('left', 'add', e.target.value)}
              className="android-input"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="framePrice">Frame Price (₹)</Label>
            <Input
              id="framePrice"
              type="number"
              value={framePrice}
              onChange={(e) => setFramePrice(e.target.value)}
              className="android-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="glassPrice">Glass Price (₹)</Label>
            <Input
              id="glassPrice"
              type="number"
              value={glassPrice}
              onChange={(e) => setGlassPrice(e.target.value)}
              className="android-input"
            />
          </div>

          <Separator />
          
          <div className="flex justify-between items-center pt-2">
            <Label htmlFor="totalPrice" className="text-lg font-medium">Total Price:</Label>
            <span className="text-lg font-bold">₹ {totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any additional information"
            className="android-input h-24"
            required
          />
        </CardContent>
      </Card>

      <div className="pt-4">
        <Button type="submit" className="w-full android-button">
          Save Record
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
