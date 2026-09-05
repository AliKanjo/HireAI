import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Layers, 
  Plus, 
  Check 
} from 'lucide-react';

export default function CreateJobModal({ isOpen, onClose, onCreateJob }) {
  const [title, setTitle] = useState("Senior DevOps & Cloud Platform Engineer");
  const [department, setDepartment] = useState("Infrastructure & Reliability");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workplaceType, setWorkplaceType] = useState("Hybrid");
  const [jobType, setJobType] = useState("Full-Time");
  const [experienceLevel, setExperienceLevel] = useState("Senior");
  const [minYearsExp, setMinYearsExp] = useState(4);
  const [salaryMin, setSalaryMin] = useState(140000);
  const [salaryMax, setSalaryMax] = useState(175000);
  const [requiredSkills, setRequiredSkills] = useState(["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux"]);
  const [preferredSkills, setPreferredSkills] = useState(["Python", "Go", "Prometheus", "Kafka"]);
  const [newReqSkill, setNewReqSkill] = useState("");
  const [newPrefSkill, setNewPrefSkill] = useState("");
  const [description, setDescription] = useState("We are looking for a Senior Cloud Platform Engineer to oversee our multi-region Kubernetes clusters, automated infrastructure pipelines, and high availability systems.");
  const [requirements, setRequirements] = useState("• 4+ years of professional cloud infrastructure experience.\n• Production mastery of Kubernetes, Docker, and AWS.\n• Solid Infrastructure-as-Code background using Terraform.");

  if (!isOpen) return null;

  const handleAddReqSkill = () => {
    if (newReqSkill.trim() && !requiredSkills.includes(newReqSkill.trim())) {
      setRequiredSkills([...requiredSkills, newReqSkill.trim()]);
      setNewReqSkill("");
    }
  };

  const handleRemoveReqSkill = (skillToRemove) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
  };

  const handleAddPrefSkill = () => {
    if (newPrefSkill.trim() && !preferredSkills.includes(newPrefSkill.trim())) {
      setPreferredSkills([...preferredSkills, newPrefSkill.trim()]);
      setNewPrefSkill("");
    }
  };

  const handleRemovePrefSkill = (skillToRemove) => {
    setPreferredSkills(preferredSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateJob({
      title,
      department,
      location,
      workplaceType,
      jobType,
      experienceLevel,
      minYearsExp: Number(minYearsExp),
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      currency: "USD",
      requiredSkills,
      preferredSkills,
      description,
      requirements,
      status: "active",
      viewsCount: 1,
      applicationsCount: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-indigo-950/50 p-6 md:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create New Job Vacancy</h3>
            <p className="text-xs text-slate-400">Configure role requirements for automatic AI CV analysis</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Job Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Department</label>
              <input 
                type="text" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Location</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Workplace</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-Site">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="Junior">Junior (0-2 Yrs)</option>
                <option value="Mid">Mid-Level (2-4 Yrs)</option>
                <option value="Senior">Senior (4+ Yrs)</option>
                <option value="Lead">Lead / Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Min Years Exp</label>
              <input 
                type="number" 
                min="0"
                max="20"
                value={minYearsExp}
                onChange={(e) => setMinYearsExp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Salary Min (USD)</label>
              <input 
                type="number" 
                step="5000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Salary Max (USD)</label>
              <input 
                type="number" 
                step="5000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Required Skills Tag Editor */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>Required Core Skills (Used by AI CV Engine)</span>
              <span className="text-[10px] text-indigo-400">Press Enter or Add</span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-700 min-h-[42px] mb-2">
              {requiredSkills.map((skill, idx) => (
                <span key={idx} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  {skill}
                  <button type="button" onClick={() => handleRemoveReqSkill(skill)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. React, Python, Docker..."
                value={newReqSkill}
                onChange={(e) => setNewReqSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddReqSkill(); } }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="button" 
                onClick={handleAddReqSkill}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Job Description</label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              <span>Publish Vacancy</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
