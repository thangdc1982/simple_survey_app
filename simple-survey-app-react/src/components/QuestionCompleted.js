import React from 'react';
import Form from 'react-bootstrap/Form';

function QuestionCompleted({response, answers}) {		
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
									return <Form.Check disabled key={i} type="radio" label={v} name={response.id} checked={v === answers[i]}></Form.Check>
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
								response.responses.map((v, i) => {                                    
									return <Form.Check disabled key={i} type="checkbox" label={v} checked={v === answers[i]}></Form.Check>
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
						<Form.Control type="text" readOnly value={answers}></Form.Control>
					</Form>
				</div>)
			}			
		</div>
	)
}

export default QuestionCompleted;
