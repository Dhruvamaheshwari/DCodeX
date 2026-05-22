import { useState } from "react";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";

const testCaseSchema = z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().optional()
});

const codeSchema = z.object({
    language_id: z.coerce.number().min(1, "Language ID is required"),
    language: z.string().optional(),
    initialCode: z.string().optional(),
    completeCode: z.string().optional(),
    code: z.string().optional()
});

const problemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.string().min(1, "Tag is required"),
    visibleTestCases: z.array(testCaseSchema).min(1, "At least one visible test case is required"),
    hiddenTestCases: z.array(testCaseSchema).min(1, "At least one hidden test case is required"),
    startCode: z.array(codeSchema).min(1, "At least one start code template is required"),
    referenceSolution: z.array(codeSchema).min(1, "At least one reference solution is required"),
    driverCode: z.array(codeSchema).optional(),
});

const CreateProblem = () => {
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "easy",
        tags: "array",
        visibleTestCases: [{ input: "", output: "", explanation: "" }],
        hiddenTestCases: [{ input: "", output: "", explanation: "" }],
        startCode: [{ language_id: 54, initialCode: "" }],
        referenceSolution: [{ language_id: 54, completeCode: "" }],
        driverCode: [{ language_id: 54, code: "" }],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, index, field, subfield) => {
        const newArray = [...formData[field]];
        newArray[index][subfield] = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field, emptyItem) => {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], emptyItem] }));
    };

    const removeArrayItem = (index, field) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData((prev) => ({ ...prev, [field]: newArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        try {
            const getLangName = (id) => {
                const map = { 54: "cpp", 62: "java", 71: "python", 63: "javascript" };
                return map[id] || "cpp";
            };

            const payload = {
                ...formData,
                startCode: formData.startCode.map(tc => ({
                    ...tc,
                    language_id: Number(tc.language_id),
                    language: getLangName(tc.language_id)
                })),
                referenceSolution: formData.referenceSolution.map(tc => ({
                    ...tc,
                    language_id: Number(tc.language_id),
                    language: getLangName(tc.language_id)
                })),
                driverCode: formData.driverCode ? formData.driverCode.map(tc => ({
                    ...tc,
                    language_id: Number(tc.language_id),
                    language: getLangName(tc.language_id)
                })) : []
            };

            const parsedData = problemSchema.parse(payload);
            const response = await axiosClient.post("/problem/create", parsedData);
            alert("Problem created successfully!");
            console.log(response.data);

            // clear form
            setFormData({
                title: "",
                description: "",
                difficulty: "easy",
                tags: "array",
                visibleTestCases: [{ input: "", output: "", explanation: "" }],
                hiddenTestCases: [{ input: "", output: "", explanation: "" }],
                startCode: [{ language_id: 54, initialCode: "" }],
                referenceSolution: [{ language_id: 54, completeCode: "" }],
                driverCode: [{ language_id: 54, code: "" }],
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.errors.map(err => err.message));
            } else {
                console.error("Error creating problem:", error);
                alert("Failed to create problem.");
            }
        }
    };

    return (
        <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300">
            <h2 className="text-2xl font-bold mb-6">Create New Problem</h2>

            {errors.length > 0 && (
                <div className="alert alert-error mb-6">
                    <ul>
                        {errors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text">Title</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text">Description</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-24" required></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Difficulty</span></label>
                            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="select select-bordered">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div className="form-control w-full">
                            <label className="label"><span className="label-text">Tags</span></label>
                            <select name="tags" value={formData.tags} onChange={handleChange} className="select select-bordered">
                                <option value="array">Array</option>
                                <option value="linklist">Linked List</option>
                                <option value="graph">Graph</option>
                                <option value="dp">Dynamic Programming</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2 flex justify-between items-center">
                        Visible Test Cases
                        <button type="button" onClick={() => addArrayItem("visibleTestCases", { input: "", output: "", explanation: "" })} className="btn btn-sm btn-primary">Add</button>
                    </h3>
                    {formData.visibleTestCases.map((tc, index) => (
                        <div key={index} className="p-4 border rounded relative bg-base-200">
                            <button type="button" onClick={() => removeArrayItem(index, "visibleTestCases")} className="btn btn-sm btn-circle btn-error absolute top-2 right-2">✕</button>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div><label className="label"><span className="label-text">Input</span></label><textarea value={tc.input} onChange={(e) => handleArrayChange(e, index, "visibleTestCases", "input")} className="textarea textarea-bordered w-full" required></textarea></div>
                                <div><label className="label"><span className="label-text">Output</span></label><textarea value={tc.output} onChange={(e) => handleArrayChange(e, index, "visibleTestCases", "output")} className="textarea textarea-bordered w-full" required></textarea></div>
                            </div>
                            <div><label className="label"><span className="label-text">Explanation</span></label><textarea value={tc.explanation} onChange={(e) => handleArrayChange(e, index, "visibleTestCases", "explanation")} className="textarea textarea-bordered w-full h-16"></textarea></div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2 flex justify-between items-center">
                        Hidden Test Cases
                        <button type="button" onClick={() => addArrayItem("hiddenTestCases", { input: "", output: "", explanation: "" })} className="btn btn-sm btn-primary">Add</button>
                    </h3>
                    {formData.hiddenTestCases.map((tc, index) => (
                        <div key={index} className="p-4 border rounded relative bg-base-200">
                            <button type="button" onClick={() => removeArrayItem(index, "hiddenTestCases")} className="btn btn-sm btn-circle btn-error absolute top-2 right-2">✕</button>
                            <div className="grid grid-cols-2 gap-4 mb-2">
                                <div><label className="label"><span className="label-text">Input</span></label><textarea value={tc.input} onChange={(e) => handleArrayChange(e, index, "hiddenTestCases", "input")} className="textarea textarea-bordered w-full" required></textarea></div>
                                <div><label className="label"><span className="label-text">Output</span></label><textarea value={tc.output} onChange={(e) => handleArrayChange(e, index, "hiddenTestCases", "output")} className="textarea textarea-bordered w-full" required></textarea></div>
                            </div>
                            <div><label className="label"><span className="label-text">Explanation</span></label><textarea value={tc.explanation} onChange={(e) => handleArrayChange(e, index, "hiddenTestCases", "explanation")} className="textarea textarea-bordered w-full h-16"></textarea></div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2 flex justify-between items-center">
                        Start Code Templates
                        <button type="button" onClick={() => addArrayItem("startCode", { language_id: 54, initialCode: "" })} className="btn btn-sm btn-primary">Add</button>
                    </h3>
                    {formData.startCode.map((tc, index) => (
                        <div key={index} className="p-4 border rounded relative bg-base-200">
                            <button type="button" onClick={() => removeArrayItem(index, "startCode")} className="btn btn-sm btn-circle btn-error absolute top-2 right-2">✕</button>
                            <div className="mb-2 w-1/2 pr-2">
                                <label className="label"><span className="label-text">Language</span></label>
                                <select value={tc.language_id} onChange={(e) => handleArrayChange(e, index, "startCode", "language_id")} className="select select-bordered w-full" required>
                                    <option value="54">C++</option><option value="62">Java</option><option value="71">Python</option><option value="63">JavaScript</option>
                                </select>
                            </div>
                            <div><label className="label"><span className="label-text">Initial Code</span></label><textarea value={tc.initialCode} onChange={(e) => handleArrayChange(e, index, "startCode", "initialCode")} className="textarea textarea-bordered w-full font-mono text-sm h-32" required></textarea></div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2 flex justify-between items-center">
                        Reference Solutions
                        <button type="button" onClick={() => addArrayItem("referenceSolution", { language_id: 54, completeCode: "" })} className="btn btn-sm btn-primary">Add</button>
                    </h3>
                    {formData.referenceSolution.map((tc, index) => (
                        <div key={index} className="p-4 border rounded relative bg-base-200">
                            <button type="button" onClick={() => removeArrayItem(index, "referenceSolution")} className="btn btn-sm btn-circle btn-error absolute top-2 right-2">✕</button>
                            <div className="mb-2 w-1/2 pr-2">
                                <label className="label"><span className="label-text">Language</span></label>
                                <select value={tc.language_id} onChange={(e) => handleArrayChange(e, index, "referenceSolution", "language_id")} className="select select-bordered w-full" required>
                                    <option value="54">C++</option><option value="62">Java</option><option value="71">Python</option><option value="63">JavaScript</option>
                                </select>
                            </div>
                            <div><label className="label"><span className="label-text">Complete Code</span></label><textarea value={tc.completeCode} onChange={(e) => handleArrayChange(e, index, "referenceSolution", "completeCode")} className="textarea textarea-bordered w-full font-mono text-sm h-32" required></textarea></div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2 flex justify-between items-center">
                        Driver Code (Hidden Runner)
                        <button type="button" onClick={() => addArrayItem("driverCode", { language_id: 54, code: "" })} className="btn btn-sm btn-primary">Add</button>
                    </h3>
                    {formData.driverCode?.map((tc, index) => (
                        <div key={index} className="p-4 border rounded relative bg-base-200">
                            <button type="button" onClick={() => removeArrayItem(index, "driverCode")} className="btn btn-sm btn-circle btn-error absolute top-2 right-2">✕</button>
                            <div className="mb-2 w-1/2 pr-2">
                                <label className="label"><span className="label-text">Language</span></label>
                                <select value={tc.language_id} onChange={(e) => handleArrayChange(e, index, "driverCode", "language_id")} className="select select-bordered w-full" required>
                                    <option value="54">C++</option><option value="62">Java</option><option value="71">Python</option><option value="63">JavaScript</option>
                                </select>
                            </div>
                            <div><label className="label"><span className="label-text">Code</span></label><textarea value={tc.code} onChange={(e) => handleArrayChange(e, index, "driverCode", "code")} className="textarea textarea-bordered w-full font-mono text-sm h-32"></textarea></div>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button type="submit" className="btn btn-success w-full text-lg">Create Problem</button>
                </div>
            </form>
        </div>
    );
};

export default CreateProblem;