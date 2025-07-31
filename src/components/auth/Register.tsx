import { useRegisterMutation } from "@/featrues/user/userApi";
import { useForm } from "react-hook-form";
import img from "../../assets/Screenshot_21.png";
import { NavLink } from "react-router";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser({ name: data.name, email: data.email, password: data.password }).unwrap();
      alert("Registered successfully!");
      // Optionally navigate to login or dashboard
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Illustration */}
      <div className="w-full md:w-1/2 bg-[#0f172a] flex items-center justify-center">
        <img src={img} alt="To-do illustration" className="w-[90%]" />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5">
          <h2 className="text-3xl font-bold text-center">Sign Up</h2>
          <p className="text-center text-gray-500 mb-4">
            To Create Account, Please Fill in the Form Below.
          </p>

          {/* Full Name */}
          <div>
            <input
              {...register("name", { required: "Full name is required" })}
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address"
                }
              })}
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              })}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              type="password"
              placeholder="Retype password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>

          {/* Error */}
          {error && <p className="text-red-500 text-center mt-2">Registration failed. Please try again.</p>}

          {/* Log in Link */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink to="/login" className="font-semibold text-black cursor-pointer hover:underline">
              Log In
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
