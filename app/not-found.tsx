import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} Logo`}
        width={48}
        height={48}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive mb-10">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 ml-2 p-4 border border-gray-200 bg-gray-100 rounded-md transition hover:bg-gray-300"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
