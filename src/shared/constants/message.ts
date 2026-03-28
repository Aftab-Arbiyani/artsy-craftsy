const SUCCESS = {
  DEFAULT: 'Record Found',
  FILE_UPLOADED: (file: string) => `${file} uploaded successfully`,
  FILE_UPDATED: (file: string) => `${file} updated successfully`,
  FILE_DELETED: (file: string) => `${file} deleted successfully`,
  SIGN_UP: 'Signup successful',
  COMPLETE_EMAIL_VERIFICATION:
    'Mail Sent to your email Address, Please complete Email verification',
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  RECORD_ADDED: (record: string) => `${record} added successfully`,
  RECORD_CREATED: (record: string) => `${record} created successfully`,
  RECORD_UPDATED: (record: string) => `${record} updated successfully`,
  RECORD_DELETED: (record: string) => `${record} deleted successfully`,
  RECORD_FOUND: (record: string) => `${record} found successfully`,
  RECORD_NOT_FOUND: (record: string) => `${record} not found`,
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET: 'Your password was successfully updated.',
  SUCCESSFULLY: (record: string) => `${record} successfully`,
  CUSTOM_REQUEST_ADDED: 'Request added. We will get back to you soon.',
  FORGOT_PASSWORD_EMAIL_SENT: 'Email sent successfully',
};

const ERROR = {
  SOMETHING_WENT_WRONG: 'Something went wrong.',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  BAD_SYNTAX: 'The request cannot be fulfilled due to bad syntax',
  UNAUTHORIZED: 'Access denied.',
  UNAUTHENTICATED: 'Please log in to access.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  TOO_MANY_REQUESTS:
    'You have reached the limit. Please try again after sometime.',
  VALIDATION: 'Validation Error!',
  WRONG_CREDENTIALS: 'Incorrect email or password.',
  WRONG_PASSWORD: 'Incorrect password.',
  PASSWORD_NOT_MATCH: 'Password & Confirm Password do not match',
  ALREADY_EXISTS: (text: string) => `${text} already exist`,
  EMAIL_NOT_VERIFIED: 'Email verification is pending',
  LINK_EXPIRED: 'This link is expired!',
  FILE_TOO_LARGE: (size: string) =>
    `File too large. Maximum file size allowed is ${size}.`,
  REQUIRED: (name: string) => `${name} is required.`,
  ALLOWED_FILE_TYPE: 'Only JPG, JPEG, or PNG files are allowed!',
  ALLOWED_DOCUMENT_TYPE: 'Only PDF type is allowed!',
  EMAIL_ALREADY_EXIST: 'Email is already registered. Try sign in.',
  RECORD_NOT_FOUND: (text: string) => `${text} not found.`,
  ACCOUNT_IS_BLOCKED: 'Your account is blocked!',
  INVALID_EMAIL: 'Please enter valid email',
  PAYMENT_FAILED: 'Payment failed',
};

export const CONSTANT = {
  SUCCESS: SUCCESS,
  ERROR: ERROR,
};
