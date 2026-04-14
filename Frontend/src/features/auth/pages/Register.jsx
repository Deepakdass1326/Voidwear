import { useState } from 'react';
import bannerImage from '../../../assets/register_banner.webp';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';






const Register = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        contact: '',
        password: '',
        isSeller: false,
    });

    const { handleRegister } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister({
                email: formData.email,
                contact: formData.contact,
                password: formData.password,
                fullname: formData.fullname,
                isSeller: formData.isSeller
            });
            console.log("Registration successful");

        } catch (error) {
            console.error("Registration failed", error);
        }
        navigate("/")

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
                <div className="w-full max-w-lg space-y-6">

                    <div className="text-center lg:text-left">
                        <h2 className="lg:hidden text-3xl font-extrabold tracking-tight mb-4 font-['Montserrat'] uppercase">Voidwear</h2>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Create an account</h3>
                        <p className="mt-1 sm:mt-2 text-sm text-gray-600">Start your journey with us today.</p>
                    </div>

                    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="fullname">
                                    Full Name
                                </label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    required
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email Options */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="email">
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

                            {/* Contact */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="contact">
                                    Contact Number
                                </label>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    required
                                    value={formData.contact}
                                    onChange={handleChange}
                                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="password">
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

                        {/* isSeller Checkbox */}
                        <div className="flex items-center mt-2">
                            <input
                                id="isSeller"
                                name="isSeller"
                                type="checkbox"
                                checked={formData.isSeller}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                            />
                            <label htmlFor="isSeller" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                                I want to register as a Seller
                            </label>
                        </div>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-gray-50 px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <a
                            href="http://localhost:5000/api/auth/google"
                            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-transform active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </a>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-black py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-transform active:scale-[0.98]"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-xs text-gray-600 pb-2">
                        Already have an account?{' '}
                        <span 
                            onClick={() => navigate('/login')} 
                            className="font-semibold text-black hover:underline cursor-pointer"
                        >
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
