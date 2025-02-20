import { createContext, useState } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    role: '',
    access_token: '',
    email: ''
  });

  return (
    <DataContext.Provider value={{ user, setUser }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
