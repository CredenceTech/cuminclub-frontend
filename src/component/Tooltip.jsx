export default function Tooltip({ message, children }) {
    return (
      <div className="group relative flex">
        {children}
        {/* <span
          className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100"
        >
          {message}
        </span> */}
        <div className="absolute -top-16 scale-0 transition-all group-hover:scale-100 left-10 bg-white backdropBackgroundCss p-4 whitespace-nowrap rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Packaging</h3>
          <p className="text-sm text-gray-700">Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
          <p className="text-sm text-gray-700">Lorem Ipsum Lorem Ipsum</p>
        </div>
      </div>
    );
  }