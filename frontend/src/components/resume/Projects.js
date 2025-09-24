import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Code, X } from 'lucide-react';

const Projects = ({ data, onChange }) => {
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(null);

  const handleAddProject = () => {
    const newProject = {
      title: '',
      description: '',
      link: '',
      technologies: []
    };
    onChange([...(data || []), newProject]);
  };

  const handleRemoveProject = (index) => {
    const updatedProjects = data.filter((_, i) => i !== index);
    onChange(updatedProjects);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = data.map((project, i) =>
      i === index ? { ...project, [field]: value } : project
    );
    onChange(updatedProjects);
  };

  const handleAddTechnology = (projectIndex, technology) => {
    const updatedProjects = data.map((project, i) => {
      if (i === projectIndex) {
        if (!project.technologies.includes(technology)) {
          return { ...project, technologies: [...project.technologies, technology] };
        }
      }
      return project;
    });
    onChange(updatedProjects);
    setShowTagSelector(false);
    setCurrentProjectIndex(null);
  };

  const handleRemoveTechnology = (projectIndex, techIndex) => {
    const updatedProjects = data.map((project, i) => {
      if (i === projectIndex) {
        return {
          ...project,
          technologies: project.technologies.filter((_, index) => index !== techIndex)
        };
      }
      return project;
    });
    onChange(updatedProjects);
  };

  const commonTechnologies = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'HTML', 'CSS', 'SASS', 'TailwindCSS', 'Bootstrap', 'Material-UI',
    'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'GraphQL', 'REST APIs', 'Jest', 'Cypress', 'Webpack'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={handleAddProject}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {(!data || data.length === 0) ? (
        <div className="text-center py-8 text-gray-500">
          <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        data.map((project, index) => (
          <div key={index} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-semibold text-gray-900">
                Project #{index + 1}
              </h4>
              <button
                onClick={() => handleRemoveProject(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={project.title || ''}
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  className="input-field"
                  placeholder="e.g., E-commerce Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={project.description || ''}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your project, technologies used, and your role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link
                </label>
                <div className="flex">
                  <input
                    type="url"
                    value={project.link || ''}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    className="input-field rounded-r-none"
                    placeholder="https://github.com/username/project"
                  />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary rounded-l-none border-l-0 flex items-center px-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies?.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemoveTechnology(index, techIndex)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowTagSelector(true);
                    setCurrentProjectIndex(index);
                  }}
                  className="btn-secondary text-sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Technology
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Technology Selector Modal */}
      {showTagSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Technologies
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {commonTechnologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleAddTechnology(currentProjectIndex, tech)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary-50 rounded border"
                >
                  {tech}
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowTagSelector(false);
                  setCurrentProjectIndex(null);
                }}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
