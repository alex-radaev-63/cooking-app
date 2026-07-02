const ManageHouseholds = () => {
  return (
    <div className="flex flex-col max-w-[840px] mx-auto p-4 mt-6 gap-4">
      <h1 className="text-[28px] font-medium text-white">My households</h1>
      <div
        className="flex flex-col sm:flex-row gap-2 rounded-xl 
      border justify-between align-bottom border-slate-700 bg-slate-800 px-6 py-5 text-white"
      >
        <div className="flex flex-col gap-1">
          <h2 className="mb-4 text-xl font-semibold capitalize">
            household name
          </h2>

          <p>
            <span className="text-gray-400">Total grocery lists</span> 12
          </p>
          <p>
            <span className="text-gray-400">Most recent entry:</span> July 2,
            2026
          </p>
        </div>

        <button type="submit" className="">
          send invite
        </button>
      </div>
    </div>
  );
};

export default ManageHouseholds;
