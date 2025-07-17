export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">
          Only users with @stellehire.com email addresses can access this
          application.
        </p>
        <a
          href="/sign-in"
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Different Account
        </a>
      </div>
    </div>
  );
}
