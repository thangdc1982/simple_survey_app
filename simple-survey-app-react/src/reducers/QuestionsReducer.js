import { initialState } from './index';

const questionsReducers = (state = initialState, action) => {  
	let id, idx;
	let newQuestions;
	switch(action.type) {
		case "FETCH_QUESTIONS":        
			return {
				...state,
				questions: action.payload				
			}
		case "ADD_QUESTION":     
			id = action.payload;                  
			newQuestions = [action.payload, ...state.questions];
			return {
				...state,
				questions: newQuestions				
			};    
		case "DELETE_QUESTION":			
			id = action.payload;                  
			newQuestions = [...state.questions];
			if (newQuestions && newQuestions.length) {
				idx = newQuestions.findIndex((question) => question.id === id);        
				if (idx >= 0) {
					newQuestions.splice(idx, 1);          
				}
			}
			return {
				...state,
				questions: newQuestions				
			};
		case "UPDATE_QUESTION":      
			id = action.payload.id;                  
			newQuestions = [...state.questions];
			if (newQuestions && newQuestions.length) {
				idx = newQuestions.findIndex((question) => question.id === id);        
				if (idx >= 0) {
					newQuestions[idx] = action.payload.value;
				}
			}		          
			return {
				...state,
				questions: newQuestions				
			};						
		default:
			return state;
	}
};

export default questionsReducers;