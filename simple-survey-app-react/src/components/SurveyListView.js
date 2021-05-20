import React, { useState, useEffect } from 'react';
import './SurveyListView.css';
import QuestionReview from './QuestionReview';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSurvey } from '../actions/SurveyActions';
import { completeSurvey } from '../actions/CompleteSurveyAction';
import { useHistory } from "react-router-dom";
import db, { auth } from "../firebase";

function SurveyListView() {
	const history = useHistory();
	const currentUser = useSelector(state => state.user.user);		
	const surveys = useSelector(state => state.surveys.surveys);
	const questions = useSelector(state => state.questions.questions);	
	const completedSurveys = useSelector(state => state.completedSurveys.completedSurveys);	

	if (!currentUser) {
		history.push("/");
	}

	useEffect(() => {	
		// checking for the user login event change
		auth.onAuthStateChanged(authUser => {
			if (!authUser) {
				history.push("/");
			}
		  })			
	}, [history])

	const [selected, setSelected] = useState(0);
	const [currentSurvey, setCurrentSurvey] = useState(null);	
	const [currentQuestions, setCurrrentQuestions] = useState([]);
	const [currentResponse, setCurrrentResponse] = useState({});
	

	const dispatch = useDispatch();

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
					setCurrrentQuestions(surveyQuestions);
				}
			}
		}
	};
	
	const onDeleteSurvey = () => {
		let id = selected + "";
		let idx = surveys.findIndex((survey) => survey.id === id);
		if (idx >= 0) {
			try {
				let query = db.collection('surveys').where('id', '==', id);
				query.get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {										
						doc.ref.delete();
						dispatch(deleteSurvey(id));			
						setSelected(0);
						setCurrentSurvey(null);	
						setCurrrentQuestions([]);
					});
				});	
			} catch (error) {}					
		}
	};

	const onCompleteSurvey = () => {
		let id = selected + "";
		let idx = surveys.findIndex((survey) => survey.id === id);
		if (idx >= 0) {
			try {
				let newCompletion = currentResponse;				
				// Update database for question collection				
				db.collection('completedSurveys')     
					.add(newCompletion)
					.then((docRef) => {                  
						dispatch(completeSurvey(currentResponse));
						// Set select to 0
						setSelected(0);
						setCurrentSurvey(null);	
						setCurrrentQuestions([]);
						history.push("/dashboard/completedsurvey");
					})
					.catch(err => console.log(err.message));
			} catch (error) {
				console.log(error);
			}			
		}
	};

	const onAnswer = (question, answer, id) => {
		let tmpCompletedSurvey = currentResponse;		
		tmpCompletedSurvey.userid = currentUser.email;
		tmpCompletedSurvey.surveyid = currentSurvey.id;		
		tmpCompletedSurvey.description = currentSurvey.description;
		tmpCompletedSurvey.responses = tmpCompletedSurvey.responses || [];		
		// Find the question in the survey
		// Get the question id
		const questionid = question.id;		
		let idx = tmpCompletedSurvey.responses.findIndex((question) => question.questionid === questionid);
		if (idx >= 0) {
			// User change the response				
			tmpCompletedSurvey.responses[idx] = {
				questionid,
				question: question.question,
				questiontype: question.type,				
				answers: updateAnswer(question.type, answer, id, question, tmpCompletedSurvey.responses[idx].answers)
			};						
		} else {
			// This is the first time user response			
			tmpCompletedSurvey.responses.push({
				questionid,
				question: question.question,
				questiontype: question.type,
				answers: updateAnswer(question.type, answer, id, question, "")
			});
		}	
		setCurrrentResponse(tmpCompletedSurvey);		
	};

	const updateAnswer = (type, answer, id, question, previousAnswer) => {
		const questionid = question.id; 
		let tmpAnswer;
		if (type === 2) {
			// Free text
			return answer;
		} else if (type === 1) {
			// Multiple
			tmpAnswer = []; 			
			if (previousAnswer) {
				tmpAnswer = previousAnswer.split(",");
				for (let i = 0; i < question.responses.length; i++) {
					if ((questionid + "_" + i) === id) {
						tmpAnswer[i] = answer ? question.responses[i] : "_";
						break;
					}
				}				
			} else if (answer) {
				for (let i = 0; i < question.responses.length; i++) {
					if ((questionid + "_" + i) === id) {
						tmpAnswer[i] = question.responses[i];						
					} else {
						tmpAnswer[i] = "_";
					}
				}
			}			
			return tmpAnswer.join(",")
		} else if (type === 0) {
			// Single
			tmpAnswer = [];
			question.responses.forEach((value, index) => {
				if ((questionid + "_" + index) === id) {
					tmpAnswer.push(answer ? value : "_");
				} else {
					tmpAnswer.push("_");
				}
			});
			return tmpAnswer.join(",")
		}
		return "";
	};

	return (
		currentUser && surveys ? (<div>
			<div className="surveyListViewHeader">				
				Survey Name
				{surveys && (<select value={selected + ""} style={{minWidth: "100px", margin: "0px 10px 0px 10px"}} onChange={onSelectedChange}>
					<option value="0"></option>					
					{
						surveys.map((e, i) => {
							let bSet = true;
							if (currentUser.role === 3) {								
								for (let j = 0; j < completedSurveys.length; j++) {									
									if (currentUser.email === completedSurveys[j].userid && e.id === completedSurveys[j].surveyid) {
										bSet = false;
										break;
									}
								}
							}							
							return bSet ? <option value={e.id} key={i}>{e.description}</option> : null;
						})
					}					
				</select>)}
				{/**
				 * Only admin can delete or change the survey
				 */}
				{selected !== 0 && currentSurvey && (currentUser.role === 1) && (<div>
				Is Active? 
				<input type="checkbox" style={{margin: "0px 10px 0px 10px"}} readOnly checked={currentSurvey.active}></input>					
				<Button variant="danger" onClick={onDeleteSurvey}>Delete</Button>
				</div>)
				}
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
							return (<div key={i}><QuestionReview response={e} onAnswer={onAnswer}></QuestionReview><hr /></div>)
						})
					}										
			</fieldset>
			</div>)}
			{currentUser && (currentUser.role === 3) && selected !== 0 && <Button onClick={onCompleteSurvey}>COMPLETE SURVEY</Button>}
		</div>) : <></>
	)
}

export default SurveyListView;
