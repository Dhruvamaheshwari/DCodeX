import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';
import Split from 'react-split';

const CodeEditor = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState('cpp');
  const [codeMap, setCodeMap] = useState({
    cpp: '// Write your C++ code here',
    java: '// Write your Java code here',
    python: '# Write your Python code here',
    javascript: '// Write your JavaScript code here',
  });
  const [code, setCode] = useState('');
  const [activeTestCase, setActiveTestCase] = useState(0);

  // Added logic for Tabs and Submissions
  const [activeTab, setActiveTab] = useState('description');
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Map language_id from backend to standard language names used by Monaco editor
  const getMonacoLanguage = (langId) => {
    const langMap = {
      54: 'cpp',       // Example IDs
      62: 'java',
      71: 'python',
      63: 'javascript'
    };
    return langMap[langId] || String(langId);
  };

  useEffect(() => {
    if (activeTab === 'submissions') {
      const fetchSubmissions = async () => {
        setLoadingSubmissions(true);
        try {
          const res = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
          if (res.data.succ) {
            setSubmissions(Array.isArray(res.data.mess) ? res.data.mess : []);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSubmissions(false);
        }
      };
      fetchSubmissions();
    }
  }, [activeTab, problemId]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/problem/problemById/${problemId}`);
        if (res.data.success) {
          const fetchedProblem = res.data.problem;
          setProblem(fetchedProblem);

          // Construct CodeMap from startCode if available
          const initialCodeMap = {
            cpp: '// Write your C++ code here',
            java: '// Write your Java code here',
            python: '# Write your Python code here',
            javascript: '// Write your JavaScript code here',
          };

          if (fetchedProblem.startCode && fetchedProblem.startCode.length > 0) {
            fetchedProblem.startCode.forEach((item) => {
              const lang = getMonacoLanguage(item.language_id);
              if (initialCodeMap.hasOwnProperty(lang) || initialCodeMap.hasOwnProperty(item.language)) {
                const key = initialCodeMap.hasOwnProperty(lang) ? lang : item.language;
                initialCodeMap[key] = item.initialCode;
              }
            });
          }

          setCodeMap(initialCodeMap);
          setCode(initialCodeMap[language]); // Set code for default selected language
        } else {
          setError(res.data.message || 'Error fetching problem details');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load problem data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // Handle language change and preserve code snippet per language
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(codeMap[newLang] || '');
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setCodeMap(prev => ({ ...prev, [language]: newCode }));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-base-300 text-base-content whitespace-pre-wrap">
        <h2 className="text-2xl font-bold text-error mb-4">{error || 'Problem Not Found'}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Back to Problems</button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-base-300 text-base-content">
      {/* Top Navbar */}
      <div className="h-14 bg-base-200 flex items-center justify-between px-4 border-b border-base-300">
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/')}
          >
            ← Problem List
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-ghost text-success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 inline"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
            Run
          </button>
          <button className="btn btn-sm btn-success text-success-content flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" /></svg>
            Submit
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <Split
        className="flex-1 flex px-2 pb-2 overflow-hidden bg-base-300 w-full [&>.gutter]:bg-transparent [&>.gutter]:cursor-col-resize [&>.gutter]:hover:bg-primary/50 [&>.gutter]:transition-colors [&>.gutter]:mx-1 [&>.gutter]:rounded-full"
        sizes={[50, 50]}
        minSize={300}
        gutterSize={8}
        snapOffset={30}
      >

        {/* Left Panel - Problem Description */}
        <div className="flex flex-col bg-base-100 rounded-lg border border-base-200 overflow-hidden h-full">
          {/* Tabs */}
          <div className="flex border-b border-base-200 bg-base-200 px-2 pt-2 gap-1">
            <button
              className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-t-lg transition-colors ${activeTab === 'description' ? 'bg-base-100 text-primary' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'}`}
              onClick={() => setActiveTab('description')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Description
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'editorial' ? 'bg-base-100 text-primary' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'}`}
              onClick={() => setActiveTab('editorial')}
            >
              Editorial
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'solutions' ? 'bg-base-100 text-primary' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'}`}
              onClick={() => setActiveTab('solutions')}
            >
              Solutions
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${activeTab === 'submissions' ? 'bg-base-100 text-primary' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </div>
          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* Description Tab */}
            {activeTab === 'description' && (
              <>
                <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
                  {problem.title}
                </h1>
                <div className="flex gap-2 mb-6">
                  <span className={`badge badge-sm badge-outline ${problem.difficulty === 'easy' ? 'badge-success bg-success/10' :
                    problem.difficulty === 'medium' ? 'badge-warning bg-warning/10' : 'badge-error bg-error/10'
                    }`}>
                    {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1) || 'Unknown'}
                  </span>
                  <span className="badge badge-ghost badge-sm border-base-300 capitalize">{problem.tags}</span>
                </div>

                <div className="text-sm leading-relaxed max-w-none text-base-content/90">
                  <p className="mb-6 whitespace-pre-wrap">{problem.description}</p>

                  {problem.visibleTestCases && problem.visibleTestCases.map((tc, index) => (
                    <div key={index} className="mb-6">
                      <p className="font-bold mb-2">Example {index + 1}:</p>
                      <div className="border border-base-300/50 bg-base-200 p-4 rounded-md font-mono text-xs whitespace-pre-wrap">
                        <div><span className="font-bold text-base-content">Input:</span> {tc.input}</div>
                        <div><span className="font-bold text-base-content">Output:</span> {tc.output}</div>
                        {tc.explanation && (
                          <div className="mt-2"><span className="font-bold text-base-content">Explanation:</span> {tc.explanation}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Editorial Tab */}
            {activeTab === 'editorial' && (
              <div className="text-base-content/80 text-sm leading-relaxed">
                <h2 className="text-xl font-bold mb-4 text-base-content">Editorial</h2>
                <p>Welcome to the editorial for <strong>{problem.title}</strong>.</p>
                <p className="mt-4">
                  Currently, our team is working on a comprehensive, step-by-step editorial guide for this problem.
                  Check back later to see detailed explanations, visual intuition, time and space complexity breakdowns, and optimal approaches.
                </p>
              </div>
            )}

            {/* Solutions Tab */}
            {activeTab === 'solutions' && (
              <div className="text-sm">
                <h2 className="text-xl font-bold mb-4 text-base-content">Reference Solution</h2>
                {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
                  problem.referenceSolution.map((sol, index) => (
                    <div key={index} className="mb-6">
                      <div className="badge badge-primary mb-2 font-mono uppercase text-xs">{sol.language_id || sol.language || 'Code'}</div>
                      <div className="bg-base-200 p-4 rounded-md font-mono text-xs overflow-x-auto border border-base-300">
                        <pre>{sol.completeCode}</pre>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/60 italic">No reference solutions have been published for this problem yet.</p>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div className="text-sm">
                <h2 className="text-xl font-bold mb-4 text-base-content flex items-center justify-between">
                  Your Submissions
                  <span className="badge badge-info badge-outline">{submissions.length} Total</span>
                </h2>

                {loadingSubmissions ? (
                  <div className="flex justify-center p-10"><span className="loading loading-spinner text-primary"></span></div>
                ) : submissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra table-sm w-full font-mono">
                      <thead className="bg-base-200">
                        <tr>
                          <th>Status</th>
                          <th>Language</th>
                          <th>Runtime</th>
                          <th>Memory</th>
                          <th>Tests Passed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((sub, i) => (
                          <tr key={i} className="hover">
                            <td>
                              <span className={`font-semibold ${sub.status === 'accepted' ? 'text-success' :
                                sub.status === 'pending' ? 'text-warning' : 'text-error'
                                }`}>
                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                              </span>
                            </td>
                            <td>{sub.language}</td>
                            <td>{sub.runtime} ms</td>
                            <td>{sub.memory} KB</td>
                            <td>{sub.testCasePassed} / {sub.testCasesTotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-base-content/60 italic bg-base-200/50 p-6 rounded-lg text-center border border-base-300">
                    You haven't submitted any code for this problem yet. Write your code and click Submit!
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Panel - Editor & Console */}
        <Split
          direction="vertical"
          sizes={[70, 30]}
          minSize={100}
          gutterSize={8}
          snapOffset={30}
          className="flex flex-col overflow-hidden h-full [&>.gutter]:bg-transparent [&>.gutter]:cursor-row-resize [&>.gutter]:hover:bg-primary/50 [&>.gutter]:transition-colors [&>.gutter]:my-1 [&>.gutter]:rounded-full"
        >

          {/* Editor Container */}
          <div className="flex flex-col bg-base-100 rounded-lg border border-base-200 overflow-hidden relative">
            {/* Editor Header */}
            <div className="h-10 bg-base-200 flex items-center px-4 justify-between border-b border-base-300">
              <div className="flex items-center gap-2">
                <span className="text-success text-xs font-mono">&lt;/&gt; Code</span>
                <select
                  className="select select-xs select-ghost focus:outline-none bg-transparent hover:bg-base-300 ml-2"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-base-content/50">
                <span>Auto Saved</span>
              </div>
            </div>
            {/* Monaco Editor */}
            <div className="flex-1 w-full pt-2">
              <Editor
                theme="vs-dark"
                language={language}
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 24,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/* Testcase / Console Container */}
          <div className="flex flex-col bg-base-100 rounded-lg border border-base-200 overflow-hidden">
            <div className="flex border-b border-base-200 bg-base-200 px-2 pt-2">
              <button className="px-4 py-2 text-sm font-semibold flex items-center gap-1 bg-base-100 rounded-t-lg text-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Testcase
              </button>
              <button className="px-4 py-2 text-sm text-base-content/60 hover:text-base-content flex items-center gap-1">
                <span className="text-success font-mono font-bold leading-none align-middle">&rsaquo;_</span>
                Test Result
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex gap-2 mb-4">
                {problem.visibleTestCases?.map((tc, idx) => (
                  <button
                    key={idx}
                    className={`btn btn-sm ${activeTestCase === idx ? 'bg-base-300 font-normal border-none' : 'btn-ghost font-normal'}`}
                    onClick={() => setActiveTestCase(idx)}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {problem.visibleTestCases && problem.visibleTestCases[activeTestCase] && (
                <div className="max-w-2xl">
                  <label className="text-xs font-semibold text-base-content/70 mb-2 block">Input =</label>
                  <div className="bg-base-200 rounded-md p-3 mb-4 font-mono text-sm border border-base-300/50 whitespace-pre-wrap">
                    {problem.visibleTestCases[activeTestCase].input}
                  </div>

                  <label className="text-xs font-semibold text-base-content/70 mb-2 block">Expected Output =</label>
                  <div className="bg-base-200 rounded-md p-3 font-mono text-sm border border-base-300/50 whitespace-pre-wrap">
                    {problem.visibleTestCases[activeTestCase].output}
                  </div>
                </div>
              )}
            </div>
          </div>

        </Split>
      </Split>
    </div>
  );
}

export default CodeEditor;