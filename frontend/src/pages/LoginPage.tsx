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
import { useNavigate } from 'react-router';
import { get, post } from '../utils/apiClient';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
	const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value ? null : 'Invalid password'),
    },
  });

	const navigate = useNavigate();

	const { user, setUser } = useUser();
	useEffect(() => {
		if (user) {
			navigate("/dashboard"); // or whatever your login path is
		}
	}, [user, navigate]);

	const handleSubmit = async (values) => {
		const res = await post("/auth/login", values);
		
		if (res.error) {
			handleError(res.error);
			return;
		}

		handleSuccess(res.message);
		localStorage.setItem("token", res.token);

		const userResponse = await get('/user', undefined);
		setUser(userResponse);
	}

  return (
		<Flex>
			<Paper className='w-1/2'>
			</Paper>
			<Paper className='w-1/2 px-32'>
				<Text className='text-center' mb="lg" size="xl">
					Welcome back
				</Text>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput label="Email address" placeholder="hello@gmail.com" size="md" radius="md" key={form.key('email')} {...form.getInputProps('email')}/>
					<PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" key={form.key('password')} {...form.getInputProps('password')}/>
					<Button fullWidth mt="xl" size="md" radius="md" type="submit" className='auth'> 
						Login
					</Button>
				</form>
				<Text ta="center" mt="md">
					Don't have an account?{' '}
					<Anchor href="#" fw={500} onClick={(event) =>{
						event.preventDefault()
						navigate('/register')
						}}>
						Register
					</Anchor>
				</Text>
			</Paper>
		</Flex>
  );
}

export default LoginPage;