import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";
import { useGoogleLogin } from "@react-oauth/google";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Sparkles,
    ArrowRight,
    Home,
    User,
    GraduationCap,
    Users,
    BookOpen,
    ShoppingBag,
    Building2,
    AlertCircle,
    ArrowLeft,
    Target,
    Clock,
    ShieldAlert,
} from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pendingModal, setPendingModal] = useState(null);
    const [showTeacherModal, setShowTeacherModal] = useState(false);

    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const handleGoogleLogin = useGoogleLogin({
        // Note: The app name shown in Google OAuth consent screen is configured in Google Cloud Console
        // Go to: APIs & Services > OAuth consent screen > Edit App > App name: "Wise Student"
        // 
        // IMPORTANT: For production, ensure your production domain is added to:
        // Google Cloud Console > APIs & Services > Credentials > [Your OAuth Client ID] > 
        // Authorized JavaScript origins: https://your-production-domain.com
        // See GOOGLE_OAUTH_FIX.md for detailed instructions
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);
                setError("");

                // Send the Google access token to your backend
                const response = await api.post(`/api/auth/google`, {
                    accessToken: tokenResponse.access_token,
                });

                const { token, user } = response.data;
                localStorage.setItem("finmen_token", token);

                await fetchUser();

                // Check for pending subscription from pricing page
                const pendingSubscription = localStorage.getItem('pending_subscription');
                if (pendingSubscription) {
                    try {
                        const subscriptionData = JSON.parse(pendingSubscription);
                        localStorage.removeItem('pending_subscription');
                        
                        navigate("/", { 
                            state: { 
                                pendingSubscription: subscriptionData,
                                autoOpenModal: true
                            } 
                        });
                        return;
                    } catch (e) {
                        console.error('Error parsing pending subscription:', e);
                        localStorage.removeItem('pending_subscription');
                    }
                }

                // Navigate based on user role
                switch (user.role) {
                    case "admin":
                        navigate("/admin/dashboard");
                        break;
                    case "school_admin":
                        navigate("/school/admin/dashboard");
                        break;
                    case "school_teacher":
                        navigate("/school-teacher/overview");
                        break;
                    case "parent":
                        navigate("/parent/dashboard");
                        break;
                    case "seller":
                        navigate("/seller/dashboard");
                        break;
                    case "csr":
                        // Check User.approvalStatus and redirect accordingly (same as sellers)
                        if (user.approvalStatus === "pending") {
                            navigate("/csr/pending-approval");
                        } else if (user.approvalStatus === "rejected") {
                            navigate("/csr/rejected");
                        } else {
                            navigate("/csr/overview");
                        }
                        break;
                    case "student":
                    case "school_student":
                    default:
                        navigate("/student/dashboard");
                        break;
                }
            } catch (err) {
                if (err.response?.status === 403 && err.response?.data?.approvalStatus) {
                    // Handle pending/rejected approval status
                    setPendingModal({
                        message: err.response?.data?.message || "Your account is currently under review.",
                        email: err.response?.data?.email || "",
                    });
                } else {
                    setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            // Handle OAuth errors with more specific messages
            let errorMessage = "Google sign-in was cancelled or failed. Please try again.";
            
            // Check if it's a redirect_uri_mismatch error
            if (error?.error === "redirect_uri_mismatch" || 
                error?.error_description?.includes("redirect_uri_mismatch") ||
                error?.message?.includes("redirect_uri_mismatch")) {
                errorMessage = "OAuth configuration error: Please ensure your production domain is added to Google Cloud Console. See GOOGLE_OAUTH_FIX.md for instructions.";
            }
            
            setError(errorMessage);
            setIsLoading(false);
            
            // Log detailed error in development
            if (import.meta.env.DEV) {
                console.error("Google OAuth Error:", error);
            }
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Please enter both email and password.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post(`/api/auth/login`, { email, password });

            const { token, user } = response.data;
            localStorage.setItem("finmen_token", token);

            await fetchUser();

            // Check for pending subscription from pricing page
            const pendingSubscription = localStorage.getItem('pending_subscription');
            if (pendingSubscription) {
                try {
                    const subscriptionData = JSON.parse(pendingSubscription);
                    localStorage.removeItem('pending_subscription');
                    
                    // Redirect to landing page with subscription data to auto-open modal
                    navigate("/", { 
                        state: { 
                            pendingSubscription: subscriptionData,
                            autoOpenModal: true
                        } 
                    });
                    return;
                } catch (e) {
                    console.error('Error parsing pending subscription:', e);
                    localStorage.removeItem('pending_subscription');
                }
            }

            // Navigate based on user role (only if no pending subscription)
            switch (user.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "school_admin":
                    navigate("/school/admin/dashboard");
                    break;
                case "school_teacher":
                    navigate("/school-teacher/overview");
                    break;
                case "parent":
                    navigate("/parent/dashboard");
                    break;
                case "seller":
                    navigate("/seller/dashboard");
                    break;
                case "csr":
                    // Check User.approvalStatus and redirect accordingly (same as sellers)
                    if (user.approvalStatus === "pending") {
                        navigate("/csr/pending-approval");
                    } else if (user.approvalStatus === "rejected") {
                        navigate("/csr/rejected");
                    } else {
                        navigate("/csr/overview");
                    }
                    break;
                case "student":
                case "school_student":
                default:
                    navigate("/student/dashboard");
                    break;
            }
        } catch (err) {
            if (
                err.response?.status === 400 &&
                err.response?.data?.message?.includes("verify")
            ) {
                localStorage.setItem("verificationEmail", email);
                navigate("/verify-email");
            } else if (err.response?.status === 403) {
                // Handle pending/rejected approval status
                const approvalStatus = err.response?.data?.approvalStatus;
                const message = err.response?.data?.message || "Your account is currently under review.";
                
                // Check if this is a CSR user based on the error message or try to infer from email
                // For CSR users, redirect to CSR-specific pages
                if (approvalStatus === "pending" && message.toLowerCase().includes("csr")) {
                    navigate("/csr/pending-approval");
                } else if (approvalStatus === "rejected" && message.toLowerCase().includes("csr")) {
                    navigate("/csr/rejected");
                } else if (approvalStatus === "pending") {
                    setPendingModal({
                        message: message + " You will be able to log in once the admin approves it.",
                        email,
                    });
                } else {
                    setError(message);
                }
            } else {
                setError(err.response?.data?.message || "Something went wrong.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const registrationOptions = [
        {
            label: "Student",
            icon: GraduationCap,
            path: "/register",
            gradient: "from-purple-500 to-pink-500",
            description: "Begin your personalized learning experience.",
        },
        {
            label: "Parent",
            icon: Users,
            path: "/register-parent",
            gradient: "from-green-500 to-emerald-500",
            description: "Stay connected with your child's academic journey.",
        },
        {
            label: "Teacher",
            icon: BookOpen,
            gradient: "from-amber-500 to-orange-500",
            description: "Teacher access is provisioned directly by verified schools.",
            onClick: () => setShowTeacherModal(true),
        },
        {
            label: "School",
            icon: Building2,
            path: "/school-registration",
            gradient: "from-blue-500 to-cyan-500",
            description: "Bring transformative wellbeing tools to your campus.",
        },
        {
            label: "CSR Partner",
            icon: Target,
            path: "/register-stakeholder",
            gradient: "from-rose-500 to-red-500",
            description: "Collaborate on impact programs with measurable outcomes.",
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-r from-blue-600/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Added responsive padding and mobile-friendly layout */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="w-full max-w-6xl">
                    {/* Adjusted grid for mobile - now single column on small screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                        {/* Left Side - Login Form */}
                        <div className="order-1 lg:order-1">
                            {/* Adjusted padding for mobile */}
                            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 md:p-7 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 h-full flex flex-col">
                                {/* Back to Home Button - Adjusted for mobile */}
                    <div className="absolute top-4 left-4 flex justify-start mb-3 z-50">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="group flex items-center gap-1.5 sm:gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                                        title="Back to Home"
                                    >
                                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                                        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>

                                {/* Header - Adjusted text sizes for mobile */}
                                <div className="text-center mb-4 sm:mb-5">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl mb-2 sm:mb-3 shadow-lg shadow-purple-500/50 animate-pulse">
                                        <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-1">
                                        Welcome Back
                                    </h1>
                                    <p className="text-gray-300 text-xs sm:text-sm">
                                        Sign in to continue your journey with Wise Student
                                    </p>
                                </div>

                                {/* Form Container - Centered */}
                                <div className="flex-1 flex flex-col justify-center">
                                    {/* Error Message - Adjusted padding for mobile */}
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2 sm:p-3 mb-3 sm:mb-4 backdrop-blur-sm animate-shake">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                                                <p className="text-red-300 text-xs sm:text-sm">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form - Adjusted spacing for mobile */}
                                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                        {/* Email Input */}
                                        <div className="group">
                                            <label className="block text-gray-300 text-xs font-medium mb-1 ml-1">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    required
                                                    className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="group">
                                            <label className="block text-gray-300 text-xs font-medium mb-1 ml-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your password"
                                                    required
                                                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs sm:text-sm focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Forgot Password Link */}
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/forgot-password")}
                                            className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors duration-300"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>

                                        {/* Submit Button - Adjusted padding for mobile */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 text-xs sm:text-sm cursor-pointer"
                                            style={{
                                                backgroundSize: "200% auto",
                                                backgroundPosition: isLoading
                                                    ? "100% center"
                                                    : "0% center",
                                            }}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span className="text-xs sm:text-sm">Signing in...</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                                                    <span className="text-xs sm:text-sm">Sign In</span>
                                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                </span>
                                            )}
                                        </button>

                                        {/* Divider */}
                                        <div className="relative my-3 sm:my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-white/20"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs sm:text-sm">
                                            <span className="px-2 bg-transparent text-gray-400">OR</span>
                                            </div>
                                        </div>

                                    {/* Google Sign In Button and Warning - Side by Side */}
                                    <div className="flex gap-0.5 w-full">
                                            {/* Google Sign In Button - Half Width */}
                                            <div className="w-1/2 flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={handleGoogleLogin}
                                                    disabled={isLoading}
                                                    className="bg-white/5 border-r-2 border-white/20 rounded-l-lg px-3 sm:px-4 py-2 sm:py-3 w-full hover:bg-white/10 hover:border-white/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2"
                                                >
                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24">
                                                        <path
                                                            fill="#4285F4"
                                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                        />
                                                        <path
                                                            fill="#34A853"
                                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        />
                                                        <path
                                                            fill="#FBBC05"
                                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                        />
                                                        <path
                                                            fill="#EA4335"
                                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        />
                                                    </svg>
                                                    <span className="text-white text-xs sm:text-sm whitespace-nowrap font-medium">Continue with Google</span>
                                                </button>
                                            </div>

                                            {/* Warning Message - Half Width */}
                                            <div className="w-1/2 flex items-center justify-center">
                                                <div className="bg-amber-500/5 border-l-2 border-amber-500/40 rounded-r-lg px-3 sm:px-4 py-2 sm:py-3 w-full flex items-center justify-center gap-1.5 sm:gap-2">
                                                    <AlertCircle className="w-3.5 h-3.5 hidden sm:block sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
                                                    <p className="text-amber-200/90 text-xs sm:text-sm font-medium text-center">
                                                        For Students Only
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Registration Options */}
                        <div className="order-2 lg:order-2">
                            {/* Adjusted padding for mobile */}
                            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 md:p-7 shadow-2xl h-full flex flex-col">
                                <div className="text-center mb-4 sm:mb-5">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                        New Here?
                                    </h2>
                                    <p className="text-gray-300 text-xs sm:text-sm">
                                        Create your account and start your journey
                                    </p>
                                </div>

                                {/* Registration Cards Container - Centered */}
                                <div className="flex-1 flex flex-col justify-center">
                                    {/* Adjusted spacing for mobile */}
                                    <div className="space-y-2 sm:space-y-2.5">
                                        {registrationOptions.map((option) => {
                                            const Icon = option.icon;
                                            const handleOptionSelect = () => {
                                                if (option.onClick) {
                                                    option.onClick();
                                                    return;
                                                }
                                                if (option.path) {
                                                    navigate(option.path);
                                                }
                                            };
                                            return (
                                                <button
                                                    key={option.label}
                                                    onClick={handleOptionSelect}
                                                    className="group w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                                        <div
                                                            className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                                        >
                                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <p className="text-white font-semibold text-xs sm:text-sm">
                                                                Register as {option.label}
                                                            </p>
                                                            <p className="text-gray-400 text-xs">
                                                                {option.description || `Create a ${option.label.toLowerCase()} account`}
                                                            </p>
                                                        </div>
                                                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Additional Info - Adjusted text size for mobile */}
                                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10">
                                        <p className="text-gray-400 text-xs text-center leading-relaxed">
                                            By continuing, you agree to our{" "}
                                            <a
                                                href="/terms"
                                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                                            >
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a
                                                href="/privacy"
                                                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                                            >
                                                Privacy Policy
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `,
                }}
            />
        </div>
            {showTeacherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
                    <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white shadow-2xl">
                        <div className="flex flex-col items-center gap-4 px-8 pt-8 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
                                <ShieldAlert className="h-10 w-10" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">For Security Reasons</h2>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                    Teacher credentials are issued directly by accredited schools to safeguard student data
                                    and maintain compliance with our safety standards. Please contact your school administrator
                                    to receive an official invitation to the platform.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 border-t border-amber-100 bg-amber-50 px-8 py-4 text-sm text-amber-800">
                            Only verified institutions can provision teacher accounts.
                        </div>
                        <div className="px-8 pb-8 pt-4">
                            <button
                                onClick={() => setShowTeacherModal(false)}
                                className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-600"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {pendingModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-purple-100">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200/40">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Under Review</h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-5">
                            {pendingModal.message}
                        </p>
                        <div className="bg-purple-50 text-purple-700 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                            <span className="block text-xs uppercase tracking-wide text-purple-500 mb-1">Registered Email</span>
                            <span className="break-words">{pendingModal.email}</span>
                        </div>
                        <button
                            onClick={() => setPendingModal(null)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                            Got it, thanks
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
