import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await api.get(`/profile/${user._id}`);

      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <h2 className="text-center mt-10">Loading...</h2>
      </>
    );
  }

  const { user, stats } = profile;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-8">

        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-4xl font-bold mb-8">
            My Profile
          </h1>

          <div className="mb-8">

            <h2 className="text-2xl font-semibold">
              {user.name}
            </h2>

            <p className="text-gray-600">
              {user.email}
            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-blue-100 p-5 rounded-lg text-center">
              <h3 className="text-gray-600">Solved</h3>
              <p className="text-3xl font-bold">{stats.solved}</p>
            </div>

            <div className="bg-green-100 p-5 rounded-lg text-center">
              <h3 className="text-gray-600">Accepted</h3>
              <p className="text-3xl font-bold">{stats.accepted}</p>
            </div>

            <div className="bg-red-100 p-5 rounded-lg text-center">
              <h3 className="text-gray-600">Wrong</h3>
              <p className="text-3xl font-bold">{stats.wrongAnswer}</p>
            </div>

            <div className="bg-yellow-100 p-5 rounded-lg text-center">
              <h3 className="text-gray-600">Acceptance</h3>
              <p className="text-3xl font-bold">
                {stats.acceptanceRate}%
              </p>
            </div>

          </div>

          <div className="mt-8">

            <table className="w-full">

              <tbody>

                <tr className="border-b">
                  <td className="py-3 font-semibold">Total Submissions</td>
                  <td>{stats.totalSubmissions}</td>
                </tr>

                <tr className="border-b">
                  <td className="py-3 font-semibold">Compilation Errors</td>
                  <td>{stats.compilationError}</td>
                </tr>

                <tr className="border-b">
                  <td className="py-3 font-semibold">Runtime Errors</td>
                  <td>{stats.runtimeError}</td>
                </tr>

                <tr className="border-b">
                  <td className="py-3 font-semibold">Time Limit Exceeded</td>
                  <td>{stats.timeLimitExceeded}</td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </>
  );
}

export default Profile;