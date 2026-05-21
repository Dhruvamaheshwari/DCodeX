
import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';

const Profleupdated = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'settings'

    // Settings form state
    const [formData, setFormData] = useState({ firstName: '', lastName: '', password: '' });
    const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/user/user_profile');
            if (res.data.succ) {
                setProfile(res.data.profile);
                setFormData({
                    firstName: res.data.profile.firstName,
                    lastName: res.data.profile.lastName,
                    password: ''
                });
            }
        } catch (err) {
            setError(err.response?.data?.mess || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMsg({ type: '', text: '' });
        try {
            const res = await axiosClient.put('/user/update_profile', formData);
            if (res.data.succ) {
                setUpdateMsg({ type: 'success', text: "Profile updated successfully!" });
                setProfile((prev) => ({ ...prev, firstName: res.data.user.firstName, lastName: res.data.user.lastName }));
                setFormData(prev => ({ ...prev, password: '' })); // reset password field
            }
        } catch (err) {
            setUpdateMsg({ type: 'error', text: err.response?.data?.mess || "Failed to update profile" });
        }
    };

    const generateHeatmap = () => {
        // Generate dates for the past year
        const today = new Date();
        const startDate = new Date(new Date().setFullYear(today.getFullYear() - 1));

        return (
            <div className="bg-base-200 p-6 rounded-xl shadow-inner border border-base-300 w-full overflow-x-auto">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500 font-semibold">{profile?.heatmapData?.length || 0} submissions in the past one year</p>
                    <div className="text-sm text-gray-500 flex gap-4">
                        <span>Total active days: {profile?.heatmapData?.length || 0}</span>
                        <span>Max streak: {profile?.maxStreak || 0}</span>
                    </div>
                </div>

                <div className="min-w-[700px]">
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={today}
                        values={profile?.heatmapData || []}
                        classForValue={(value) => {
                            if (!value || value.count === 0) {
                                return 'color-empty fill-base-300';
                            }
                            if (value.count === 1) return 'fill-green-300';
                            if (value.count === 2) return 'fill-green-500';
                            if (value.count === 3) return 'fill-green-700';
                            return 'fill-green-900';
                        }}
                        tooltipDataAttrs={(value) => {
                            if (!value || !value.date) return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'No submissions' };
                            return {
                                'data-tooltip-id': 'heatmap-tooltip',
                                'data-tooltip-content': `${value.count} submissions on ${value.date}`,
                            };
                        }}
                        showWeekdayLabels={true}
                    />
                </div>
                <Tooltip id="heatmap-tooltip" />

                <style jsx="true">{`
          .react-calendar-heatmap .color-empty {
            fill: #374151; /* Gray for dark mode */
          }
          .react-calendar-heatmap text {
            fill: #9ca3af; /* Text color */
            font-size: 10px;
          }
          .react-calendar-heatmap rect {
            rx: 2; /* Border radius equivalent to rounded-sm */
            width: 10px;
            height: 10px;
          }
        `}</style>
            </div>
        );
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="text-center text-error p-10">{error}</div>;
    if (!profile) return null;

    return (
        <div className="min-h-screen bg-base-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Left Sidebar - Profile Card */}
                <div className="col-span-1 border border-base-300 rounded-2xl p-6 bg-base-200 shadow-lg flex flex-col items-center place-self-start w-full">
                    <div className="avatar">
                        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=random`} alt="Profile" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-sm text-gray-500">{profile.emailId}</p>
                    <span className="badge badge-accent mt-2">{profile.role}</span>

                    <div className="divider w-full"></div>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Current Streak</span>
                            <span className="font-bold">{profile.currentStreak} ⚡</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Max Streak</span>
                            <span className="font-bold">{profile.maxStreak} 🔥</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col w-full gap-2">
                        <button
                            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="col-span-1 md:col-span-3 space-y-6">

                    {activeTab === 'overview' ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="stat place-items-center bg-base-200 rounded-2xl shadow-sm border border-base-300 p-4">
                                    <div className="stat-title">Total Solved</div>
                                    <div className="stat-value text-primary">{profile.totalSolved}</div>
                                </div>
                                <div className="stat place-items-center bg-base-200 rounded-2xl shadow-sm border border-base-300 p-4">
                                    <div className="stat-title text-success">Easy</div>
                                    <div className="stat-value text-success">{profile.difficultyCounts.easy}</div>
                                </div>
                                <div className="stat place-items-center bg-base-200 rounded-2xl shadow-sm border border-base-300 p-4">
                                    <div className="stat-title text-warning">Medium</div>
                                    <div className="stat-value text-warning">{profile.difficultyCounts.medium}</div>
                                </div>
                                <div className="stat place-items-center bg-base-200 rounded-2xl shadow-sm border border-base-300 p-4">
                                    <div className="stat-title text-error">Hard</div>
                                    <div className="stat-value text-error">{profile.difficultyCounts.hard}</div>
                                </div>
                            </div>

                            {/* Heatmap Section */}
                            <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300">
                                <h3 className="text-xl font-bold mb-4">Submission Activity</h3>
                                {generateHeatmap()}
                            </div>

                            {/* Solved Problems List */}
                            <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300">
                                <h3 className="text-xl font-bold mb-4">Recent Submissions</h3>
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Problem</th>
                                                <th>Difficulty</th>
                                                <th>Language</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profile.solvedProblems.length > 0 ? (
                                                profile.solvedProblems.map((prob, idx) => (
                                                    <tr key={idx} className="hover">
                                                        <td className="font-semibold">{prob.title}</td>
                                                        <td>
                                                            <span className={`badge badge-sm ${prob.difficulty === 'easy' ? 'badge-success' :
                                                                prob.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                                                                }`}>
                                                                {prob.difficulty}
                                                            </span>
                                                        </td>
                                                        <td>{prob.language}</td>
                                                        <td>{new Date(prob.date).toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-gray-500 py-4">No problems solved yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Settings Tab */
                        <div className="bg-base-100 p-8 rounded-2xl shadow-lg border border-base-300">
                            <h3 className="text-2xl font-bold mb-6">Account Settings</h3>

                            {updateMsg.text && (
                                <div className={`alert ${updateMsg.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                                    <span>{updateMsg.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">First Name</span></label>
                                    <input type="text" className="input input-bordered w-full"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text">Last Name</span></label>
                                    <input type="text" className="input input-bordered w-full"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>

                                <div className="divider">Security</div>

                                <div className="form-control">
                                    <label className="label"><span className="label-text">New Password (leave blank to keep current)</span></label>
                                    <input type="password" placeholder="••••••••" className="input input-bordered w-full"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div className="mt-6">
                                    <button type="submit" className="btn btn-primary w-full">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profleupdated;