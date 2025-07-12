import { useForm } from '@mantine/form';
import { Modal, Button, Text, Group, TextInput, Paper, InputLabel, ActionIcon } from '@mantine/core';
import { handleError, handleSuccess } from '../../utils/handlers';
import { post } from '../../utils/apiClient';
import { useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';

interface AddTopicModalProps {
	opened: boolean,
}

export const AddTopicModal = ({ opened, close }: AddTopicModalProps) => {
	const [emails, setEmails] = useState<string[]>([]);
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
						Add a new topic
					</Text>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<TextInput label="Name" placeholder="Human-environment interactions" size="sm" radius="md" key={form.key('name')} {...form.getInputProps('name')}/>
						<div className='flex justify-between mt-6 mb-4'>
						</div>
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