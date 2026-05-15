


import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../authSlice";

const HomePage = () => {
  const [problems, setProblems] = useState([]);
  const [probleSolved, setprobleSolved] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [titleFilter, setTitleFilter] = useState("all");
  const [solvedCount, setSolvedCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch problems with pagination and filters
      axiosClient.get('/problem/getAllProblem/', {
        params: {
          page,
          limit: 10,
          difficulty: difficultyFilter,
          tags: tagFilter,
          id: titleFilter
        }
      })
        .then((res) => {
          if (res.data.success) {
            setProblems(res.data.problems);
            setTotalPages(res.data.totalPages);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [isAuthenticated, page, difficultyFilter, tagFilter, titleFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user's solved problems
      axiosClient.get('/problem/problemSolvedByuser/')
        .then((res) => {
          if (res.data.succ) {
            setSolvedCount(res.data.mess?.probleSolved?.length || 0);
            setprobleSolved(res.data.mess?.probleSolved || []);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/login');
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* Navbar Section */}
      <div className="navbar bg-base-100 shadow-sm px-8 sticky top-0 z-50">
        <div className="flex-1">
          <a className="text-2xl font-bold text-primary cursor-pointer">DCodeX</a>
        </div>
        <div className="flex-none gap-4">
          {isAuthenticated && user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost m-1 text-lg font-semibold border border-base-300">
                Hi, {user.firstName}!
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                <li className="menu-title">
                  <span className="text-primary font-bold">Solved Problems: {solvedCount}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error font-semibold hover:bg-error/10">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8 ">

        {isAuthenticated ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4  ">
              {/* <h2 className="text-3xl font-bold text-base-content">All Problems</h2> */}

              {/* Filters / Dropdowns */}
              <div className="flex gap-4 w-full">
                <select
                  className="select select-bordered w-full max-w-xs focus:outline-none p-3 truncate"
                  value={titleFilter}
                  onChange={(e) => {
                    setTitleFilter(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="all">All Problems</option>
                  {probleSolved.map((prob) => (
                    <option key={prob._id} value={prob._id}>
                      {prob.title}
                    </option>
                  ))}
                </select>

                <select
                  className="select select-bordered w-full max-w-xs focus:outline-none p-3"
                  value={tagFilter}
                  onChange={(e) => {
                    setTagFilter(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="all">All Topics</option>
                  <option value="array">Array</option>
                  <option value="linklist">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">Dynamic Programming</option>
                </select>

                <select
                  className="select select-bordered w-full max-w-xs focus:outline-none p-3 "
                  value={difficultyFilter}
                  onChange={(e) => {
                    setDifficultyFilter(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Problems List Table */}
            <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border border-base-300">
              <table className="table table-zebra w-full text-left">
                {/* head */}
                <thead className="bg-base-300/50 text-base">
                  <tr>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Tags / Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.length > 0 ? (
                    problems.map((prob) => (
                      <tr key={prob._id} className="hover">
                        <td>
                          {/* Empty circle for solved status outline */}
                          <div className="w-5 h-5 rounded-full border-2 border-base-content/20 bg-base-200"></div>
                        </td>
                        <td className="font-medium text-lg cursor-pointer hover:text-primary transition-colors">
                          {prob.title}
                        </td>
                        <td>
                          <div className={`badge badge-outline ${prob.difficulty === 'easy' ? 'badge-success' :
                            prob.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                            } bg-green-900/80`}>
                            {prob.difficulty}
                          </div>
                        </td>
                        <td>
                          <div className="badge badge-info badge-outline lowercase bg-blue-900/80">
                            {prob.tags}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-base-content/60">
                        No problems found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <div className="text-sm font-semibold">
                  Page {page} of {totalPages}
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="alert alert-warning shadow-lg max-w-2xl mx-auto mt-10">
            <span>Please login or sign up to view and solve problems!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage