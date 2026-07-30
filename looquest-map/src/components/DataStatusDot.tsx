interface DataStatusDotProps {
  isLive: boolean;
}

export function DataStatusDot({ isLive }: DataStatusDotProps) {
  return (
    <div
      className={`absolute top-3 right-3 z-[1000] rounded-full px-2.5 py-1 text-xs font-medium shadow-md backdrop-blur-sm ${
        isLive ? 'bg-green-100/90 text-green-700' : 'bg-gray-100/90 text-gray-600'
      }`}
    >
      {isLive ? '● live data' : '● cached data'}
    </div>
  );
}
