import{ useState } from 'react';
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
                        <a href="#" className="font-semibold text-black hover:underline cursor-pointer">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
