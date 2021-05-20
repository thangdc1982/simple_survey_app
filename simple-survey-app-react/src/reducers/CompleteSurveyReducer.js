import { initialState } from './index';

const completeSurveyReducers = (state = initialState, action) => {  	
	let newSurveys;
	switch(action.type) {
		case "FETCH_COMPLETE_SURVEYS":        
			return {
				...state,
				completedSurveys: action.payload				
			}		
		case "COMPLETE_SURVEYS":      
            newSurveys = [action.payload, ...state.completedSurveys];
            return {
                ...state,
                completedSurveys: newSurveys				
            };					
		default:
			return state;
	}
};

export default completeSurveyReducers;