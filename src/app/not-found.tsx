import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="py-20">
      <h1 className="text-5xl mb-5 font-extrabold text-center flex flex-col gap-5 items-center">
        <span className="text-gradient inline-block text-7xl">404</span>
        <span>Page Not Found</span>
      </h1>
      <p className="text-center text-lg max-w-[600px] mx-auto mb-10 text-gray-500">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="text-white bg-grayPrimary rounded-full h-12 px-10 flex items-center justify-center gap-2 w-fit mx-auto group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 group-hover:-translate-x-3 transition-transform"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        <span>Go home</span>
      </Link>
    </div>
  );
};

export default PageNotFound;
