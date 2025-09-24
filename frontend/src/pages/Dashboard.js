import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, FileText, Eye, Edit, Trash2, Calendar, Download } from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/resume');
      setResumes(response.data.resumes || []);
    } catch (error) {
      setError('Failed to load resumes');
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await axios.delete(`/resume/${resumeId}`);
      setResumes(resumes.filter(resume => resume._id !== resumeId));
    } catch (error) {
      setError('Failed to delete resume');
      console.error('Error deleting resume:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Create professional resumes and build your portfolio
        </p>
      </div>

      {/* Create New Resume Button */}
      <div className="mb-8">
        <Link
          to="/resume-builder"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Resume</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first professional resume
          </p>
          <Link
            to="/resume-builder"
            className="btn-primary"
          >
            Create Your First Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume._id} className="card hover:shadow-xl transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {resume.personalInfo?.title || 'Professional Resume'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resume.template === 'modern' ? 'bg-blue-100 text-blue-800' :
                    resume.template === 'classic' ? 'bg-green-100 text-green-800' :
                    resume.template === 'minimal' ? 'bg-gray-100 text-gray-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {resume.template}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created: {formatDate(resume.createdAt)}
                  </div>
                  {resume.experience?.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {resume.experience.length} experience{resume.experience.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {resume.education?.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {resume.education.length} education{resume.education.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/resume-builder?edit=${resume._id}`}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="flex-1 btn-primary text-sm py-2">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </button>
                    {resume.isPublished && (
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                        <Eye className="h-4 w-4 mr-1" />
                        View Portfolio
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
