import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Download, Eye, Palette, Check } from 'lucide-react';
import ResumePreviewEnhanced from '../components/resume/ResumePreviewEnhanced';

const TemplateCustomizer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const [resumeData, setResumeData] = useState({
    title: '',
    personalInfo: {
      name: '',
      title: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
      location: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    template: 'modern',
    colorTheme: 'blue'
  });

  // Add dummy data when no user data is available
  const getDataWithDummy = () => {
    if (resumeData.personalInfo?.name || resumeData.experience?.length > 0 || resumeData.education?.length > 0 || resumeData.skills?.length > 0 || resumeData.projects?.length > 0) {
      return resumeData;
    }

    // Return dummy data if no user data
    return {
      title: 'Sample Resume',
      personalInfo: {
        name: 'John Doe',
        title: 'Full Stack Developer',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies.'
      },
      experience: [
        {
          role: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc.',
          startDate: '2022-01-01',
          endDate: '2024-01-01',
          isCurrentRole: false,
          description: 'Led development of customer-facing web applications using React and Node.js. Improved application performance by 40%.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California, Berkeley',
          startDate: '2016-09-01',
          endDate: '2020-05-01',
          description: 'Graduated Magna Cum Laude.'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Built a full-featured e-commerce platform with React frontend and Node.js backend.',
          technologies: ['React', 'Node.js', 'MongoDB'],
          link: 'https://github.com/johndoe/ecommerce-platform'
        }
      ],
      template: selectedTemplate,
      colorTheme: selectedColor
    };
  };

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('blue');

  const editId = searchParams.get('edit');

  useEffect(() => {
    if (editId) {
      fetchResume(editId);
    }
  }, [editId]);

  const fetchResume = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/resume/${id}`);
      const resume = response.data.resume;
      setResumeData({
        ...resume,
        template: resume.template || 'modern',
        colorTheme: resume.colorTheme || 'blue'
      });
      setSelectedTemplate(resume.template || 'modern');
      setSelectedColor(resume.colorTheme || 'blue');
    } catch (error) {
      setError('Failed to load resume');
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // Use dummy data to ensure required fields are present
      const dataToSave = getDataWithDummy();
      const updatedData = {
        ...dataToSave,
        template: selectedTemplate,
        colorTheme: selectedColor
      };

      if (editId) {
        await axios.put(`/resume/${editId}`, updatedData);
      } else {
        await axios.post('/resume', updatedData);
      }

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save resume');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');

      // First save the resume if it's not already saved
      if (!editId) {
        // Use dummy data to ensure required fields are present
        const dataToSave = getDataWithDummy();
        const updatedData = {
          ...dataToSave,
          template: selectedTemplate,
          colorTheme: selectedColor
        };

        const saveResponse = await axios.post('/resume', updatedData);
        const newResumeId = saveResponse.data.resume._id;

        // Now download the PDF
        const response = await axios.get(`/resume/${newResumeId}/pdf`, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resumeData.title || 'resume'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        // Navigate to dashboard after successful save and download
        navigate('/dashboard');
      } else {
        // Resume already exists, just download
        const response = await axios.get(`/resume/${editId}/pdf`, {
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resumeData.title || 'resume'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      setError('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design',
      preview: 'bg-white border-2 border-blue-500 p-4 rounded-lg shadow-lg'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional resume layout',
      preview: 'bg-white border-2 border-gray-800 p-4 rounded-lg shadow-lg font-serif'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant',
      preview: 'bg-white p-4 rounded-lg border border-gray-200'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Eye-catching gradient design',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-xl border-2 border-purple-300'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Corporate style layout',
      preview: 'bg-gray-50 p-4 rounded-lg shadow-lg border-l-4 border-gray-800'
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Dark theme for developers',
      preview: 'bg-slate-900 text-white p-4 rounded-lg shadow-2xl border-l-4 border-blue-500'
    }
  ];

  const colorThemes = [
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customize Resume Template
        </h1>
        <p className="text-gray-600">
          Choose your preferred template and color theme for your resume
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Choose Template
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`${template.preview} h-32 flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                      <div className="w-24 h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="w-20 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <div className="flex items-center mt-2 text-blue-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Choose Color Theme
            </h3>
            <div className="flex flex-wrap gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleColorChange(theme.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    selectedColor === theme.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                  {selectedColor === theme.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Cancel</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Resume'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Live Preview
            </h3>
            <div className="overflow-auto max-h-[800px] border rounded-lg">
              <ResumePreviewEnhanced
                data={getDataWithDummy()}
                template={selectedTemplate}
                colorTheme={selectedColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomizer;
