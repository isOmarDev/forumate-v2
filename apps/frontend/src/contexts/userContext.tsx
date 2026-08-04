import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of your user data
export interface UserData {
  username: string;
  // ... other relevant user data
}

// Create a context with initial data
export const UserContext = createContext<{
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}>({
  user: null,
  setUser: () => null,
});

// Context provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
