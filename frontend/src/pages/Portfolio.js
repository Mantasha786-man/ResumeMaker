import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, Mail, Phone, MapPin, Linkedin, Github, Calendar, Download } from 'lucide-react';

const Portfolio = () => {
  const { url } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, [url]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to fetch the portfolio by URL
      // For now, we'll simulate with mock data
      const mockPortfolio = {
        personalInfo: {
          name: 'John Doe',
          title: 'Full Stack Developer',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.'
        },
        experience: [
          {
            role: 'Senior Full Stack Developer',
            company: 'Tech Innovations Inc.',
            startDate: '2022-01-01',
            endDate: '2024-01-01',
            description: 'Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines and improved system performance by 40%.'
          },
          {
            role: 'Full Stack Developer',
            company: 'StartupXYZ',
            startDate: '2020-06-01',
            endDate: '2021-12-01',
            description: 'Built responsive web applications using React and Node.js. Collaborated with design team to implement pixel-perfect UI components.'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Technology',
            startDate: '2016-09-01',
            endDate: '2020-05-01',
            description: 'Magna Cum Laude graduate. President of Computer Science Club. Relevant coursework: Data Structures, Algorithms, Software Engineering.'
          }
        ],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs'],
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with user authentication, payment processing, inventory management, and real-time analytics dashboard.',
            link: 'https://github.com/johndoe/ecommerce-platform',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'AWS S3']
          },
          {
            title: 'Task Management App',
            description: 'Collaborative task management application with real-time updates, team collaboration features, and progress tracking.',
            link: 'https://github.com/johndoe/task-manager',
            technologies: ['React', 'Socket.io', 'PostgreSQL', 'Docker']
          }
        ],
        template: 'modern'
      };

      // Simulate API delay
      setTimeout(() => {
        setPortfolio(mockPortfolio);
        setLoading(false);
      }, 1000);

    } catch (error) {
      setError('Portfolio not found');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // In a real app, this would trigger PDF generation
    alert('PDF download feature will be implemented with Puppeteer backend integration');
  };

  const getTemplateStyles = () => {
    return {
      container: 'bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen',
      content: 'bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-xl rounded-lg',
      header: 'text-center border-b-4 border-primary-600 pb-8 mb-8',
      name: 'text-4xl font-bold text-gray-900 mb-2',
      title: 'text-xl text-primary-600 font-medium mb-6',
      section: 'mb-8',
      sectionTitle: 'text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300',
      item: 'mb-6',
      itemTitle: 'font-bold text-gray-900 text-lg',
      itemSubtitle: 'text-primary-600 font-medium text-base',
      itemDate: 'text-sm text-gray-600 mb-2',
      skills: 'flex flex-wrap gap-2',
      skill: 'bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm',
      projectLink: 'text-primary-600 hover:text-primary-700 inline-flex items-center gap-1'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600">The portfolio you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const styles = getTemplateStyles();

  return (
    <div className={styles.container}>
      <div className="container mx-auto px-4 py-8">
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.name}>
              {portfolio.personalInfo.name}
            </h1>
            <p className={styles.title}>
              {portfolio.personalInfo.title}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
              {portfolio.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{portfolio.personalInfo.email}</span>
                </div>
              )}
              {portfolio.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{portfolio.personalInfo.phone}</span>
                </div>
              )}
              {portfolio.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{portfolio.personalInfo.location}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {portfolio.personalInfo.linkedin && (
                <a
                  href={portfolio.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </a>
              )}
              {portfolio.personalInfo.github && (
                <a
                  href={portfolio.personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>
              )}
            </div>

            {portfolio.personalInfo.summary && (
              <p className="mt-6 text-gray-700 leading-relaxed max-w-2xl mx-auto">
                {portfolio.personalInfo.summary}
              </p>
            )}
          </div>

          {/* Experience */}
          {portfolio.experience && portfolio.experience.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {portfolio.experience.map((exp, index) => (
                <div key={index} className={styles.item}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={styles.itemTitle}>{exp.role}</h3>
                    <span className={styles.itemDate}>
                      {new Date(exp.startDate).getFullYear()} - {new Date(exp.endDate).getFullYear()}
                    </span>
                  </div>
                  <p className={styles.itemSubtitle}>{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {portfolio.education && portfolio.education.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {portfolio.education.map((edu, index) => (
                <div key={index} className={styles.item}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={styles.itemTitle}>{edu.degree}</h3>
                    <span className={styles.itemDate}>
                      {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                    </span>
                  </div>
                  <p className={styles.itemSubtitle}>{edu.school}</p>
                  {edu.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className={styles.skills}>
                {portfolio.skills.map((skill, index) => (
                  <span key={index} className={styles.skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {portfolio.projects && portfolio.projects.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {portfolio.projects.map((project, index) => (
                <div key={index} className={styles.item}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={styles.itemTitle}>
                      {project.title}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectLink}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </h3>
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
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

          {/* Download Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleDownload}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
