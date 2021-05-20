
import { combineReducers } from 'redux';
import questionsReducers from './QuestionsReducer';
import userReducers from './UserReducer';
import surveysReducer from './SurveysReducer';
import completeSurveyReducers from './CompleteSurveyReducer';

export const initialState = {};

export const hashCode = (str) => {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) + hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = hash < 0 ? hash * (-1) : hash;
  return hash;
};

const rootReducers = combineReducers({
  questions: questionsReducers, 
  surveys: surveysReducer, 
  completedSurveys: completeSurveyReducers,  
  user: userReducers
});

export default rootReducers;