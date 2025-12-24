// /app/accept-invite/[token]/page.js
import AcceptInviteForm from "./AcceptInviteForm";

export default async function AcceptInvitePage({ params }) {
  const { token } = await params;

  // Validate token on server
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/accept/${token}`, {
    cache: "no-store"
  });

  const data = await response.json();

  if (!response.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600">{data.error}</p>
          <p className="mt-4 text-sm text-gray-500">
            Please contact the platform administrator for a new invitation.
          </p>
        </div>
      </div>
    );
  }

  return <AcceptInviteForm invite={data.invite} token={token} />;
}