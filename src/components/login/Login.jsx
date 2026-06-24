import React, { useContext, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { lex_context } from '../../App';

function Login() {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const {email,setEmail,password,setPassword} = useContext(lex_context)

    const navigate = useNavigate();

    const handleCancel = () => {
        setEmail('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://3kyr2d7fze.execute-api.us-east-1.amazonaws.com/login',
                {
                    email,
                    password,
                }
            );

            console.log(response.data);

            const data =
  typeof response.data.body === "string"
    ? JSON.parse(response.data.body)
    : response.data;

console.log(data);

localStorage.setItem(
  "email",
  data.email
);

const generatedName = data.email
  .split("@")[0]
  .replace(/\./g, " ")
  .replace(/_/g, " ")
  .replace(/-/g, " ")
  .split(" ")
  .map(
    word =>
      word.charAt(0).toUpperCase() +
      word.slice(1)
  )
  .join(" ");

localStorage.setItem(
  "name",
  generatedName
);

localStorage.setItem(
  "designation",
  data.designation
);

localStorage.setItem(
  "team",
  data.team
);

            toast.success('Login Successful');

            setEmail('');
            setPassword('');

            navigate('/user-login');
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Server error');
            }
        }
    };

   return (
  <div className="login-page">
    <div className="login-banner">
      <div className="banner-content">
        <h1>Welcome to IVR Automation</h1>

        <p>
          Manage AWS Lex test sets, execute automated
          conversations, validate bot responses and
          analyze results from a single platform.
        </p>

        <div className="features">
          <div>✓ Upload Test Sets</div>
          <div>✓ Execute Lex Tests</div>
          <div>✓ Analyze Results</div>
          <div>✓ Lex Bots & Files</div>
        </div>
      </div>
    </div>

    <div className="login-section">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            minLength={8}
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel-1"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-create-1"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default Login;