import {
  Anchor,
  Button,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';

const LoginPage = () => {
	const LoginForm = () => {
		return (
			<Paper className='w-1/2 px-32 py-32'>
				<Text className='text-center' mb="lg" size="xl">
					Welcome back
				</Text>
				<TextInput label="Email address" placeholder="hello@gmail.com" size="md" radius="md" />
				<PasswordInput label="Password" placeholder="Your password" mt="md" size="md" radius="md" />
				<Button fullWidth mt="xl" size="md" radius="md">
					Login
				</Button>
				<Text ta="center" mt="md">
					Don't have an account?{' '}
					<Anchor href="/register" fw={500} onClick={(event) => event.preventDefault()}>
						Register
					</Anchor>
				</Text>
			</Paper>
		);
	}

  return (
		<Flex>
			<Paper className='w-1/2'>
			</Paper>
			<LoginForm />
		</Flex>
  );
}

export default LoginPage;