export const resetPasswordTemplate = (resetLink) => `
  <h3>Password Reset Request</h3>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
  <p>This link will expire in 1 hour.</p>
`;
