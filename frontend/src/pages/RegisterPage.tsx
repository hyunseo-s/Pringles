import {
  Anchor,
  Button,
  Flex,
  NativeSelect,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { handleError, handleSuccess } from '../utils/handlers';
import { post } from '../utils/apiClient';
import { useNavigate } from 'react-router';

const RegisterPage = () => {

	const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
			nameFirst: '',
			nameLast: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value ? null : 'Invalid password'),
			nameFirst: (value) => (value ? null : 'Invalid first name'),
			nameLast: (value) => (value ? null : 'Invalid last name'),
    },
  });

	const navigate = useNavigate();

	const handleSubmit = async (values) => {
		const res = await post("/auth/register", values);
		
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
			<Paper className='w-1/2 px-32 py-16'>
				<Text className='text-center' mb="lg" size="xl">
					Create account
				</Text>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='flex gap-6 justify-between mb-4'>
						<TextInput label="First name" placeholder="John" size="sm" radius="md" key={form.key('nameFirst')} {...form.getInputProps('nameFirst')}/>
						<TextInput label="Last name" placeholder="Smith" size="sm" radius="md" key={form.key('nameLast')} {...form.getInputProps('nameLast')}/>
					</div>
					<TextInput label="Email address" placeholder="hello@gmail.com" size="sm" radius="md" key={form.key('email')} {...form.getInputProps('email')}/>
					<PasswordInput label="Password" placeholder="Your password" mt="md" size="sm" radius="md" key={form.key('password')} {...form.getInputProps('password')}/>

					 <NativeSelect
					 		style={{marginTop: '1rem'}}
					 		key={form.key('role')} {...form.getInputProps('role')}
					 		label='Role'
							data={['Teacher', 'Student']}
						/>
					<Button fullWidth mt="xl" size="sm" radius="md" type="submit">
						Register
					</Button>
				</form>
				<Text ta="center" mt="md">
					Already have an account?{' '}
					<Anchor href="#" fw={500} onClick={(event) =>{
						navigate('/login')
						event.preventDefault()}}>
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