import { useForm } from '@mantine/form';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';

const RegisterPage = () => {
	const RegisterForm = () => {
		return (
			<Paper className='w-1/2 px-32 py-32'>
				<Text className='text-center' mb="lg" size="xl">
					Create account
				</Text>
				<TextInput label="Email address" placeholder="hello@gmail.com" size="md" radius="md" />
				<PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" />
				<Button fullWidth mt="xl" size="md" radius="md">
					Register
				</Button>
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