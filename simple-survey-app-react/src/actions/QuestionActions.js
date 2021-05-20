export const fetchQuestions = (payload) => {     
  return {
    type: "FETCH_QUESTIONS", 
    payload   
  };  
};

export const addQuestion = (payload) => {
  return {
    type: "ADD_QUESTION",
    payload
  }
};

export const updateQuestion = (payload) => {
  return {
    type: "UPDATE_QUESTION",
    payload
  }
};

export const deleteQuestion = (id) => {
  return {
    type: "DELETE_QUESTION",
    payload: id
  }
};