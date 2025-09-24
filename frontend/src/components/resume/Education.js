import React, { useState } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';

const Education = ({ data, onChange }) => {
  const [education, setEducation] = useState(data || []);

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      school: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    const updated = [...education, newEducation];
    setEducation(updated);
    onChange(updated);
  };

  const removeEducation = (index) => {
    const updated = education.filter((_, i) => i !== index);
    setEducation(updated);
    onChange(updated);
  };

  const updateEducation = (index, field, value) => {
    const updated = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Education
        </h2>
        <button
          onClick={addEducation}
          className="btn-secondary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet. Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id || index} className="card p-4 relative">
              <button
                onClick={() => removeEducation(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="input-field"
                    placeholder="Bachelor of Science in Computer Science"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School/Institution *
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    className="input-field"
                    placeholder="University of Example"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    className="input-field min-h-[80px] resize-y"
                    placeholder="Relevant coursework, achievements, or activities..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {edu.description?.length || 0}/500 characters
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

export default Education;
