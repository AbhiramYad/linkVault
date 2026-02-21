import { api } from '../../utils/api.js';

// Actions
const ANALYTICS_FETCH = 'ANALYTICS_FETCH';
const ANALYTICS_LOADING = 'ANALYTICS_LOADING';
const ANALYTICS_ERROR = 'ANALYTICS_ERROR';

// Initial state
const initialState = {
  totalLinks: 0,
  publicCount: 0,
  privateCount: 0,
  totalClicks: 0,
  mostVisited: null,
  tagBreakdown: [],
  isLoading: false,
  error: null
};

// Fetch analytics
export const fetchAnalytics = () => async (dispatch) => {
  dispatch({ type: ANALYTICS_LOADING });
  try {
    const { data } = await api.get('/api/analytics');
    dispatch({
      type: ANALYTICS_FETCH,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ANALYTICS_ERROR,
      payload: error.message
    });
  }
};

// Reducer
export default function analyticsReducer(state = initialState, action) {
  switch (action.type) {
    case ANALYTICS_FETCH:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      };
    case ANALYTICS_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ANALYTICS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
