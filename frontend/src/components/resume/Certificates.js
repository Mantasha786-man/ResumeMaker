import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Award } from 'lucide-react';

const Certificates = ({ data, onChange }) => {
  const handleAddCertificate = () => {
    const newCertificate = {
      title: '',
      issuer: '',
      date: '',
      description: '',
      link: ''
    };
    onChange([...(data || []), newCertificate]);
  };

  const handleRemoveCertificate = (index) => {
    const updatedCertificates = data.filter((_, i) => i !== index);
    onChange(updatedCertificates);
  };

  const handleCertificateChange = (index, field, value) => {
    const updatedCertificates = data.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );
    onChange(updatedCertificates);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Certificates</h3>
        <button
          onClick={handleAddCertificate}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {(!data || data.length === 0) ? (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No certificates added yet. Click "Add Certificate" to get started.</p>
        </div>
      ) : (
        data.map((cert, index) => (
          <div key={index} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-md font-semibold text-gray-900">
                Certificate #{index + 1}
              </h4>
              <button
                onClick={() => handleRemoveCertificate(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={cert.title || ''}
                  onChange={(e) => handleCertificateChange(index, 'title', e.target.value)}
                  className="input-field"
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer *
                </label>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => handleCertificateChange(index, 'issuer', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={cert.date || ''}
                  onChange={(e) => handleCertificateChange(index, 'date', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={cert.description || ''}
                  onChange={(e) => handleCertificateChange(index, 'description', e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Describe the certificate and its relevance..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Link
                </label>
                <div className="flex">
                  <input
                    type="url"
                    value={cert.link || ''}
                    onChange={(e) => handleCertificateChange(index, 'link', e.target.value)}
                    className="input-field rounded-r-none"
                    placeholder="https://verify.certification.com"
                  />
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary rounded-l-none border-l-0 flex items-center px-3"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Certificates;
