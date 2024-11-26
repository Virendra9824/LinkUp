export default function DeleteAccount({
  isModalOpen,
  setModalOpen,
  handleDeleteAccount,
  loading,
}) {
  return (
    <div>
      {/* top-up for delete password */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[rgb(18,18,18)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure about permanently removing your account?
            </h2>

            <button
              disabled={loading}
              onClick={handleDeleteAccount}
              className={`w-full bg-[#06CDF4] text-black py-2 rounded-md ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              Delete
            </button>
            <button
              disabled={loading}
              className={`w-full text-red-500 mt-4 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
