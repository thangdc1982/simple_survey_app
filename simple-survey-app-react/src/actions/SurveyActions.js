export const fetchSurveys = (payload) => {      
  return {
    type: "FETCH_SURVEYS", 
    payload   
  };  
};

export const addSurvey = (payload) => {
  return {
    type: "ADD_SURVEYS",
    payload
  }
};

export const deleteSurvey = (id) => {
  return {
    type: "DELETE_SURVEYS",
    payload: id
  }
};