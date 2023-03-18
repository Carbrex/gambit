import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
// import { Logo, FormRow } from '../components';
// import Wrapper from '../assets/wrappers/RegisterPage';//css
// import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, registerUser } from '../features/user/userSlice';
// import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const URL = 'http://localhost:5000/api/v1/auth'; // or 'https://localhost:5000/game' if using HTTPS

function Login() {
  const [values, setValues] = useState(initialState);
  const history = useHistory();
  const location = useLocation();
  // const { user, isLoading } = useSelector((store) => store.user);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  const handleRegister = async () => {
    const { name, email, password, isMember } = values;
    if (isMember) {
      const userData = { email, password };
      const response = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log('registered', data);
      return data;
    }
    const userData = { name, email, password };
    console.log(userData);
    const response = await fetch(`${URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    console.log(response);
    const data = await response.json();
    console.log('logged in', data);
    return data;
    // handle the response data
  };
  const onSubmit = async(e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      console.log('Please fill out all fields');
      return;
    }
    const data = await handleRegister();
    console.log(data);
    if (data.token) {
      console.log('here');
      // After receiving the token from the server, store it in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.name);
      console.log(data);
      // Redirect the user back to the previous page
      history.replace(location.state?.from || '/');
    }
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };
  useEffect(() => {
    if (localStorage.getItem('token')&&localStorage.getItem('username')) {
      history.replace('/');
    }
  }, []);
  return (
    <>
      <form className='form' onSubmit={onSubmit}>
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {/* name field */}
        {!values.isMember && (
          <div className='form-row'>
            <label htmlFor='name' className='form-label'>
              Name
            </label>
            <input
              id='name'
              type='text'
              name='name'
              value={values.name}
              onChange={handleChange}
              className='form-input'
            />
          </div>
        )}
        {/* email field */}
        <div className='form-row'>
          <label htmlFor='email' className='form-label'>
            email
          </label>
          <input
            id='email'
            type='email'
            name='email'
            value={values.email}
            onChange={handleChange}
            className='form-input'
          />
        </div>
        {/* password field */}
        <div className='form-row'>
          <label htmlFor='password' className='form-label'>
            password
          </label>
          <input
            id='password'
            type='password'
            name='password'
            value={values.password}
            onChange={handleChange}
            className='form-input'
          />
        </div>
        <button type='submit' className='btn btn-block' >
          submit
          {/* {isLoading ? 'loading...' : 'submit'} */}
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </>
    // </Wrapper>
  );
}
export default Login;