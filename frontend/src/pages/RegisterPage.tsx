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
import { useNavigate } from 'react-router';
import { get, post } from '../utils/apiClient';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

const RegisterPage = () => {
	const form = useForm({
    initialValues: {
			nameFirst: '',
			nameLast: '',
      email: '',
      password: '',
    },

    validate: {
			nameFirst: (value) => (value ? null : 'Invalid first name'),
			nameLast: (value) => (value ? null : 'Invalid last name'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value ? null : 'Invalid password'),
    },
  });

	const navigate = useNavigate();
	const [role, setRole] = useState('Teacher');

	const { user, setUser } = useUser();
	useEffect(() => {
		if (user) {
			navigate("/dashboard"); // or whatever your login path is
		}
	}, [user, navigate]);

	const handleSubmit = async (values) => {
		const res = await post("/auth/register", {...values, role: role.toLowerCase()});
		
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
					Register now
				</Text>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='flex justify-between gap-4 mb-6'>
						<TextInput label="First Name" placeholder="Hyunseo" size="md" radius="md" key={form.key('nameFirst')} {...form.getInputProps('nameFirst')}/>
						<TextInput label="Last Name" placeholder="Son" size="md" radius="md" key={form.key('nameLast')} {...form.getInputProps('nameLast')}/>
					</div>
					<TextInput label="Email address" placeholder="hello@gmail.com" size="md" radius="md" key={form.key('email')} {...form.getInputProps('email')}/>
					<PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" key={form.key('password')} {...form.getInputProps('password')}/>
					<NativeSelect label="Role" data={['Teacher', 'Student']} mt="md" size="md" radius="md" onChange={(e) => setRole(e.target.value)} value={role}/>
					<Button fullWidth mt="xl" size="md" radius="md" type="submit" className='auth'> 
						Register
					</Button>
				</form>
				<Text ta="center" mt="md">
					Already have an account?{' '}
					<Anchor href="#" fw={500} onClick={(event) =>{
						event.preventDefault()
						navigate('/login')
						}}>
						Register
					</Anchor>
				</Text>
			</Paper>
		</Flex>
  );
}

export default RegisterPage;