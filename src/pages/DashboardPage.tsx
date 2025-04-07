
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, UserPlus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">DEEPAK P JAIN</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut size={20} />
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full py-8 flex flex-col items-center justify-center gap-2 rounded-none" 
              onClick={() => navigate('/new-patient')}
            >
              <UserPlus size={48} className="text-primary" />
              <span className="text-lg font-medium">New Patient Record</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Button 
              variant="ghost" 
              className="w-full py-8 flex flex-col items-center justify-center gap-2 rounded-none" 
              onClick={() => navigate('/search')}
            >
              <Search size={48} className="text-primary" />
              <span className="text-lg font-medium">Search Records</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Eye Records Management</p>
      </div>
    </div>
  );
};

export default DashboardPage;
