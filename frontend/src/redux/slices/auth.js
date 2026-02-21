import { api } from '../../utils/api.js';
import { supabase } from '../../utils/supabase.js';

// Actions
const AUTH_LOGIN = 'AUTH_LOGIN';
const AUTH_LOGOUT = 'AUTH_LOGOUT';
const AUTH_LOADING = 'AUTH_LOADING';
const AUTH_ERROR = 'AUTH_ERROR';
const AUTH_RESTORE = 'AUTH_RESTORE';

// Initial state
const initialState = {
  user: null,
  session: null,
  isLoading: false,
  error: null
};

// Restore session from localStorage on app load
export const restoreSession = () => async (dispatch) => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (token && user) {
    dispatch({
      type: AUTH_RESTORE,
      payload: {
        user: JSON.parse(user),
        token
      }
    });
  }
};

// Signup
export const signup = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    // First signup
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signupError) throw signupError;

    // Then auto-login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.session) {
      localStorage.setItem('authToken', data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: AUTH_LOGIN,
        payload: {
          user: data.user,
          session: data.session
        }
      });
    }
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
      payload: error.message
    });
    throw error;
  }
};

// Login
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOADING });
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    localStorage.setItem('authToken', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    dispatch({
      type: AUTH_LOGIN,
      payload: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
      payload: error.message
    });
    throw error;
  }
};

// Logout
export const logout = () => (dispatch) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  dispatch({ type: AUTH_LOGOUT });
};

// Reducer
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        error: null
      };
    case AUTH_LOGOUT:
      return initialState;
    case AUTH_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AUTH_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case AUTH_RESTORE:
      return {
        ...state,
        user: action.payload.user,
        session: { access_token: action.payload.token }
      };
    default:
      return state;
  }
}
