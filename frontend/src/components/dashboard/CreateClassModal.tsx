import { useForm } from '@mantine/form';
import { Modal, Button, Checkbox, Group, TextInput } from '@mantine/core';

interface CreateClassModalProps {
	opened: boolean,
}

export const CreateClassModal = ({ opened, close }: CreateClassModalProps) => {

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			email: '',
			termsOfService: false,
		},

		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
		},
	});
	
	return (
		<>
			<Modal opened={opened} onClose={close} title="Add Class" centered>
				<form onSubmit={form.onSubmit((values) => console.log(values))}>
				<TextInput
					withAsterisk
					label="Email"
					placeholder="your@email.com"
					key={form.key('email')}
					{...form.getInputProps('email')}
				/>
				<Checkbox
					mt="md"
					label="I agree to sell my privacy"
					key={form.key('termsOfService')}
					{...form.getInputProps('termsOfService', { type: 'checkbox' })}
				/>
				<Group justify="flex-end" mt="md">
					<Button type="submit">Submit</Button>
				</Group>
			</form>
			</Modal>
		</>
	);
}
