import React, { useState } from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';

const Experience = ({ data, onChange }) => {
  const [experience, setExperience] = useState(data || []);

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentRole: false
    };
    const updated = [...experience, newExperience];
    setExperience(updated);
    onChange(updated);
  };

  const removeExperience = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    setExperience(updated);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = experience.map((exp, i) => {
      if (i === index) {
        const updatedExp = { ...exp, [field]: value };
        // If setting as current role, clear end date
        if (field === 'isCurrentRole' && value) {
          updatedExp.endDate = '';
        }
        return updatedExp;
      }
      return exp;
    });
    setExperience(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Work Experience
        </h2>
        <button
          onClick={addExperience}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No work experience added yet. Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={exp.id || index} className="card p-4 relative">
              <button
                onClick={() => removeExperience(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                    className="input-field"
                    placeholder="Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="input-field"
                    placeholder="Google Inc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    className="input-field"
                    disabled={exp.isCurrentRole}
                    required={!exp.isCurrentRole}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exp.isCurrentRole || false}
                      onChange={(e) => updateExperience(index, 'isCurrentRole', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      I currently work here
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="Describe your key responsibilities, achievements, and impact in this role..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {exp.description?.length || 0}/1000 characters
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
