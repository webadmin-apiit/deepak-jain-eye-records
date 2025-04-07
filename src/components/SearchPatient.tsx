
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchOptions } from '@/types/patient';
import { Search } from 'lucide-react';

interface SearchPatientProps {
  onSearch: (options: SearchOptions) => void;
}

const SearchPatient: React.FC<SearchPatientProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState<'name' | 'mobile'>('mobile');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch({
        query: searchQuery.trim(),
        type: searchType
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Search Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mobile" onValueChange={(value) => setSearchType(value as 'name' | 'mobile')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="mobile">By Mobile</TabsTrigger>
            <TabsTrigger value="name">By Name</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mobile">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                placeholder="Enter mobile number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="android-input flex-1"
              />
              <Button type="submit" className="android-button">
                <Search size={18} />
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="name">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                placeholder="Enter patient name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="android-input flex-1"
              />
              <Button type="submit" className="android-button">
                <Search size={18} />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SearchPatient;
