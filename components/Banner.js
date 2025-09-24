import Link from "next/link";

export default function BannerSection({
  image,
  buttonLink = "#",
  buttonText = "KHÁM PHÁ NGAY",
  reverse = false,
  title = "GIOVANNI",
  subtitle = "UOMO",
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center bg-white">
      {/* Image */}
      <div
        className={`w-full h-[250px] sm:h-[350px] md:h-[500px] ${
          reverse ? "md:order-2" : "md:order-1"
        }`}
      >
        <img
          src={image}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-center p-6 sm:p-8 md:p-10 text-center  ${
          reverse ? "md:order-1" : "md:order-2"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
          {title}
        </h2>
        <p className="uppercase text-gray-500 text-sm sm:text-base tracking-widest mb-4 sm:mb-6">
          {subtitle}
        </p>

        <Link href={buttonLink}>
          <button className="px-4 sm:px-6 py-2 sm:py-3 border border-black text-black hover:bg-black hover:text-white transition rounded text-sm sm:text-base">
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
}
