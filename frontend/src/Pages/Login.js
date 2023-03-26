import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const URL = '/api/v1/auth';

function Login() {
  const [values, setValues] = useState(initialState);
  const [user, setUser] = useState(null);
  const history = useHistory();
  const location = useLocation();
  
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  }
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
      return data;
    }
    if (name.length<2) {
      toast.error('Name should have atleast 2 characters');
      return;
    }
    if (!validatePassword(password)) {
      toast.error('Password should have atleast 8 characters and consist of atleast one character, one number and a special character');
      return;
    }
    const userData = { name, email, password };
    const response = await fetch(`${URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
    // handle the response data
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      console.log('Please fill out all fields');
      toast.error('Please fill out all fields');
      return;
    }
    const data = await handleRegister();
    if (data.msg) {
      toast.error(data.msg);
    }
    if (data.token) {
      // After receiving the token from the server, store it in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.name);
      // Redirect the user back to the previous page
      history.replace(location.state?.from || '/');
    }
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };
  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('username')) {
      toast.success('You are already logged in!');
      setUser(localStorage.getItem('username'));
      setTimeout(() => {
        history.replace('/');
      }, 3000);
    }
  }, []);
  return (
    <>
      {user && <h2>Already logged in as {user}</h2>}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {!user &&
        <div>
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
            </button>
            <p>
              {values.isMember ? 'Not a member yet?' : 'Already a member?'}
              <button type='button' onClick={toggleMember} className='btn single-mode'>
                {values.isMember ? 'Register' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      }
    </>
  );
}
export default Login;