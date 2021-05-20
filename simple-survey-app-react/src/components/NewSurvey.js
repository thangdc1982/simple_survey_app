import React, {useState, useEffect} from 'react';
import './NewSurvey.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import NewQuestion from './NewQuestion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import QuestionReview from './QuestionReview';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addSurvey } from '../actions/SurveyActions';
import { addQuestion } from '../actions/QuestionActions';
import { hashCode } from '../reducers/index';
import db, { auth } from "../firebase";

function NewSurvey() {	
	const history = useHistory();

	const user = useSelector(state => state.user.user);			

	if (!user) {
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

	
	// This is the number of questions in this survey
	const [responses, setResponses] = useState([]);
	const [description, setDescription] = useState("");

	const dispatch = useDispatch();

	const onQuestionSave = (question) => {					
		let newArr = [...responses]; // copying the old datas array
    	newArr[newArr.length] = question;	
		setResponses(newArr);		
	};

	const onSaveSurvey = () => {
		if (description === "") {
			alert("The survey must have the description.");			
		} else if (responses.length < 1) {
			alert("The survey must have at least one question.");
		}
		else {
			let surveyId = hashCode(description) + "";
			let questionIds = [];
								
			// Save the questions to the collection
			responses.forEach((e, i) => {
				let questionId = surveyId + "_" + i;
				questionIds.push(questionId);
				let newQuestion = {
					id: questionId,
					type: e.type,
					question: e.question,
					responses: e.responses
				};							
				// Update database for question collection				
				try {
					db.collection('questions')     
					.add(newQuestion)
					.then((docRef) => {                  
					  dispatch(addQuestion(newQuestion));                   
					})
					.catch(err => console.log(err.message));
				} catch (error) {}
			});
			// Save the survey to the collection
			let newSurvey = {
				id: surveyId,
				description: description,
				numberOfQuestion: responses.length,
				questions: questionIds,
				active: true
			}
			// Update database for survey collection
			try {
				db.collection('surveys')     
				.add(newSurvey)
				.then((docRef) => {                  
				  dispatch(addSurvey(newSurvey));                   
				})
				.catch(err => console.log(err.message));
			} catch (error) {}	
			history.push("/dashboard/viewsurvey");					
		}
	};

	return (
		<div>
			<Form>
				<Form.Group controlId="exampleForm.ControlTextarea1">
					<Form.Label>Add Survey Description here:</Form.Label>
					<Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} />
				</Form.Group>
			</Form>	
			<Row>
				<Col>
					<NewQuestion questionSave={onQuestionSave}></NewQuestion>
				</Col>
				<Col>
				<fieldset className="scheduler-border">
					<legend className="scheduler-border">Review:</legend>						
					{(responses && responses.length > 0) && (<Tabs id="uncontrolled-tab-example">
						{							
							responses.map((e, i) => {
								return (<Tab key={i} eventKey={(i + 1) +""} title={(i+1)+ ""}><QuestionReview response={e}></QuestionReview></Tab>);
							})
						}						
					</Tabs>)			
					}
				</fieldset>
				</Col>
			</Row>
			<Button onClick={onSaveSurvey}>SAVE SURVEY</Button>				
		</div>
	)
}

export default NewSurvey;
