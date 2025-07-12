import {
  Anchor,
  Button,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { handleError, handleSuccess } from '../utils/handlers';
import { post } from '../utils/apiClient';

const RegisterPage = () => {

	const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
			username: '',
			name: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value ? null : 'Invalid password'),
			username: (value) => (value ? null : 'Invalid username'),
			name: (value) => (value ? null : 'Invalid name'),
    },
  });

	const navigate = useNavigate();

	const handleSubmit = async (values) => {
		const res = await post("/auth/registers", values);
		
		if (res.error) {
			handleError(res.error);
			return;
		}

		handleSuccess(res.message);
		localStorage.setItem("token", res.token);
		navigate('/dashboard')
	}

	const RegisterForm = () => {
		return (
			<Paper className='w-1/2 px-32 py-32'>
				<Text className='text-center' mb="lg" size="xl">
					Create account
				</Text>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput label="Email address" placeholder="hello@gmail.com" size="md" radius="md" key={form.key('email')} {...form.getInputProps('email')}/>
					<PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" key={form.key('password')} {...form.getInputProps('password')}/>
					<Button fullWidth mt="xl" size="md" radius="md" type="submit">
						Register
					</Button>
				</form>
				<Text ta="center" mt="md">
					Already have an account?{' '}
					<Anchor href="/login" fw={500} onClick={(event) => event.preventDefault()}>
						Login
					</Anchor>
				</Text>
			</Paper>
			);
	}

  return (
		<Flex>
			<Paper className='w-1/2'>
			</Paper>
			<RegisterForm />
		</Flex>
  );
}

export default RegisterPage;