// app/(auth)/login/layout.jsx (বা আপনার ফাইলের পাথ অনুযায়ী)

export const metadata = {
  title: "Login global idal school & college",
  description: "Login to access the  dashboard",
};

export default function LoginLayout({ children }) {
  return (
    // লগইন পেজে যেহেতু সাইডবার বা হেডার থাকবে না, তাই শুধু children রিটার্ন করছি
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}