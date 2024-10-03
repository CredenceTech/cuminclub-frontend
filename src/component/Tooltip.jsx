export default function Tooltip({ data, children }) {
  return (
    <div className="group relative flex">
      {children}
      {data.messages && data.messages.length > 0 && (
        <div className="absolute -top-16 scale-0 transition-all group-hover:scale-100 left-10 bg-white backdropBackgroundCss p-4 whitespace-nowrap rounded-lg shadow-md">
          {data.title && (
            <h3 className="text-[22px] font-regola-pro font-normal leading-[26.4px] text-[#242424]">
              {data.title}
            </h3>
          )}
          {data.messages.map((message, index) => (
            <p key={index} className="font-[300] text-[20px] leading-[24px] font-regola-pro text-[#555555]">
              {message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
