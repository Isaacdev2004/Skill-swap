export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "Registration successful",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  PASSWORD_RESET_SENT: "Password reset email sent",
  PASSWORD_RESET_SUCCESS: "Password reset successful",
  GOOGLE_AUTH_SUCCESS: "Google authentication successful",
} as const;

export const AUTH_ERRORS = {
  EMAIL_EXISTS: "Email already registered",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_SUSPENDED: "Account suspended. Contact support.",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  GOOGLE_AUTH_FAILED: "Google authentication failed",
  PASSWORD_TOO_WEAK: "Password must be at least 8 characters",
} as const;
