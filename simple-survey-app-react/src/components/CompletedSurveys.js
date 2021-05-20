import React, { useState, useEffect } from 'react';
import './SurveyListView.css';
import QuestionCompleted from './QuestionCompleted';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

function CompletedSurveys() {
	const history = useHistory();
	const currentUser = useSelector(state => state.user.user);		
	const surveys = useSelector(state => state.surveys.surveys);
	const questions = useSelector(state => state.questions.questions);	
	const completedSurveys = useSelector(state => state.completedSurveys.completedSurveys);	

	if (!currentUser) {
		history.push("/");
	}

	const [selected, setSelected] = useState(0);
	const [currentSurvey, setCurrentSurvey] = useState(null);	
	const [currentQuestions, setCurrrentQuestions] = useState([]);
	const [currentResponse, setCurrrentResponse] = useState({});
    const [completedSurveyOption, setSompletedSurveyOption] = useState(null);

    useEffect(() => {	
		// checking for the user login event change
		auth.onAuthStateChanged(authUser => {
			if (!authUser) {
				history.push("/");
			}
		})	
        // Filter the completed survey by the user id
        let tmp = [];
		completedSurveys.forEach((e) => {
			if (e.userid === currentUser.email) {
                tmp.push(e);
            }
		});	
        setSompletedSurveyOption(tmp);	
	}, [history, completedSurveys, currentUser]);
	

	const onSelectedChange = (e) => {		
		let selectedValue = e.target.value;
		selectedValue = parseInt(selectedValue, 10);		        
		setSelected(selectedValue);
		if (selectedValue !== 0) {
			let id = selectedValue + "";
			let idx = surveys.findIndex((survey) => survey.id === id);        
			if (idx >= 0) {
				setCurrentSurvey(surveys[idx]);	
				// Find all the question for this survey
				if (questions) {
					let surveyQuestions = [];
					questions.forEach((e) => {
						if (e.id.indexOf(id) >= 0) {
							surveyQuestions.push(e);
						}
					});                    
                    // Get the answer for this survey from this user      
                    completedSurveyOption.forEach((e) => {
                        if (e.surveyid === id) {
                            setCurrrentResponse(e.responses);
                        }
                    });                    
					setCurrrentQuestions(surveyQuestions);
				}
			}
		}
	};
	
	return (
		currentUser && completedSurveyOption ? (<div>
			<div className="surveyListViewHeader">				
				Survey Name
				{completedSurveyOption && (<select value={selected + ""} style={{minWidth: "100px", margin: "0px 10px 0px 10px"}} onChange={onSelectedChange}>
					<option value="0"></option>					
					{
						completedSurveyOption.map((e, i) => {                            
							return <option value={e.surveyid} key={i}>{e.description}</option>;
						})
					}					
				</select>)}				
			</div>
			{selected !== 0 && currentSurvey && currentQuestions && (<div>
			<fieldset className="scheduler-border">
					<legend className="scheduler-border">Survey Description:</legend>
					<div className="control-group">
							<p>{currentSurvey.description}</p>
					</div>
			</fieldset>
			<fieldset className="scheduler-border">
					<legend className="scheduler-border">Questions:</legend>
					{
						currentQuestions.map((e, i) => {
                            let answer;
                            currentResponse.forEach((a) => {
                                if (a.questionid === e.id) {
                                    if (e.type === 2) {
                                        answer = a.answers;
                                    } else {
                                        answer = a.answers.replace(/_/g, "").split(",");
                                    }
                                }
                            })
							return (<div key={i}><QuestionCompleted response={e} answers={answer}></QuestionCompleted><hr /></div>)
						})
					}										
			</fieldset>
			</div>)}			
		</div>) : <></>
	)
}

export default CompletedSurveys;
