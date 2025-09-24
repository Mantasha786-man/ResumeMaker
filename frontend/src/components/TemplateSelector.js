import React, { useState } from 'react';
import { Palette, Eye, Check } from 'lucide-react';

const TemplateSelector = ({ selectedTemplate, selectedColor, onTemplateChange, onColorChange }) => {
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

  return (
    <div className="space-y-8">
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
              onClick={() => onTemplateChange(template.id)}
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
              onClick={() => onColorChange(theme.id)}
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

      {/* Preview */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Live Preview</h4>
        <div className="bg-white p-4 rounded border">
          <div className="text-center mb-4">
            <div className="w-32 h-3 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="w-24 h-2 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-2 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
