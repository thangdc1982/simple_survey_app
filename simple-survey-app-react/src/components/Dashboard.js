import React, { useEffect } from 'react';
import './Dashboard.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import SurveyListView from './SurveyListView';
import NewSurvey from './NewSurvey';
import AnalysisView from './AnalysisView';
import CompletedSurveys from './CompletedSurveys';
import {  
  Switch,
  Route,
  Link,  
  useRouteMatch	
} from "react-router-dom";
import { fetchSurveys } from '../actions/SurveyActions';
import { fetchQuestions } from '../actions/QuestionActions';
import { fetchCompleteSurvey } from '../actions/CompleteSurveyAction';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { auth } from "../firebase";
import db from '../firebase';

function Dashboard() {
	let { path, url } = useRouteMatch();

	const history = useHistory();

	const currentUser = useSelector(state => state.user.user);			

	const dispatch = useDispatch();

	useEffect(() => {	
		const getData = async (i_sCollectionName) => {
			const snapshot = await db.collection(i_sCollectionName).get();
			return snapshot.docs.map(doc => doc.data());						
		};
		auth.onAuthStateChanged(authUser => {
			if (!authUser) {
				history.push("/");
			}
		});
		// checking for the user login event change
		try {					
			getData("surveys").then((result) => {
				dispatch(fetchSurveys(result));
			});
			getData("questions").then((result) => {
				dispatch(fetchQuestions(result));
			});
			getData("completedSurveys").then((result) => {
				dispatch(fetchCompleteSurvey(result));
			});			
		} catch (error) {
			
		} 			
	}, [dispatch, history])

	return (
		currentUser ? (<div>			
			<div className="dashboardHeader">					
				<h1>Simple Survey Application</h1>
			</div>					
			<Navbar bg="dark" variant="dark">
				<Navbar.Brand>
					<img src={process.env.PUBLIC_URL + '/Logo.png'} alt="Simple Survey"></img>{' '}
					Welcome, { currentUser ? currentUser.email : "user"}
				</Navbar.Brand>	
				<Nav className="ml-auto">
					<Link to={`${url}/viewsurvey`} className="mr-3">View Survey</Link>
					{currentUser && currentUser.role === 1 && <Link to={`${url}/createsurvey`} className="mr-3">Create New Survey</Link>}
					{currentUser && currentUser.role !== 3 && <Link to={`${url}/viewanalysis`} className="mr-3">View Analysis</Link>}
					{currentUser && currentUser.role === 3 && <Link to={`${url}/completedsurvey`} className="mr-3">View Completed Survey</Link>}
				</Nav>
			</Navbar>	
			<hr />	
			<div>
			<Switch>						
				<Route path={`${path}/viewsurvey`}>
					<SurveyListView></SurveyListView>
				</Route>
				<Route path={`${path}/createsurvey`}>
					<NewSurvey></NewSurvey>
				</Route>
				<Route path={`${path}/viewanalysis`}>
					<AnalysisView></AnalysisView>
				</Route>
				<Route path={`${path}/completedsurvey`}>
					<CompletedSurveys></CompletedSurveys>
				</Route>
			</Switch>
			</div>
		</div>) : <></>
	)
}

export default Dashboard;