import React from 'react';
import Form from 'react-bootstrap/Form';

function QuestionReview({response, onAnswer}) {		

	const onTextChange = (e) => {		
		onAnswer(response, e.target.value, e.target.id);
	}

	const onOptionChange = (e) => {		
		onAnswer(response, e.target.checked, e.target.id);
	}

	return (
		<div>			
			<h3>{response.question}</h3>
			{
				(response.type === 0) && (<div>
					<label>Check all answers that apply</label>
					{
						<Form>
							{
								response.responses.map((v, i) => {									
									return <Form.Check key={i} type="radio" label={v} name={response.id} id={response.id + "_" + i} onChange={onOptionChange}></Form.Check>
								})
							}
						</Form>
					}					
				</div>)
			}
			{
				(response.type === 1) && (<div>
					<label>Check answer that applies</label>
					{
						<Form>
							{
								response.responses.map((value, index) => {
									return <Form.Check key={index} type="checkbox" label={value} id={response.id + "_" + index} onChange={onOptionChange}></Form.Check>
								})								
							}
						</Form>
					}	
				</div>)
			}
			{
				(response.type === 2) && (<div>
					<label>Please enter your response</label>
					<Form>
						<Form.Check type="text" onChange={onTextChange} id={response.id}></Form.Check>
					</Form>
				</div>)
			}			
		</div>
	)
}

export default QuestionReview;
