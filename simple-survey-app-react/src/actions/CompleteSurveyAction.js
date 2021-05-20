export const fetchCompleteSurvey = (payload) => {      
  return {
    type: "FETCH_COMPLETE_SURVEYS", 
    payload   
  };  
};

export const completeSurvey = (payload) => {
  return {
    type: "COMPLETE_SURVEYS",
    payload
  }
};