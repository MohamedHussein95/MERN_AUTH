import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import { useUpdateUserMutation } from '../slices/usersApiSlice';

function ProfileScreen() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [updateUser, { isLoading }] = useUpdateUserMutation();

	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		setFirstName(userInfo.firstName);
		setLastName(userInfo.lastName);
	}, [userInfo, navigate]);

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			if (password !== confirmPassword)
				return toast.error('Passwords do not match !');

			const res = await updateUser({
				firstName,
				lastName,
				password,
			}).unwrap();
			dispatch(setCredentials({ ...res }));
			toast.success('Profile updated');
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};
	return (
		<FormContainer>
			<h1>Update Profile</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className='my-2' controlId='firstName'>
					<Form.Label>First Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter First Name'
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group className='my-2' controlId='lastName'>
					<Form.Label>Last Name </Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter Last Name'
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group className='my-2' controlId='password'>
					<Form.Label>password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group className='my-2' controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Form.Control>
				</Form.Group>
				{isLoading && <Loader />}
				<Button type='submit' variant='primary' className='mt-3'>
					Update
				</Button>
			</Form>
		</FormContainer>
	);
}

export default ProfileScreen;
