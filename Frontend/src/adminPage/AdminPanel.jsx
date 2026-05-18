import { useState } from "react";
import CreateProblem from "./CreateProblem";
import UpdateProblem from "./UpdateProblem";
import DeleteProblem from "./DeleteProblem";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="min-h-screen bg-base-200">
            {/* Top Navigation */}
            <div className="navbar bg-primary text-primary-content shadow-md mb-8">
                <div className="flex-1 px-4">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>
                <div className="flex-none hidden lg:block">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <a
                                className={activeTab === 'create' ? "active font-bold" : ""}
                                onClick={() => setActiveTab("create")}
                            >
                                Create Problem
                            </a>
                        </li>
                        <li>
                            <a
                                className={activeTab === 'update' ? "active font-bold" : ""}
                                onClick={() => setActiveTab("update")}
                            >
                                Update Problem
                            </a>
                        </li>
                        <li>
                            <a
                                className={`text-red-200 hover:text-red-100 ${activeTab === 'delete' ? "active font-bold bg-error text-error-content" : ""}`}
                                onClick={() => setActiveTab("delete")}
                            >
                                Delete Problem
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                {activeTab === "create" && <CreateProblem />}
                {activeTab === "update" && <UpdateProblem />}
                {activeTab === "delete" && <DeleteProblem />}
            </div>
        </div>
    );
};

export default AdminPanel;