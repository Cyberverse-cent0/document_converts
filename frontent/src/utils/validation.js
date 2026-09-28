export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateFile = (file) => {
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a PDF or Word document',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 50MB',
    };
  }

  return { valid: true };
};

export const validateForm = (values, rules) => {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    } else if (rule.email && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
