import { api } from '../../utils/api.js';

// Actions
const LINKS_FETCH = 'LINKS_FETCH';
const LINKS_CREATE = 'LINKS_CREATE';
const LINKS_UPDATE = 'LINKS_UPDATE';
const LINKS_DELETE = 'LINKS_DELETE';
const LINKS_LOADING = 'LINKS_LOADING';
const LINKS_ERROR = 'LINKS_ERROR';

// Initial state
const initialState = {
  items: [],
  isLoading: false,
  error: null
};

// Fetch user links
export const fetchLinks = () => async (dispatch) => {
  dispatch({ type: LINKS_LOADING });
  try {
    const { data } = await api.get('/api/links');
    dispatch({
      type: LINKS_FETCH,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: LINKS_ERROR,
      payload: error.message
    });
  }
};

// Create link
export const createLink = (linkData) => async (dispatch) => {
  dispatch({ type: LINKS_LOADING });
  try {
    const { data } = await api.post('/api/links', linkData);
    dispatch({
      type: LINKS_CREATE,
      payload: data
    });
    return data;
  } catch (error) {
    dispatch({
      type: LINKS_ERROR,
      payload: error.message
    });
    throw error;
  }
};

// Update link
export const updateLink = (linkId, updates) => async (dispatch) => {
  dispatch({ type: LINKS_LOADING });
  try {
    const { data } = await api.put(`/api/links/${linkId}`, updates);
    dispatch({
      type: LINKS_UPDATE,
      payload: data
    });
    return data;
  } catch (error) {
    dispatch({
      type: LINKS_ERROR,
      payload: error.message
    });
    throw error;
  }
};

// Delete link
export const deleteLink = (linkId) => async (dispatch) => {
  dispatch({ type: LINKS_LOADING });
  try {
    await api.delete(`/api/links/${linkId}`);
    dispatch({
      type: LINKS_DELETE,
      payload: linkId
    });
  } catch (error) {
    dispatch({
      type: LINKS_ERROR,
      payload: error.message
    });
    throw error;
  }
};

// Reducer
export default function linkReducer(state = initialState, action) {
  switch (action.type) {
    case LINKS_FETCH:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };
    case LINKS_CREATE:
      return {
        ...state,
        items: [action.payload, ...state.items],
        isLoading: false,
        error: null
      };
    case LINKS_UPDATE:
      return {
        ...state,
        items: state.items.map(link =>
          link.id === action.payload.id ? action.payload : link
        ),
        isLoading: false,
        error: null
      };
    case LINKS_DELETE:
      return {
        ...state,
        items: state.items.filter(link => link.id !== action.payload),
        isLoading: false,
        error: null
      };
    case LINKS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case LINKS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
