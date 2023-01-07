import * as React from 'react';
import { createContext, useEffect, useReducer } from 'react';
import { useUser, UserProfile } from '@auth0/nextjs-auth0/client';
import useAuth from '../hooks/useAuth';

interface AuthState {
  isAuthenticated: Boolean,
  isInitialized: Boolean,
  user: UserProfile | null,
}

interface Props {
  children: React.ReactNode;
}

interface AuthAction {
  type: string
  payload: any
}
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

// Action Handlers
const handlers = {
  INITIALIZE: (state: AuthState, action: AuthAction) => {
    const { isAuthenticated, user } = action.payload;
    return { ...state, isAuthenticated, isInitialized: true, user };
  },
  // LOGIN: (state: AuthState, action: AuthAction) => {
  //   const { user } = action.payload;
  //   return { ...state, isAuthenticated: true, user };
  // },
  // LOGOUT: (state: AuthState) => ({
  //   ...state,
  //   isAuthenticated: false,
  //   user: null,
  // }),
};

const reducer = (state: AuthState, action: AuthAction) => (handlers[action.type as keyof typeof handlers] ? handlers[action.type as keyof typeof handlers](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'auth0',
});

function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  let isAuthenticated = false;

  useEffect(() => {
    const initialize = async () => {
      try {
        const {user, isLoading, error} = useUser();
        // await auth0Client.checkSession();

        // There's a valid user and not in loading state
        if (!isLoading && user) {
          isAuthenticated = true;

          dispatch({
            type: 'INITIALIZE',
            payload: { isAuthenticated, user },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: { isAuthenticated, user: null },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: null },
        });
      }
    };
    initialize();
  }, []);

  return (<AuthContext.Provider
    value={{
        ...state,
        method: 'auth0',
        user: {
          id: state?.user?.sub,
          photoURL: state?.user?.picture,
          email: state?.user?.email,
          displayName: '',
          role: '',
        },
      }}
  
  ></AuthContext.Provider>)
}

export { AuthContext, AuthProvider }