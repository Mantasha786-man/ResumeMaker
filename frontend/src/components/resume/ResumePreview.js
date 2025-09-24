import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

const ResumePreview = ({ data, template = 'modern' }) => {
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-lg',
          header: 'border-b-4 border-primary-600 pb-6 mb-6',
          name: 'text-3xl font-bold text-gray-900 mb-2',
          title: 'text-lg text-primary-600 font-medium mb-4',
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-300',
          item: 'mb-4',
          itemTitle: 'font-semibold text-gray-900',
          itemSubtitle: 'text-primary-600 font-medium',
          itemDate: 'text-sm text-gray-600',
          skills: 'flex flex-wrap gap-2',
          skill: 'bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm'
        };
      case 'classic':
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-lg font-serif',
          header: 'text-center border-b-2 border-gray-800 pb-6 mb-6',
          name: 'text-4xl font-bold text-gray-900 mb-2',
          title: 'text-lg text-gray-700 font-medium mb-4',
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide',
          item: 'mb-4',
          itemTitle: 'font-bold text-gray-900',
          itemSubtitle: 'text-gray-700 font-medium',
          itemDate: 'text-sm text-gray-600',
          skills: 'flex flex-wrap gap-2',
          skill: 'bg-gray-100 text-gray-800 px-2 py-1 text-sm border border-gray-300'
        };
      case 'minimal':
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto',
          header: 'mb-8',
          name: 'text-2xl font-light text-gray-900 mb-1',
          title: 'text-base text-gray-600 font-light mb-6',
          section: 'mb-6',
          sectionTitle: 'text-lg font-medium text-gray-900 mb-3',
          item: 'mb-3',
          itemTitle: 'font-medium text-gray-900',
          itemSubtitle: 'text-gray-600',
          itemDate: 'text-sm text-gray-500',
          skills: 'flex flex-wrap gap-1',
          skill: 'bg-gray-50 text-gray-700 px-2 py-1 text-xs'
        };
      default:
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-lg',
          header: 'border-b-4 border-primary-600 pb-6 mb-6',
          name: 'text-3xl font-bold text-gray-900 mb-2',
          title: 'text-lg text-primary-600 font-medium mb-4',
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-gray-300',
          item: 'mb-4',
          itemTitle: 'font-semibold text-gray-900',
          itemSubtitle: 'text-primary-600 font-medium',
          itemDate: 'text-sm text-gray-600',
          skills: 'flex flex-wrap gap-2',
          skill: 'bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.name}>
          {data.personalInfo?.name || 'Your Name'}
        </h1>
        <p className={styles.title}>
          {data.personalInfo?.title || 'Your Professional Title'}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.personalInfo?.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-2">
          {data.personalInfo?.linkedin && (
            <a
              href={data.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          {data.personalInfo?.github && (
            <a
              href={data.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>

        {data.personalInfo?.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {data.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={`grid gap-4 ${data.experience.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {data.experience.map((exp, index) => (
              <div key={index} className={styles.item}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={styles.itemTitle}>{exp.role}</h3>
                  <span className={styles.itemDate}>
                    {new Date(exp.startDate).getFullYear()} - {exp.isCurrentRole ? 'Present' : new Date(exp.endDate).getFullYear()}
                  </span>
                </div>
                <p className={styles.itemSubtitle}>{exp.company}</p>
                {exp.description && (
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className={styles.item}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={styles.itemTitle}>{edu.degree}</h3>
                <span className={styles.itemDate}>
                  {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                </span>
              </div>
              <p className={styles.itemSubtitle}>{edu.school}</p>
              {edu.description && (
                <p className="text-gray-700 mt-2 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.skills}>
            {data.skills.map((skill, index) => (
              <span key={index} className={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={`grid gap-4 ${data.projects.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {data.projects.map((project, index) => (
              <div key={index} className={styles.item}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={styles.itemTitle}>
                    {project.title}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </h3>
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {data.certificates && data.certificates.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Certificates</h2>
          <div className={`grid gap-4 ${data.certificates.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {data.certificates.map((cert, index) => (
              <div key={index} className={styles.item}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={styles.itemTitle}>
                    {cert.title}
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </h3>
                  <span className={styles.itemDate}>
                    {new Date(cert.date).getFullYear()}
                  </span>
                </div>
                <p className={styles.itemSubtitle}>{cert.issuer}</p>
                {cert.description && (
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {cert.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
