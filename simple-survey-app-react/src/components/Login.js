import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from "../firebase";

function Login({signIn}) {
	const history = useHistory();

	const [userName,setUserName] = useState("");
	const [password,setPassword] = useState("");
	const [validUsername, setValidUsername] = useState(true);
	const [validPassword, setValidPassword] = useState(true);

	const dispatch = useDispatch();	

	useEffect(() => {
		setValidUsername(true);
		setValidPassword(true);
	}, []);

	const loginClickHandler = (e) => {
		e.preventDefault();						
		if (!userName || !password) {			
			if (!userName) {
				setValidUsername(false);
			}
			if (!password) {
				setValidPassword(false);
			}
		} else {			
			auth.signInWithEmailAndPassword(userName, password)
				.then((userCredential) => {
					// Signed in 
					let authUser = userCredential.user;					
					if (authUser.email.indexOf("admin") >= 0) {
						authUser.role = 1;
					} else if (authUser.email.indexOf("manager") >= 0) {
						authUser.role = 2;
					} else {
						authUser.role = 3;
					}									
					dispatch(signIn(authUser));
					history.push('/dashboard');
				})
				.catch((error) => {
					alert(error.code + ": " + error.message);
					history.push('/');				
				});
		}		
	};

	const registerClickHandler = (e) => {
		e.preventDefault();						
		if (!userName || !password) {			
			if (!userName) {
				setValidUsername(false);
			}
			if (!password) {
				setValidPassword(false);
			}
		} else {		
			auth.createUserWithEmailAndPassword(userName, password)
				.then((userCredential) => {
					// Signed in 
					let authUser = userCredential.user;
					authUser.role = 3;					
					dispatch(signIn(authUser));
					history.push('/dashboard');
				})
				.catch((error) => {
					alert(error.code + ": " + error.message);
					history.push('/');				
				});
			
		}
	}

	return (
		<Container>
		<h1 style={{color: "green", fontWeight: "bold"}} align="center">Welcome</h1>
		<Form>
			<Form.Group controlId="formBasicEmail">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" onChange={(e) => setUserName(e.target.value)} />
				{!validUsername && <Form.Text className="text-danger">
					Please make sure provide the valid email address.
				</Form.Text>}
			</Form.Group>

			<Form.Group controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
				{!validPassword && <Form.Text className="text-danger">
					Please make sure provide the valid password
				</Form.Text>}
			</Form.Group>			
			<Button variant="primary" type="submit" onClick={loginClickHandler} className="mr-3">
				Login
			</Button>	
			<Button variant="info" type="submit" onClick={registerClickHandler}>
				Register
			</Button>		
		</Form>
		</Container>
	)
}

export default Login;