export const resetPasswordTemplate = (resetLink) => `
  <h3>Password Reset Request</h3>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
  <p>This link will expire in 1 hour.</p>
`;


export const loginSuccessTemplate = (name) => `
  <h2>Welcome back, ${name}!</h2>
  <p>You have successfully logged in to <strong>TimePro</strong>.</p>
  <p>If this wasn’t you, please reset your password immediately.</p>
`;

