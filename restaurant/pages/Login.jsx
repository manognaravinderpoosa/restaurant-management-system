// import React, { useState } from 'react';
// import { FiEye, FiEyeOff } from 'react-icons/fi';
// import './Login.css';

// const Login = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         onLogin(); // Triggers redirect
//       } else {
//         setError(data.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     }
//   };

//   const handleForgotPassword = async () => {
//     const enteredUsername = prompt('Enter your username:');
//     const newPassword = prompt('Enter a new password:');

//     if (!enteredUsername || !newPassword) {
//       alert('Both fields are required.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username: enteredUsername, newPassword }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert('Password updated successfully!');
//       } else {
//         alert(data.message || 'Password reset failed.');
//       }
//     } catch (err) {
//       alert('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-box">
//         <img src="/logo.jpg" alt="Logo" className="login-logo" />
//         <h2>Welcome Back</h2>
//         <p className="subtext">Admin Login</p>

//         <form onSubmit={handleLogin}>
//           <div className="input-with-icon">
//             <input
//               type="text"
//               placeholder="Enter username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-with-icon password-field">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span
//               className="toggle-password"
//               onClick={() => setShowPassword((prev) => !prev)}
//               title={showPassword ? 'Hide password' : 'Show password'}
//             >
//               {showPassword ? <FiEyeOff /> : <FiEye />}
//             </span>
//           </div>

//           <button type="submit">Sign In</button>
//         </form>

//         <p className="forgot-link" onClick={handleForgotPassword}>
//           Forgot Password?
//         </p>

//         {error && <p className="error-text">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;
