import React, { createContext, useContext, useState, useEffect } from 'react';

interface School {
  id: string;
  name: string;
}

interface SchoolContextType {
  selectedSchool: School;
  setSelectedSchool: (school: School) => void;
  schools: School[];
}

const schools: School[] = [
  { id: 'apex-high', name: 'Apex High School' },
  { id: 'apex-middle', name: 'Apex Middle School' },
  { id: 'apex-elementary', name: 'Apex Elementary School' }
];

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSchool, setSelectedSchool] = useState<School>(schools[0]);

  return (
    <SchoolContext.Provider value={{ selectedSchool, setSelectedSchool, schools }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
