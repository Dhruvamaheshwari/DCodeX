
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../authSlice';

// Schema Validation for signup form
const signupSchema = z.object({
  emailId: z.string().email('Invalid Email'),
  password: z
    .string()
    .min(8, 'Password should contain atleast 8 char'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  function submitData(data) {
    dispatch(loginUser(data));
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">

      {/* Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">

        {/* Card Body */}
        <div className="card-body">

          {/* Heading */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-primary">
              DCodeX
            </h1>
            <p className="text-base-content/70 mt-2">
              Create your account
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(submitData)}
            className="flex flex-col gap-4"
          >

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Email
                </span>
              </label>

              <input
                {...register('emailId')}
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />

              {errors.emailId && (
                <p className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Password
                </span>
              </label>

              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="input input-bordered w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <FiEye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className={`btn btn-primary mt-3 text-lg ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              Login
            </button>

            {/* Footer */}
            <p className="text-center text-sm mt-2 text-base-content/70">
              Don't have an account?
              <Link to="/signup" className="text-primary cursor-pointer ml-1 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
