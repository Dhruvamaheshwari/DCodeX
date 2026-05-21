import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const DeleteProblem = () => {

    const [problems, setProblems] = useState([]);
    const [loading , setLoading] = useState(false);

    // Fetch all problems for the dropdown
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get("/problem/getAllProblem/", { params: { limit: 1000 } });
                if (res.data.success) {
                    setProblems(res.data.problems);
                }
            } catch (err) {
                console.error("Error fetching problems:", err);
            }
            finally{
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this problem?");
        if (!confirmDelete) return;

        try {
            const res = await axiosClient.delete(`/problem/delete/${id}`);
            if (res.data.success) {
                // Remove the deleted problem from the state
                setProblems(problems.filter(p => p._id !== id));
                alert("Problem deleted successfully.");
            }
        } catch (err) {
            console.error("Error deleting problem:", err);
            alert("Failed to delete problem.");
        }
    };

    if(loading)
    {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }
    return (
        <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300">
            <h2 className="text-2xl font-bold mb-6 text-error">Delete Problem</h2>
            <div className="space-y-4">
                {problems.length === 0 ? (
                    <div className="text-center text-gray-500">No problems found.</div>
                ) : (
                    problems.map((val) => (
                        <div key={val._id} className="flex justify-between items-center p-4 bg-base-200 rounded-lg shadow-sm border border-base-300">
                            <div>
                                <h3 className="text-xl font-semibold">{val.title}</h3>
                                <p className="text-sm text-gray-500">Difficulty: {val.difficulty}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(val._id)}
                                className="btn btn-error btn-sm"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DeleteProblem;