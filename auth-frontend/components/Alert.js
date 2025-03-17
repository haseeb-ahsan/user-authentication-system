export default function Alert({ message }) {
  return (
    <div className='bg-green-800 border border-green-600 text-green-100 px-4 py-3 rounded-lg relative mb-4 transition-transform transform scale-100 hover:scale-105 duration-200 ease-in-out shadow-md'>
      <strong className='font-semibold'>Success!</strong>
      <span className='block sm:inline ml-2'>{message}</span>
    </div>
  );
}
