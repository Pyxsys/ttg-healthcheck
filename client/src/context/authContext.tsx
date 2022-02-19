import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import AuthService from '../services/authService';
import Contextualizer, {AppServices} from '../services/context.service';
import {IUserObject} from '../types/users';

interface AuthObject {
  isAuthenticated: boolean
  setIsAuthenticated: (active: boolean) => void
  user: IUserObject
  setUser: (active: IUserObject) => void
}

const AuthContext = Contextualizer.createContext<AuthObject>(
    AppServices.Authentication,
);

/**
 * @return {AuthObject} user information and authentication status
 */
export const useAuth = (): AuthObject =>
  Contextualizer.use<AuthObject>(AppServices.Authentication);

/**
 *
 * @param {object} param0 render from index.js
 * @return {void} auth context values
 */
function AuthProvider({children}: any) {
  const location = useLocation();
  const [user, setUser] = useState({_id: '', name: '', role: ''});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // check authentication of user on router dom changes(for links and redirects) and initial page loads
  useEffect(() => {
    AuthService.isAuthenticated().then((data: any) => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setLoading(false);
    });
  }, [location]);

  const authContextValue = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
