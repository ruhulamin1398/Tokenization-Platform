import { ConnectButton } from '@rainbow-me/rainbowkit';

const NotConnected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
      <p className="text-gray-600 mb-6">You need to login first as an issuer to access the dashboard.</p>
      <ConnectButton />
    </div>
  );
};

export default NotConnected;