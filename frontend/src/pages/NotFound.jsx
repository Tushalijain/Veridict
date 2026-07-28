import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">

      <h1 className="text-8xl font-extrabold text-teal-600">
        404
      </h1>

      <h2 className="text-3xl font-bold mt-5">
        Page Not Found
      </h2>

      <p className="text-gray-600 mt-3">
        The page you are looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition"
      >
        Back to Home
      </Link>

    </div>
  );
}

export default NotFound;