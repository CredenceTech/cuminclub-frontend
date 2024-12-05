export default function Tooltip({ data, style = '-top-24 left-9', children }) {
  return (
    <div className="group relative flex ">
      {children}
      {data.messages && data.messages.length > 0 && (
        <div className={`absolute z-10 scale-0 ${style} transition-all group-hover:scale-100  bg-[#FFFFFFA3] backdropBackgroundCss py-5 px-9 pr-12 whitespace-nowrap rounded-lg shadow-md`}>
          {data.title && (
            <h3 className="text-[21px] font-regola-pro font-normal leading-[26.4px] text-[#242424] mb-2">
              {data.title}
            </h3>
          )}
          {data.messages.map((message, index) => (
            <p key={index} className="font-[300] text-[18px] leading-[22px] font-regola-pro text-[#555555]">
              {message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
