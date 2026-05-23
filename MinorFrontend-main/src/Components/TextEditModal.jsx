export default function TextEditModal({ title, value, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96 shadow-xl space-y-4 border border-gray-200 dark:border-slate-700">

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>

        <textarea
          className="w-full h-40 border dark:border-slate-600 rounded-xl p-3 bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
          defaultValue={value}
          id="editTextField"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave(document.getElementById("editTextField").value)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
