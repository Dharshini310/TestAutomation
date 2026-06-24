import React, {
    useContext,
    useEffect,
    useState,
    useRef
} from 'react';

import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import { lex_context } from '../../App';

function UserLogin() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        storedEmail,
        setStoredEmail,
        isLoggedIn,
        setIsLoggedIn
    } = useContext(lex_context);

    const [showProfile, setShowProfile] = useState(false);

    const profileRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail =
            localStorage.getItem('email');

        if (savedEmail) {
            setStoredEmail(savedEmail);
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setShowProfile(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const emailName = storedEmail
        ? storedEmail.split('@')[0]
        : '';

    const handleLogout = () => {
        localStorage.removeItem('email');

        setStoredEmail('');
        setIsLoggedIn(false);
        setShowProfile(false);

        toast.success(
            'Logged out successfully'
        );

        navigate('/login');
    };

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

            const loggedInEmail =
                response.data.email || email;

            localStorage.setItem(
                'email',
                loggedInEmail
            );

            setStoredEmail(loggedInEmail);
            setIsLoggedIn(true);

            toast.success(
                'Login Successful'
            );

            setEmail('');
            setPassword('');
        } catch (error) {
            if (error.response) {
                toast.error(
                    error.response.data.message
                );
            } else {
                toast.error('Server error');
            }
        }
    };

    return (
        <>
            <div className="login-container">

                <div className="login-right">
                    <h3>IVR Automation</h3>
                </div>

                {isLoggedIn ? (
                    <div
                        className="user-menu"
                        ref={profileRef}
                    >
                        <div
                            className="user-profile"
                            onClick={() =>
                                setShowProfile(
                                    !showProfile
                                )
                            }
                        >
                            <div className="avatar">
                                {emailName
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>
                        </div>

                        {showProfile && (
                            <div className="profile-popup">

                                <div className="profile-popup-avatar">
                                    {emailName
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <h3>
                                    {emailName.toUpperCase()}
                                </h3>

                                <div className="popup-info">
                                    <label>
                                        Name
                                    </label>
                                    <span>
                                        {emailName.toUpperCase()}
                                    </span>
                                </div>

                                <div className="popup-info">
                                    <label>
                                        Email
                                    </label>
                                    <span>
                                        {storedEmail}
                                    </span>
                                </div>

                                <div className="popup-info">
                                    <label>
                                        Designation
                                    </label>
                                    <span>
                                        {localStorage.getItem(
                                            'designation'
                                        ) || 'N/A'}
                                    </span>
                                </div>

                                <div className="popup-info">
                                    <label>
                                        Team
                                    </label>
                                    <span>
                                        {localStorage.getItem(
                                            'team'
                                        ) || 'N/A'}
                                    </span>
                                </div>

                                <button
                                    className="logout-btn"
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>
                ) : (
                    <div className="login-left">
                        <p>Login</p>
                    </div>
                )}
            </div>

            {!isLoggedIn && (
                <div className="login-form">
                    <form
                        onSubmit={handleLogin}
                    >
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            required
                            minLength={8}
                        />

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-cancel-1"
                                onClick={
                                    handleCancel
                                }
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
            )}

            {isLoggedIn && <Sidebar />}
        </>
    );
}

export default UserLogin;