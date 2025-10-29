import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Check Your Email
        </h1>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> If you don't see the email, check your spam folder.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/auth/resend-verification"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Resend Verification Email
          </a>
          
          <a
            href="/user/login"
            className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}