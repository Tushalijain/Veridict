import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ContestArena() {

    const { id } = useParams();

    const [contest, setContest] = useState(null);

    useEffect(() => {
        fetchContest();
    }, []);

    const fetchContest = async () => {

        try {

            const response = await api.get(`/contests/${id}`);

            setContest(response.data.contest);

        } catch (err) {

            console.log(err);

        }

    };

    if (!contest)
        return <h2 className="p-8">Loading...</h2>;

    return (

        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 p-8">

                <h1 className="text-4xl font-bold">
                    {contest.title}
                </h1>

                <p className="text-gray-600 mt-2">
                    {contest.description}
                </p>

                <div className="mt-8">

                    <h2 className="text-2xl font-bold mb-5">
                        Problems
                    </h2>

                    <div className="space-y-4">

                        {contest.problems.map((problem, index) => (

                            <div
                                key={problem._id}
                                className="bg-white rounded-lg shadow p-5 flex justify-between items-center"
                            >

                                <div>

                                    <h3 className="font-bold text-xl">

                                        {String.fromCharCode(65 + index)}. {problem.title}

                                    </h3>

                                    <p className="text-gray-500">
                                        {problem.difficulty}
                                    </p>

                                </div>

                                <Link
    to={`/problems/${problem._id}?contest=${contest._id}`}
>
                                    Solve
                                </Link>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </>

    );

}

export default ContestArena;