import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

const Skills = ({ data, onChange }) => {
  const [skills, setSkills] = useState(data || []);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      onChange(updated);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = skills.filter(skill => skill !== skillToRemove);
    setSkills(updated);
    onChange(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Express.js',
    'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'HTML', 'CSS', 'TypeScript',
    'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot', 'MySQL', 'Redis',
    'Kubernetes', 'Jenkins', 'Linux', 'Machine Learning', 'Data Science',
    'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'
  ];

  const addCommonSkill = (skill) => {
    if (!skills.includes(skill)) {
      const updated = [...skills, skill];
      setSkills(updated);
      onChange(updated);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Skills & Technologies
      </h2>

      {/* Add Skill Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Your Skills
        </label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field pl-10"
              placeholder="e.g., JavaScript, Python, React..."
            />
          </div>
          <button
            onClick={addSkill}
            disabled={!newSkill.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current Skills */}
      {skills.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Skills ({skills.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Popular Skills (Click to add)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {commonSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => addCommonSkill(skill)}
              disabled={skills.includes(skill)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                skills.includes(skill)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white hover:bg-primary-50 hover:border-primary-300 text-gray-700 border-gray-200'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>No skills added yet. Add your technical and soft skills above.</p>
        </div>
      )}
    </div>
  );
};

export default Skills;
