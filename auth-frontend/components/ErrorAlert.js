export default function ErrorAlert({ message }) {
    return (
      <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded-lg relative mb-4 transition-transform transform scale-100 hover:scale-105 duration-200 ease-in-out shadow-md">
        <strong className="font-semibold">Error!</strong>
        <span className="block sm:inline ml-2">{message}</span>
      </div>
    );
  }