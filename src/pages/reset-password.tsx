import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface ResetResponse {
  success: boolean;
  message: string;
}

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'loading' | 'form' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [tokenValid, setTokenValid] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    if (token) {
      validateToken(token as string);
    }
  }, [token]);

  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const validateToken = async (resetToken: string) => {
    setLoading(true);
    try {
      // Simulate token validation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - replace with actual API call
      const isValid = resetToken === 'mock-reset-token-123' || resetToken.length > 10;
      
      if (isValid) {
        setTokenValid(true);
        setStep('form');
      } else {
        setStep('expired');
        setMessage('This password reset link is invalid or has expired.');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setStep('error');
      setMessage('Failed to validate reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?\":{}|<>]/.test(password)
    });
  };

  const getPasswordStrengthScore = (): number => {
    const { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar } = passwordStrength;
    return [minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  };

  const getPasswordStrengthLabel = (): { label: string; color: string } => {
    const score = getPasswordStrengthScore();
    if (score < 2) return { label: 'Weak', color: 'text-red-600' };
    if (score < 4) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Strong', color: 'text-green-600' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API response - replace with actual API call
      const response: ResetResponse = {
        success: true,
        message: 'Your password has been successfully reset!'
      };

      if (response.success) {
        setStep('success');
        setMessage(response.message);
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin?message=Password reset successful');
        }, 3000);
      } else {
        setStep('error');
        setMessage(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setStep('error');
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderLoadingStep = () => (
    <div className="fade-in text-center">
      <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <div className="loading-spinner w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Reset Link</h1>
      <p className="text-gray-600">Please wait while we verify your password reset link...</p>
    </div>
  );

  const renderFormStep = () => (
    <div className="fade-in">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Key className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Create a new strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div>
          <label htmlFor="password" className="label">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              className={`input-field pr-12 ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.password}
            </p>
          )}

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Password Strength</span>
                <span className={`text-sm font-medium ${getPasswordStrengthLabel().color}`}>
                  {getPasswordStrengthLabel().label}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }}
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  8+ characters
                </div>
                <div className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Uppercase letter
                </div>
                <div className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Lowercase letter
                </div>
                <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Number
                </div>
                <div className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'} col-span-2`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Special character (!@#$%^&*)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input-field pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Confirm your new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || getPasswordStrengthScore() < 3}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="loading-spinner w-5 h-5 mr-2" />
              Resetting Password...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5 mr-2" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="fade-in text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Your password has been successfully updated. You can now sign in with your new password.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-green-800">
          You will be redirected to the sign-in page automatically in a few seconds...
        </p>
      </div>

      <Link href="/auth/signin" className="btn-primary">
        Go to Sign In
      </Link>
    </div>
  );

  const renderExpiredStep = () => (
    <div className="fade-in text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Expired</h1>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message || 'This password reset link has expired or is invalid.'}
      </p>

      <div className="space-y-4">
        <Link href="/forgot-password" className="btn-primary w-full">
          Request New Reset Link
        </Link>
        <Link href="/auth/signin" className="btn-ghost w-full">
          Back to Sign In
        </Link>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="fade-in text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message || 'We encountered an error while resetting your password.'}
      </p>

      <div className="space-y-4">
        <button
          onClick={() => setStep('form')}
          className="btn-primary w-full"
        >
          Try Again
        </button>
        <Link href="/forgot-password" className="btn-secondary w-full">
          Request New Reset Link
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          {step === 'loading' && renderLoadingStep()}
          {step === 'form' && renderFormStep()}
          {step === 'success' && renderSuccessStep()}
          {step === 'expired' && renderExpiredStep()}
          {step === 'error' && renderErrorStep()}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? {' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
