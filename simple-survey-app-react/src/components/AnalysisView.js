import React, { useState, useEffect } from 'react';
import './AnalysisView.css';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { auth } from "../firebase";
import Table from 'react-bootstrap/Table';

function AnalysisView() {
	const history = useHistory();
	const user = useSelector(state => state.user.user);
	const questions = useSelector(state => state.questions.questions);				
	const completedSurveys = useSelector(state => state.completedSurveys.completedSurveys);	

	if (!user) {
		history.push("/");
	}

	const [selected, setSelected] = useState(0);
	const [currentSurvey, setCurrentSurvey] = useState(null);	
	const [completedSurveyOption, setSompletedSurveyOption] = useState(null);
	const [typeTwoItems, setTypeTwoItems] = useState([]);
	const [typeSingleItems, setTypeSingleItems] = useState([]);
	const [typeMultipleItems, setTypeMultipleItems] = useState([]);

	useEffect(() => {	
		// checking for the user login event change
		auth.onAuthStateChanged(authUser => {
			if (!authUser) {
				history.push("/");
			}
		});
		let tmp = [];
		completedSurveys.forEach((e) => {
			if (tmp.length < 1) {
				tmp.push(e);
			} else {
				let bAdd = false;
				for (let i = 0; i < tmp.length; i++) {
					if (tmp[i].surveyid !== e.surveyid) {
						bAdd = true;
						break;
					}
				}
				if (bAdd) {
					tmp.push(e);
				}				
			}
		});
		setSompletedSurveyOption(tmp);
	}, [history, completedSurveys])	

	const onSelectedChange = (e) => {	
		setCurrentSurvey(null);
		setTypeTwoItems([]);
		setTypeSingleItems([]);
		setTypeMultipleItems([]);
		let selectedValue = e.target.value;
		selectedValue = parseInt(selectedValue, 10);
		setSelected(selectedValue);
		if (selectedValue !== 0) {
			let id = selectedValue + "";
			
			let collectionQuestionIds = {};
			completedSurveys.forEach((e) => {				
				if (e.surveyid === id) {									
					setCurrentSurvey(e);								
					// This is the completed survey having the target id to check
					e.responses.forEach((q) => {						
						collectionQuestionIds[q.questionid] = collectionQuestionIds[q.questionid] || {
							question: q.question,
							type: q.questiontype,
							data: []
						};
						collectionQuestionIds[q.questionid].data.push(q);						
					})					
				}
			});			
			/**
			 * Now we divide the collection into the sub-category by the type of the questions
			 * Type 0, type 1, type 2
			 */
			let typeZeroCollection = [];			
			let typeOneCollection = [];			
			let typeTwoCollection = [];				
			for (let qid in collectionQuestionIds) {
				if (collectionQuestionIds.hasOwnProperty(qid)) {					
					let question = collectionQuestionIds[qid].question;
					let type = collectionQuestionIds[qid].type;
					let answers = collectionQuestionIds[qid].data;					
					if (type === 2) {
						// open end
						answers.forEach((e, i) => {
							if (i === 0) {
								typeTwoCollection.push([question, e.answers]);
							} else {
								typeTwoCollection.push(["", e.answers]);
							}
						});						
					} else if (type === 1) {
						// multiple
						let idx = questions.findIndex((question) => question.id === qid);
						if (idx >= 0) {
							let tmpData = [];
							tmpData.push(questions[idx].question);
							questions[idx].responses.forEach((e) => {
								tmpData.push(e);
								let counter = 0;
								// Now checking for the matching								
								answers.forEach((ans) => {
									if (ans.answers.indexOf(e) >= 0) {
										counter++;
									}
								});
								tmpData.push(counter);
							});													
							typeOneCollection.push(tmpData);
						}													
					} else if (type === 0) {
						// single
						let idx = questions.findIndex((question) => question.id === qid);
						if (idx >= 0) {
							let tmpData = [];
							tmpData.push(questions[idx].question);
							questions[idx].responses.forEach((e) => {
								tmpData.push(e);
								let counter = 0;
								// Now checking for the matching
								answers.forEach((ans) => {
									if (ans.answers.indexOf(e) >= 0) {
										counter++;
									}
								});
								tmpData.push(counter);
							});													
							typeZeroCollection.push(tmpData);
						}
					}
				}
			}			
			setTypeTwoItems(typeTwoCollection);			
			setTypeMultipleItems(typeOneCollection);
			setTypeSingleItems(typeZeroCollection);
		}
	};

	return (
		<div>
			<div className="surveyListViewHeader">				
				Survey Name
				{completedSurveyOption && (<select value={selected + ""} style={{minWidth: "100px", margin: "0px 10px 0px 10px"}} onChange={onSelectedChange}>
					<option value="0"></option>					
					{						
						completedSurveyOption.map((e, i) => {
							if (e.description !== "") {
								return <option value={e.surveyid} key={i}>{e.description}</option>;
							} 
							return <></>
						})
					}					
				</select>)}								
			</div>
			<hr />
			{currentSurvey && (
				<div>
					<div className="analysisHeader">
						<h1>{currentSurvey.description}</h1>
					</div>	
					<div>
						<Table striped bordered>
							<thead>
								<tr>
									<th>Question</th>
									<th>Answer</th>
								</tr>
							</thead>
							<tbody>
								{ typeTwoItems ? (
									typeTwoItems.map((e, i) => {
										if (i === 0) {
											return <tr key={i}><td>{e[0]}</td><td>{e[1]}</td></tr>
										} else {
											return <tr key={i}><td></td><td>{e[1]}</td></tr>
										}
									})
								) : null}
							</tbody>
						</Table>						
						<hr />
						<Table striped bordered>
							<thead>
								{ typeMultipleItems ? (
									typeMultipleItems.map((e, i) => {
										if (i === 0) {
											return (
												<tr key={i}>
													<th>Question</th>
													{
														e[1] ? <th>{e[1]}</th> : null
													}
													{
														e[3] ? <th>{e[3]}</th> : null
													}
													{
														e[5] ? <th>{e[5]}</th> : null
													}
													{
														e[7] ? <th>{e[7]}</th> : null
													}
													{
														e[9] ? <th>{e[9]}</th> : null
													}
													
												</tr>)
										}			
										return null;							
									})
								) : null}
							</thead>
							<tbody>
								{ typeMultipleItems ? (
									typeMultipleItems.map((e, i) => {	
										if (i === 0) {
											return (
												<tr key={i}>
													<td>{e[0]}</td>
													{
														e[2] ? <td>{e[2]}</td> : null
													}
													{
														e[4] ? <td>{e[4]}</td> : null
													}
													{
														e[6] ? <td>{e[6]}</td> : null
													}
													{
														e[8] ? <td>{e[8]}</td> : null
													}
													{
														e[10] ? <td>{e[10]}</td> : null
													}
													
												</tr>)
										} else {
											return (
												<tr key={i}>
													<td></td>
													{
														e[2] ? <td>{e[2]}</td> : null
													}
													{
														e[4] ? <td>{e[4]}</td> : null
													}
													{
														e[6] ? <td>{e[6]}</td> : null
													}
													{
														e[8] ? <td>{e[8]}</td> : null
													}
													{
														e[10] ? <td>{e[10]}</td> : null
													}
													
												</tr>)
										}																
									})
								) : null}
							</tbody>
						</Table>						
						<hr />
						<Table striped bordered>
							<thead>
								{ typeSingleItems ? (
									typeSingleItems.map((e, i) => {
										if (i === 0) {
											return (
												<tr key={i}>
													<th>Question</th>
													{
														e[1] ? <th>{e[1]}</th> : null
													}
													{
														e[3] ? <th>{e[3]}</th> : null
													}
													{
														e[5] ? <th>{e[5]}</th> : null
													}
													{
														e[7] ? <th>{e[7]}</th> : null
													}
													{
														e[9] ? <th>{e[9]}</th> : null
													}
													
												</tr>)
										}			
										return null;							
									})
								) : null}
							</thead>
							<tbody>
								{ typeSingleItems ? (
									typeSingleItems.map((e, i) => {	
										if (i === 0) {
											return (
												<tr key={i}>
													<td>{e[0]}</td>
													{
														e[2] ? <td>{e[2]}</td> : null
													}
													{
														e[4] ? <td>{e[4]}</td> : null
													}
													{
														e[6] ? <td>{e[6]}</td> : null
													}
													{
														e[8] ? <td>{e[8]}</td> : null
													}
													{
														e[10] ? <td>{e[10]}</td> : null
													}
													
												</tr>)
										} else {
											return (
												<tr key={i}>
													<td></td>
													{
														e[2] ? <td>{e[2]}</td> : null
													}
													{
														e[4] ? <td>{e[4]}</td> : null
													}
													{
														e[6] ? <td>{e[6]}</td> : null
													}
													{
														e[8] ? <td>{e[8]}</td> : null
													}
													{
														e[10] ? <td>{e[10]}</td> : null
													}
													
												</tr>)
										}																
									})
								) : null}
							</tbody>
						</Table>							
					</div>			
				</div>
			)}				
		</div>
	)
}

export default AnalysisView;
