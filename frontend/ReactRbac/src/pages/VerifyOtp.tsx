import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function VerifyOtp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>
        <p className="text-center text-gray-600 mb-6">Enter the 6-digit code sent to your email.</p>
        <form className="space-y-4">
          <Input type="text" placeholder="123456" className="text-center tracking-widest text-lg" maxLength={6} />
          <Button className="w-full">Verify Code</Button>
        </form>
      </div>
    </div>
  );
}