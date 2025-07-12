import { useForm } from '@mantine/form';
import { Modal, Button, Text, TextInput, InputLabel, Fieldset, NativeSelect, Flex } from '@mantine/core';
import { handleError, handleSuccess } from '../../utils/handlers';
import { post } from '../../utils/apiClient';
import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';

interface AddTopicModalProps {
	opened: boolean,

}

type Questions = {
	question: string,
	type: string
}

export const AddTopicModal = ({ opened, close }: AddTopicModalProps) => {
	const [questions, setQuestions] = useState<Questions[]>([]);

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: ''
		},

		validate: {
			name: (value) => (value ? null : 'Invalid name'),
		},
	});

	const handleSubmit = async () => {
		console.log(questions);
		// const res = await post("/smth", questions);
		
		// if (res.error) {
		// handleError(res.error);
		// 	return;
		// }

		// handleSuccess(res.message);
		setQuestions([]);
		form.reset();
		close();
	}
	
	return (
		<>
			<Modal opened={opened} onClose={close} centered p={'2rem'} size={'lg'}>
				<div className='py-4 px-8'>
					<Text mb="lg" size="xl">
						Add a new topic
					</Text>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<TextInput label="Name" placeholder="Human Environment Interactions" size="sm" radius="md" key={form.key('name')} {...form.getInputProps('name')}/>
						<div className='flex justify-between mt-6 mb-4'>
							<InputLabel size='sm'>
								Questions
							</InputLabel>
							<Button 
						 		onClick={() => {
									const newQuestions = [...questions];
									newQuestions.push({ question: "", type: ""});
									setQuestions(newQuestions);
								}}
								size='xs' variant='outline' rightSection={<IconPlus  size={14} 
								color='var(--mantine-color-blue-6)'
								
								aria-label="Gradient action icon"
								/>}
							>
								Add Question
							</Button>
						</div>
						{
							questions.map((q, i) => {
								const label = `Question ${i + 1}`
								return (
									<Fieldset mt="xs">
										<Flex gap="md">
											<TextInput 
												label={label} 
												w='65%' 
												placeholder="What is 2 + 2?" 
												value={q.question}
												onChange={(e) => {
													const newQuestions = [...questions];
													newQuestions[i].question = e.target.value;
													setQuestions(newQuestions);
												}}
											/>
											<NativeSelect 
												label="Type"
												value={q.type}
												onChange={(e) => {
													const newQuestions = [...questions];
													newQuestions[i].type = e.target.value;
													setQuestions(newQuestions);
												}}
											>
												<option value="" disabled>Select type</option>
												<hr />
												<option value={"multiple"}>Multiple Choice</option>
												<option value={"written answer"}>Short Answer</option>
											</NativeSelect>
										</Flex>
									</Fieldset>
						  		);
							})
						}
						<div className='flex flex-row-reverse'>
							<Button mt="xl" size="sm" radius="md" type="submit" className='auth' disabled={
								questions.some(q => !q.question.trim() || !q.type.trim()) || form.values.name === ''
							}> 
								Submit
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}