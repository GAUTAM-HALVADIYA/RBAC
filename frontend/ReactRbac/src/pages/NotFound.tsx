import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  );
}