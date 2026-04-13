import React, { useState } from 'react';
import bannerImage from '../../../assets/register_banner.webp';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { handleLogin } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({
                email: formData.email,
                password: formData.password
            });
            console.log("Login successful");
            navigate("/");
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-['Inter']">

            {/* Left Banner Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black">
                <img
                    src={bannerImage}
                    alt="Voidwear Banner"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">

                    <div className="text-center lg:text-left">
                        <h2 className="lg:hidden text-3xl font-extrabold tracking-tight mb-4 font-['Montserrat'] uppercase">Voidwear</h2>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h3>
                        <p className="mt-1 sm:mt-2 text-sm text-gray-600">Sign in to your account.</p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-black py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-transform active:scale-[0.98]"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-600 pt-4">
                        Don't have an account?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            className="font-semibold text-black hover:underline cursor-pointer"
                        >
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;