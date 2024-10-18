
export default function DeleteAccount({ isModalOpen, setModalOpen }) {
  return (
    <div>
      {/* top-up for delete password */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[rgb(18,18,18)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Enter your password to delete this account permanently!
            </h2>
            

            {/* Section: Email */}
            <div className="flex flex-col mb-4">
              <label className="relative top-2 w-fit px-1 bg-[#1A1A1A] text-sm left-3 text-[#06B6D4]">
                Password
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="py-2 px-4 bg-[#1A1A1A] text-white border border-gray-500 rounded focus:outline-none focus:border-2 focus:border-[#06B6D4]"
              />
              
            </div>

            <button className="w-full bg-[#06CDF4] text-black py-2 rounded-md">
              SUBMIT
            </button>
            <button
              className="w-full text-red-500 mt-4"
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
