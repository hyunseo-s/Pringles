import { useForm } from '@mantine/form';
import { Modal, Button, Text, Group, TextInput, Paper, InputLabel, ActionIcon } from '@mantine/core';
import { handleError, handleSuccess } from '../../utils/handlers';
import { post } from '../../utils/apiClient';
import { useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';

interface CreateClassModalProps {
	opened: boolean,
}

export const CreateClassModal = ({ opened, close }: CreateClassModalProps) => {
	const [emails, setEmails] = useState<string[]>([""]);
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			name: '',
			emailAddresses: []
		},

		validate: {
			name: (value) => (value ? null : 'Invalid name'),
		},
	});

		const handleSubmit = async (values) => {
			const res = await post("/smth", values);
			
			if (res.error) {
				handleError(res.error);
				return;
			}
	
			handleSuccess(res.message);
			close();
		}
	
	return (
		<>
			<Modal opened={opened} onClose={close} centered p={'2rem'} size={'lg'}>
				<div className='py-4 px-8'>
					<Text mb="lg" size="xl">
						Create a new class
					</Text>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<TextInput label="Name" placeholder="YEAR 10 Geography" size="sm" radius="md" key={form.key('name')} {...form.getInputProps('name')}/>
						<div className='flex justify-between mt-6 mb-4'>
						 <InputLabel size='sm'>
						 	Email Addresses
						 </InputLabel>
						 <Button 
						 onClick={() => {
									const newEmails = [...emails];
									newEmails.push("");
									setEmails(newEmails);
									console.log(newEmails)
								}}
								size='xs' variant='outline' rightSection={<IconPlus  size={14} 
								color='var(--mantine-color-blue-6)'
								
								aria-label="Gradient action icon"
								/>}>Add Student</Button>
						</div>
						{ emails.map((email, i) => 
							<div className='flex' key={i}>
								<TextInput 
								onChange={(e) => {
									const newEmails = [...emails];
									newEmails[i] = e.target.value;
									setEmails(newEmails);
								}}
								w='100%' placeholder="student@gmail.com" value={email} size="sm" radius="md" mb={'8'} key={i}
								
									rightSectionPointerEvents="none"
        					rightSection={
									<IconX 
									style={{margin: 'auto 0.5rem auto auto'}}
									width={'20px'}
									color='gray'
									size='xs'
									aria-label="Gradient action icon"
									onClick={() => {
										const newEmails = [...emails];
										newEmails.splice(i, 1);
										setEmails(newEmails);
									}}
								 />
							}
								/>
							</div>
						)}
						<div className='flex flex-row-reverse'>
							<Button mt="xl" size="sm" radius="md" type="submit" className='auth'> 
								Submit
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		</>
	);
}
