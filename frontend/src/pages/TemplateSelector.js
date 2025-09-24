import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, Download } from 'lucide-react';
import ResumePreview from '../components/resume/ResumePreview';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design with blue accents',
      preview: 'modern'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional resume layout with serif fonts',
      preview: 'classic'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant design focusing on content',
      preview: 'minimal'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold design for creative professionals',
      preview: 'creative'
    }
  ];

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    // In a real app, you would save the template selection to the backend
    navigate('/dashboard');
  };

  const handleDownload = () => {
    // In a real app, this would trigger PDF generation
    alert('PDF download feature will be implemented with Puppeteer backend integration');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Resume Template
        </h1>
        <p className="text-gray-600">
          Select a template that best represents your professional style
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Templates
          </h2>

          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`card p-4 cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {template.description}
                  </p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="bg-primary-600 text-white rounded-full p-1">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-8">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Live Preview
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="h-96 overflow-y-auto p-4">
                <ResumePreview template={selectedTemplate} data={{
                  personalInfo: {
                    name: 'John Doe',
                    title: 'Software Engineer',
                    email: 'john@example.com',
                    phone: '+1 (555) 123-4567',
                    location: 'San Francisco, CA',
                    summary: 'Experienced software engineer with a passion for creating innovative solutions and leading development teams.'
                  },
                  experience: [
                    {
                      role: 'Senior Software Engineer',
                      company: 'Tech Corp',
                      startDate: '2022-01-01',
                      endDate: '2024-01-01',
                      description: 'Led development of scalable web applications using React and Node.js. Mentored junior developers and improved team productivity by 30%.'
                    }
                  ],
                  education: [
                    {
                      degree: 'Bachelor of Science in Computer Science',
                      school: 'University of Technology',
                      startDate: '2018-09-01',
                      endDate: '2022-05-01',
                      description: 'Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering.'
                    }
                  ],
                  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
                  projects: [
                    {
                      title: 'E-commerce Platform',
                      description: 'Built a full-stack e-commerce platform using MERN stack. Features include user authentication, payment processing, and inventory management.',
                      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API']
                    }
                  ]
                }} />
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate('/resume-builder')}
                className="btn-secondary"
              >
                Back to Editor
              </button>
              <button
                onClick={handleContinue}
                className="btn-primary"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
