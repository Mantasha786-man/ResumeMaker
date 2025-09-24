import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Save, Eye } from 'lucide-react';
import PersonalInfo from '../components/resume/PersonalInfo';
import Education from '../components/resume/Education';
import Experience from '../components/resume/Experience';
import Skills from '../components/resume/Skills';
import Projects from '../components/resume/Projects';
import Certificates from '../components/resume/Certificates';
import ResumePreviewEnhanced from '../components/resume/ResumePreviewEnhanced';

const ResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
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
    certificates: [],
    template: 'modern',
    colorTheme: 'blue'
  });

  const steps = [
    { name: 'Personal Info', component: PersonalInfo, key: 'personalInfo' },
    { name: 'Education', component: Education, key: 'education' },
    { name: 'Experience', component: Experience, key: 'experience' },
    { name: 'Skills', component: Skills, key: 'skills' },
    { name: 'Projects', component: Projects, key: 'projects' },
    { name: 'Certificates', component: Certificates, key: 'certificates' }
  ];

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
      setResumeData(response.data.resume);
    } catch (error) {
      setError('Failed to load resume');
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // Validate required fields
      if (!resumeData.title) {
        setError('Resume title is required');
        return;
      }
      if (!resumeData.personalInfo.name) {
        setError('Name is required');
        return;
      }
      if (!resumeData.personalInfo.email) {
        setError('Email is required');
        return;
      }

      // Clean the data to remove invalid certificates
      const cleanedData = {
        ...resumeData,
        certificates: resumeData.certificates.filter(cert =>
          cert.title && cert.issuer && cert.date
        )
      };

      if (editId) {
        await axios.put(`/resume/${editId}`, cleanedData);
      } else {
        await axios.post('/resume', cleanedData);
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

      // Validate required fields
      if (!resumeData.title) {
        setError('Resume title is required');
        return;
      }
      if (!resumeData.personalInfo.name) {
        setError('Name is required');
        return;
      }
      if (!resumeData.personalInfo.email) {
        setError('Email is required');
        return;
      }

      // Clean the data to remove invalid certificates
      const cleanedData = {
        ...resumeData,
        certificates: resumeData.certificates.filter(cert =>
          cert.title && cert.issuer && cert.date
        )
      };

      let resumeId = editId;
      if (!resumeId) {
        // Save first if not saved
        const response = await axios.post('/resume', cleanedData);
        resumeId = response.data.resume._id;
      } else {
        await axios.put(`/resume/${resumeId}`, cleanedData);
      }

      // Download PDF
      const response = await axios.get(`/resume/${resumeId}/pdf`, {
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

    } catch (error) {
      setError('Failed to download PDF');
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {editId ? 'Edit Resume' : 'Create New Resume'}
        </h1>
        <p className="text-gray-600">
          Build your professional resume step by step
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= currentStep ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Component */}
          <div className="card p-6">
            <CurrentStepComponent
              data={resumeData[steps[currentStep].key]}
              onChange={(data) =>
                updateResumeData(steps[currentStep].key, data)
              }
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
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

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate('/template-customizer')}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview & Select Template</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-8 h-screen overflow-y-auto">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Live Preview
            </h3>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <ResumePreviewEnhanced data={resumeData} template={resumeData.template} colorTheme={resumeData.colorTheme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
