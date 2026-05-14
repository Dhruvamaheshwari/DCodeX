
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema Validation for signup form
const signupSchema = z.object({
  firstName: z.string().min(3, 'Name should contain atleast 3 char'),
  email: z.string().email('Invalid Email'),
  password: z
    .string()
    .min(8, 'Password should contain atleast 8 char'),
});

const Signup = () => {
  const {register,handleSubmit,formState: { errors },} = useForm({
    resolver: zodResolver(signupSchema),
  });


  function submitData(data) {
    console.log(data);

    // yahi se backend ko data send krna theek hoga ki nhi
      
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
            
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Full Name
                </span>
              </label>

              <input
                {...register('firstName')}
                type="text"
                placeholder="Enter your name"
                className="input input-bordered w-full"
              />

              {errors.firstName && (
                <p className="text-error text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Email
                </span>
              </label>

              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />

              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
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

              <input
                {...register('password')}
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full"
              />

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary mt-3 text-lg"
            >
              Sign Up
            </button>

            {/* Footer */}
            <p className="text-center text-sm mt-2 text-base-content/70">
              Already have an account?
              <span className="text-primary cursor-pointer ml-1 hover:underline">
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
