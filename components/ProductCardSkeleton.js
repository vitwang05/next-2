export default function ProductCardSkeleton() {
  return (
    <div className="bg-white shadow rounded overflow-hidden w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200" />
      <div className="p-2 sm:p-3 md:p-4">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}



