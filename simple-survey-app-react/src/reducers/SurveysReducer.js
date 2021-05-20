import { initialState } from './index';

const surveysReducers = (state = initialState, action) => {  
	let id, idx;
	let newSurveys;
	switch(action.type) {
		case "FETCH_SURVEYS": 			
			return {
				...state,
				surveys: action.payload				
			}
		case "ADD_SURVEYS":     			                 
			newSurveys = [action.payload, ...state.surveys];
			return {
				...state,
				surveys: newSurveys				
			};    
		case "DELETE_SURVEYS":			
			id = action.payload;                  
			newSurveys = [...state.surveys];
			if (newSurveys && newSurveys.length) {
				idx = newSurveys.findIndex((survey) => survey.id === id);        
				if (idx >= 0) {
					newSurveys.splice(idx, 1);          
				}
			}
			return {
				...state,
				surveys: newSurveys				
			};
		case "COMPLETE_SURVEYS":      
			id = action.payload.id;                  
			newSurveys = [...state.surveys];
			if (newSurveys && newSurveys.length) {
				idx = newSurveys.findIndex((survey) => survey.id === id);        
				if (idx >= 0) {
					newSurveys[idx] = action.payload.value;
				}
			}		          
			return {
				...state,
				surveys: newSurveys				
			};						
		default:
			return state;
	}
};

export default surveysReducers;