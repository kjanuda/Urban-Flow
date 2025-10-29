export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        SmartCity Reporter
      </h1>
      <p className="text-gray-600 max-w-xl mb-8">
        Empowering citizens to report issues and regional offices to take action
        efficiently.
      </p>

      <div className="space-x-4">
        <a
          href="/user/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          User Login
        </a>
        <a
          href="/admin/login"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          Admin Login
        </a>
      </div>
    </div>
  );
}
