import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';

const ResumePreviewEnhanced = ({ data, template = 'modern', colorTheme = 'blue' }) => {
  // Dummy data for preview when no data is provided
  const getDummyData = () => ({
    personalInfo: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solving skills and a track record of delivering high-quality software solutions.'
    },
    experience: [
      {
        role: 'Senior Full Stack Developer',
        company: 'Tech Solutions Inc.',
        startDate: '2022-01-01',
        endDate: '2024-01-01',
        isCurrentRole: false,
        description: 'Led development of customer-facing web applications using React and Node.js. Improved application performance by 40% through optimization and caching strategies. Mentored junior developers and conducted code reviews.'
      },
      {
        role: 'Full Stack Developer',
        company: 'StartupXYZ',
        startDate: '2020-06-01',
        endDate: '2021-12-01',
        isCurrentRole: false,
        description: 'Developed and maintained multiple web applications using MERN stack. Implemented RESTful APIs and integrated third-party services. Collaborated with design team to create responsive user interfaces.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        startDate: '2016-09-01',
        endDate: '2020-05-01',
        description: 'Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems.'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'GraphQL'],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-featured e-commerce platform with React frontend and Node.js backend. Features include user authentication, payment processing, inventory management, and admin dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
        link: 'https://github.com/johndoe/ecommerce-platform'
      },
      {
        title: 'Task Management App',
        description: 'Developed a collaborative task management application with real-time updates, team collaboration features, and progress tracking.',
        technologies: ['React', 'Socket.io', 'Express', 'MySQL'],
        link: 'https://github.com/johndoe/task-manager'
      }
    ]
  });

  // Always show user data if available, otherwise show dummy data
  const displayData = data && (data.personalInfo?.name || data.experience?.length > 0 || data.education?.length > 0 || data.skills?.length > 0 || data.projects?.length > 0) ? data : getDummyData();

  // Ensure template and colorTheme are properly set
  const currentTemplate = template || 'modern';
  const currentColorTheme = colorTheme || 'blue';
  const getColorTheme = () => {
    switch (colorTheme) {
      case 'blue':
        return {
          primary: 'text-blue-600',
          primaryBg: 'bg-blue-100',
          primaryBorder: 'border-blue-600',
          accent: 'text-blue-600'
        };
      case 'green':
        return {
          primary: 'text-green-600',
          primaryBg: 'bg-green-100',
          primaryBorder: 'border-green-600',
          accent: 'text-green-600'
        };
      case 'purple':
        return {
          primary: 'text-purple-600',
          primaryBg: 'bg-purple-100',
          primaryBorder: 'border-purple-600',
          accent: 'text-purple-600'
        };
      case 'red':
        return {
          primary: 'text-red-600',
          primaryBg: 'bg-red-100',
          primaryBorder: 'border-red-600',
          accent: 'text-red-600'
        };
      case 'indigo':
        return {
          primary: 'text-indigo-600',
          primaryBg: 'bg-indigo-100',
          primaryBorder: 'border-indigo-600',
          accent: 'text-indigo-600'
        };
      default:
        return {
          primary: 'text-blue-600',
          primaryBg: 'bg-blue-100',
          primaryBorder: 'border-blue-600',
          accent: 'text-blue-600'
        };
    }
  };

  const colors = getColorTheme();

  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-lg rounded-lg',
          header: `border-b-4 ${colors.primaryBorder} pb-6 mb-6`,
          name: 'text-3xl font-bold text-gray-900 mb-2',
          title: `text-lg ${colors.primary} font-medium mb-4`,
          section: 'mb-6',
          sectionTitle: `text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 ${colors.primaryBorder}`,
          item: 'mb-4',
          itemTitle: 'font-semibold text-gray-900',
          itemSubtitle: `${colors.primary} font-medium`,
          itemDate: 'text-sm text-gray-600',
          skills: 'flex flex-wrap gap-2',
          skill: `${colors.primaryBg} ${colors.accent} px-3 py-1 rounded-full text-sm font-medium`
        };
      case 'classic':
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-lg font-serif border border-gray-200',
          header: 'text-center border-b-2 border-gray-800 pb-6 mb-6',
          name: 'text-4xl font-bold text-gray-900 mb-2',
          title: `text-lg ${colors.primary} font-medium mb-4`,
          section: 'mb-6',
          sectionTitle: 'text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide',
          item: 'mb-4',
          itemTitle: 'font-bold text-gray-900',
          itemSubtitle: `${colors.primary} font-medium`,
          itemDate: 'text-sm text-gray-600',
          skills: 'flex flex-wrap gap-2',
          skill: 'bg-gray-100 text-gray-800 px-2 py-1 text-sm border border-gray-300'
        };
      case 'minimal':
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto',
          header: 'mb-8',
          name: 'text-2xl font-light text-gray-900 mb-1',
          title: `text-base ${colors.primary} font-light mb-6`,
          section: 'mb-6',
          sectionTitle: `text-lg font-medium text-gray-900 mb-3 border-b border-gray-200 pb-1`,
          item: 'mb-3',
          itemTitle: 'font-medium text-gray-900',
          itemSubtitle: `${colors.primary}`,
          itemDate: 'text-sm text-gray-500',
          skills: 'flex flex-wrap gap-1',
          skill: 'bg-gray-50 text-gray-700 px-2 py-1 text-xs'
        };
      case 'creative':
        return {
          container: 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 p-8 max-w-4xl mx-auto shadow-xl rounded-xl',
          header: 'text-center mb-8 relative',
          name: 'text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2',
          title: `text-xl ${colors.primary} font-medium mb-4`,
          section: 'mb-8',
          sectionTitle: `text-2xl font-bold ${colors.primary} mb-4 relative`,
          item: 'mb-6 p-4 bg-white rounded-lg shadow-sm',
          itemTitle: 'font-bold text-gray-900 text-lg',
          itemSubtitle: `${colors.primary} font-semibold text-base`,
          itemDate: 'text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block',
          skills: 'flex flex-wrap gap-3',
          skill: `${colors.primaryBg} ${colors.accent} px-4 py-2 rounded-full text-sm font-bold shadow-sm`
        };
      case 'professional':
        return {
          container: 'bg-gray-50 text-gray-900 p-8 max-w-4xl mx-auto shadow-lg border-l-4 border-gray-800',
          header: 'mb-8 pb-6 border-b border-gray-300',
          name: 'text-3xl font-bold text-gray-900 mb-2',
          title: `text-lg ${colors.primary} font-medium mb-4`,
          section: 'mb-6',
          sectionTitle: `text-xl font-bold text-gray-900 mb-3 flex items-center`,
          item: 'mb-4 pl-4 border-l-2 border-gray-200',
          itemTitle: 'font-bold text-gray-900',
          itemSubtitle: `${colors.primary} font-medium`,
          itemDate: 'text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded',
          skills: 'grid grid-cols-2 gap-2',
          skill: 'bg-white text-gray-800 px-3 py-1 text-sm border border-gray-200 rounded'
        };
      case 'tech':
        return {
          container: 'bg-slate-900 text-white p-8 max-w-4xl mx-auto shadow-2xl rounded-lg',
          header: 'mb-8 pb-6 border-b border-slate-700',
          name: 'text-3xl font-bold text-white mb-2',
          title: `text-lg ${colors.primary} font-medium mb-4`,
          section: 'mb-6',
          sectionTitle: `text-xl font-bold ${colors.primary} mb-3 flex items-center`,
          item: 'mb-4 p-3 bg-slate-800 rounded border-l-4 border-blue-500',
          itemTitle: 'font-bold text-white',
          itemSubtitle: `${colors.primary} font-medium`,
          itemDate: 'text-sm text-slate-400 bg-slate-700 px-2 py-1 rounded',
          skills: 'flex flex-wrap gap-2',
          skill: 'bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono'
        };
      default:
        return {
          container: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-lg rounded-lg',
          header: `border-b-4 ${colors.primaryBorder} pb-6 mb-6`,
          name: 'text-3xl font-bold text-gray-900 mb-2',
          title: `text-lg ${colors.primary} font-medium mb-4`,
          section: 'mb-6',
          sectionTitle: `text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 ${colors.primaryBorder}`,
          item: 'mb-4',
          itemTitle: 'font-semibold text-gray-900',
          itemSubtitle: `${colors.primary} font-medium`,
          itemDate: 'text-sm text-gray-600',
          skills: 'flex flex-wrap gap-2',
          skill: `${colors.primaryBg} ${colors.accent} px-3 py-1 rounded-full text-sm font-medium`
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.name}>
          {displayData.personalInfo?.name || 'Your Name'}
        </h1>
        <p className={styles.title}>
          {displayData.personalInfo?.title || 'Your Professional Title'}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {displayData.personalInfo?.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{displayData.personalInfo.email}</span>
            </div>
          )}
          {displayData.personalInfo?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{displayData.personalInfo.phone}</span>
            </div>
          )}
          {displayData.personalInfo?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{displayData.personalInfo.location}</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-2">
          {displayData.personalInfo?.linkedin && (
            <a
              href={displayData.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 ${colors.primary} hover:opacity-80 text-sm`}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          {displayData.personalInfo?.github && (
            <a
              href={displayData.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 ${colors.primary} hover:opacity-80 text-sm`}
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>

        {displayData.personalInfo?.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {displayData.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {displayData.experience && displayData.experience.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          {displayData.experience.map((exp, index) => (
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
      )}

      {/* Education */}
      {displayData.education && displayData.education.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          {displayData.education.map((edu, index) => (
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
      {displayData.skills && displayData.skills.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.skills}>
            {displayData.skills.map((skill, index) => (
              <span key={index} className={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {displayData.projects && displayData.projects.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          {displayData.projects.map((project, index) => (
            <div key={index} className={styles.item}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={styles.itemTitle}>
                  {project.title}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ml-2 inline-flex items-center ${colors.primary} hover:opacity-80`}
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
      )}
    </div>
  );
};

export default ResumePreviewEnhanced;
