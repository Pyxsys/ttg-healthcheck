import React, {createContext, useState, useEffect} from 'react';
import AuthService from '../services/authService';

interface AuthObject {
  isAuthenticated: boolean
  user: UserObject
}

interface UserObject {
  name: string
  role: string
}

export const AuthContext = createContext({} as AuthObject);

export default (props: any) => {
  const [user, setUser] = useState({name: '', role: ''});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AuthService.isAuthenticated().then((data: any) => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoaded(true);
    });
  }, []);

  const authContextValue = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <div>
      {!isLoaded ? (
        <h1>Loading</h1>
      ) : (
        <AuthContext.Provider value={authContextValue}>
          {...props}
        </AuthContext.Provider>
      )}
    </div>
  );
};
