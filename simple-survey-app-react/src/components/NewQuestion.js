import React, {useState} from 'react';
import './NewQuestion.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

function NewQuestion({questionSave}) {
	const [questionType, setQuestionType] = useState(0);
	const [question, setQuestion] = useState("");
	const [answers, setAnswers] = useState([]);
	
	const onNumberOfResponseChange = (e) => {
		let value = e.target.value;
		if (isNaN(value)) {
			alert("Please entered the valid number from (1-5)");
		} else {
			value = parseInt(value, 10);
			if (value <= 0 || value > 5) {
				alert("Please entered the valid number from (1-5)");
			} else {
				let arr = [];
				for (let i = 0; i < value; i++) {
					arr.push("");
				}
				setAnswers(arr);
			}
		}
	};

	const onResponseOptionChange = (e) => {		
		let idx = parseInt(e.target.id, 10);
		let current = [...answers];
		current[idx] = e.target.value;
		setAnswers(current);
	};

	const onSaveQuestion = () => {
		// Check if all the data has entered
		var bValid = true;
		if (questionType !== "2" && answers.length > 0) {
			answers.forEach((e) => {
				bValid = bValid && e !== "";
			})
		} else if (questionType === "2") {
			setAnswers([]);
		}
		if (!bValid) {
			alert("Please make sure all the fields have been completed.");
		} else {
			// Save the question to the collection
			questionSave({
				id: "", // there is no is yet, until the survey is saved
				type: parseInt(questionType, 10),
				question: question,
				responses: answers
			});
			// Clear the options
			setQuestionType("1");
			setQuestion("");
			setAnswers([]);
		}
	};

	return (
		<div>
			<fieldset className="scheduler-border">
				<legend className="scheduler-border">Add Questions Here:</legend>				
				<div>
					<span>Question type:</span>{' '}
					<select onChange={(e) => setQuestionType(e.target.value)}>
						<option value="0">Single</option>
						<option value="1">Multiple</option>
						<option value="2">Free text</option>
					</select>
				</div>
				{
					(questionType !== "2") && (
					<InputGroup className="mb-3 mt-3">
						<InputGroup.Prepend>
							<InputGroup.Text>Number of responses (1 - 5): </InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl value={answers.length} onChange={onNumberOfResponseChange} />
					</InputGroup>)
				}
				<InputGroup className="mt-3">
					<InputGroup.Prepend>
						<InputGroup.Text>Question:</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl as="textarea" aria-label="With textarea" value={question} onChange={(e) => setQuestion(e.target.value)} />
				</InputGroup>	
				{
					(questionType !== "2") && (
						answers.map((e, i) => {
							return <FormControl key={i} id={i + ""} className="mt-1" onChange={onResponseOptionChange}></FormControl>
						})
					)
				}		
				<Button className="mt-3" onClick={onSaveQuestion}>SAVE QUESTION</Button>				
			</fieldset>	
		</div>
	)
}

export default NewQuestion;
