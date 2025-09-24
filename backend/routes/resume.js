const express = require('express');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/resume
// @desc    Create a new resume
// @access  Private
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Resume title is required'),
  body('personalInfo.name').trim().notEmpty().withMessage('Name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const resumeData = {
      userId: req.user._id,
      ...req.body
    };

    const resume = new Resume(resumeData);
    await resume.save();

    // Add resume to user's resume list
    await req.user.updateOne({
      $push: { resumes: resume._id }
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating resume'
    });
  }
});

// @route   GET /api/resume
// @desc    Get all resumes for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: resumes.length,
      resumes
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resumes'
    });
  }
});

// @route   GET /api/resume/:id
// @desc    Get a specific resume by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resume'
    });
  }
});

// @route   PUT /api/resume/:id
// @desc    Update a resume
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Resume updated successfully',
      resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating resume'
    });
  }
});

// @route   DELETE /api/resume/:id
// @desc    Delete a resume
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Remove resume from user's resume list
    await req.user.updateOne({
      $pull: { resumes: req.params.id }
    });

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting resume'
    });
  }
});

// @route   POST /api/resume/:id/publish
// @desc    Publish/unpublish a resume as portfolio
// @access  Private
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const { isPublished, customUrl } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Generate portfolio URL if publishing
    let portfolioUrl = resume.portfolioUrl;
    if (isPublished && !portfolioUrl) {
      portfolioUrl = customUrl || `${req.user.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
    }

    resume.isPublished = isPublished;
    if (isPublished) {
      resume.portfolioUrl = portfolioUrl;
    }

    await resume.save();

    res.json({
      success: true,
      message: isPublished ? 'Resume published successfully' : 'Resume unpublished successfully',
      resume
    });
  } catch (error) {
    console.error('Publish resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while publishing resume'
    });
  }
});

// @route   GET /api/resume/portfolio/:url
// @desc    Get published portfolio by URL
// @access  Public
router.get('/portfolio/:url', async (req, res) => {
  try {
    const resume = await Resume.findOne({
      portfolioUrl: req.params.url,
      isPublished: true
    }).populate('userId', 'name email');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching portfolio'
    });
  }
});

// @route   GET /api/resume/:id/pdf
// @desc    Generate and download PDF
// @access  Private
router.get('/:id/pdf', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Import Puppeteer
    const puppeteer = require('puppeteer');

    // Generate HTML from resume data
    const htmlContent = generateResumeHTML(resume);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-software-rasterizer', '--disable-web-security', '--disable-features=VizDisplayCompositor']
    });

    const page = await browser.newPage();

    // Set viewport for better rendering
    await page.setViewport({ width: 794, height: 1123 }); // A4 size

    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Wait a bit more for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      }
    });

    await browser.close();

    // Set headers and send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title || 'resume'}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating PDF'
    });
  }
});

// Helper function to generate HTML from resume data
function generateResumeHTML(resume) {
  const getColorTheme = () => {
    switch (resume.colorTheme) {
      case 'blue':
        return { primary: '#3B82F6', primaryBg: '#DBEAFE', accent: '#3B82F6' };
      case 'green':
        return { primary: '#10B981', primaryBg: '#D1FAE5', accent: '#10B981' };
      case 'purple':
        return { primary: '#8B5CF6', primaryBg: '#E9D5FF', accent: '#8B5CF6' };
      case 'red':
        return { primary: '#EF4444', primaryBg: '#FEE2E2', accent: '#EF4444' };
      case 'indigo':
        return { primary: '#6366F1', primaryBg: '#E0E7FF', accent: '#6366F1' };
      default:
        return { primary: '#3B82F6', primaryBg: '#DBEAFE', accent: '#3B82F6' };
    }
  };

  const colors = getColorTheme();

  const getTemplateStyles = () => {
    switch (resume.template) {
      case 'modern':
        return `
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; background: white; color: #333; font-size: 12px; }
            .container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; }
            .header { border-bottom: 2px solid ${colors.primary}; padding-bottom: 10px; margin-bottom: 15px; }
            .name { font-size: 24px; font-weight: bold; margin-bottom: 4px; }
            .title { font-size: 14px; color: ${colors.primary}; font-weight: 500; margin-bottom: 10px; }
            .contact { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; font-size: 10px; }
            .contact-item { display: flex; align-items: center; gap: 3px; }
            .links { display: flex; gap: 8px; margin-bottom: 10px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 10px; }
            .summary { margin-top: 10px; line-height: 1.4; font-size: 11px; }
            .section { margin-bottom: 15px; }
            .section-title { font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px; padding-bottom: 3px; border-bottom: 1px solid ${colors.primary}; }
            .item { margin-bottom: 10px; }
            .item-title { font-weight: bold; font-size: 12px; margin-bottom: 3px; }
            .item-subtitle { color: ${colors.primary}; font-weight: 500; margin-bottom: 3px; font-size: 11px; }
            .item-date { font-size: 10px; color: #666; margin-bottom: 5px; }
            .item-description { line-height: 1.3; margin-top: 5px; font-size: 10px; }
            .skills { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
            .skill { background: ${colors.primaryBg}; color: ${colors.accent}; padding: 3px 6px; border-radius: 10px; font-size: 9px; font-weight: 500; }
            @media (max-width: 600px) {
              body { padding: 5px; font-size: 10px; }
              .container { max-width: 100%; }
              .name { font-size: 20px; }
              .title { font-size: 12px; }
              .contact { font-size: 8px; gap: 5px; }
              .links { gap: 5px; font-size: 8px; }
              .summary { font-size: 9px; }
              .section-title { font-size: 14px; }
              .item-title { font-size: 10px; }
              .item-subtitle { font-size: 9px; }
              .item-date { font-size: 8px; }
              .item-description { font-size: 8px; }
              .skill { font-size: 7px; padding: 2px 4px; }
            }
          </style>
        `;
      case 'classic':
        return `
          <style>
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; background: white; color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .name { font-size: 36px; font-weight: bold; margin-bottom: 8px; }
            .title { font-size: 18px; color: ${colors.primary}; font-weight: 500; margin-bottom: 20px; }
            .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 20px; font-size: 14px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .links { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 14px; }
            .summary { margin: 20px auto; max-width: 600px; text-align: justify; line-height: 1.6; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
            .item { margin-bottom: 20px; }
            .item-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .item-subtitle { color: ${colors.primary}; font-weight: 500; margin-bottom: 5px; }
            .item-date { font-size: 14px; color: #666; margin-bottom: 10px; }
            .item-description { line-height: 1.6; margin-top: 10px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; justify-content: center; }
            .skill { background: #f0f0f0; color: #333; padding: 3px 8px; font-size: 12px; border: 1px solid #ccc; }
            @media (max-width: 600px) {
              body { padding: 10px; }
              .container { max-width: 100%; }
              .name { font-size: 28px; }
              .title { font-size: 14px; }
              .contact { font-size: 12px; gap: 10px; }
              .links { gap: 10px; font-size: 12px; }
              .summary { font-size: 14px; }
              .section-title { font-size: 16px; }
              .item-title { font-size: 14px; }
              .item-subtitle { font-size: 13px; }
              .item-date { font-size: 12px; }
              .item-description { font-size: 13px; }
              .skill { font-size: 10px; padding: 2px 6px; }
            }
          </style>
        `;
      case 'minimal':
        return `
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { margin-bottom: 40px; }
            .name { font-size: 28px; font-weight: 300; margin-bottom: 5px; }
            .title { font-size: 16px; color: ${colors.primary}; font-weight: 300; margin-bottom: 30px; }
            .contact { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; font-size: 14px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .links { display: flex; gap: 15px; margin-bottom: 20px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 14px; }
            .summary { margin-top: 20px; line-height: 1.6; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: 500; color: #333; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
            .item { margin-bottom: 15px; }
            .item-title { font-weight: 500; font-size: 16px; margin-bottom: 5px; }
            .item-subtitle { color: ${colors.primary}; margin-bottom: 5px; }
            .item-date { font-size: 14px; color: #666; margin-bottom: 10px; }
            .item-description { line-height: 1.6; margin-top: 10px; }
            .skills { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
            .skill { background: #f5f5f5; color: #333; padding: 5px 8px; font-size: 11px; }
            @media (max-width: 600px) {
              body { padding: 10px; }
              .container { max-width: 100%; }
              .name { font-size: 24px; }
              .title { font-size: 14px; }
              .contact { font-size: 12px; gap: 10px; }
              .links { gap: 10px; font-size: 12px; }
              .summary { font-size: 14px; }
              .section-title { font-size: 16px; }
              .item-title { font-size: 14px; }
              .item-subtitle { font-size: 13px; }
              .item-date { font-size: 12px; }
              .item-description { font-size: 13px; }
              .skill { font-size: 9px; padding: 3px 6px; }
            }
          </style>
        `;
      case 'creative':
        return `
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%); color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; position: relative; }
            .name { font-size: 36px; font-weight: bold; background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
            .title { font-size: 20px; color: ${colors.primary}; font-weight: 500; margin-bottom: 20px; }
            .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-bottom: 20px; font-size: 14px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .links { display: flex; justify-content: center; gap: 15px; margin-bottom: 20px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 14px; }
            .summary { margin: 20px auto; max-width: 600px; text-align: justify; line-height: 1.6; }
            .section { margin-bottom: 40px; }
            .section-title { font-size: 24px; font-weight: bold; color: ${colors.primary}; margin-bottom: 20px; text-align: center; position: relative; }
            .item { margin-bottom: 30px; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .item-title { font-weight: bold; font-size: 18px; margin-bottom: 5px; }
            .item-subtitle { color: ${colors.primary}; font-weight: 600; font-size: 16px; margin-bottom: 5px; }
            .item-date { font-size: 14px; color: #666; margin-bottom: 10px; background: #f0f0f0; padding: 3px 8px; border-radius: 5px; display: inline-block; }
            .item-description { line-height: 1.6; margin-top: 10px; }
            .skills { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; justify-content: center; }
            .skill { background: ${colors.primaryBg}; color: ${colors.accent}; padding: 8px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            @media (max-width: 600px) {
              body { padding: 10px; }
              .container { max-width: 100%; }
              .name { font-size: 28px; }
              .title { font-size: 16px; }
              .contact { font-size: 12px; gap: 10px; }
              .links { gap: 10px; font-size: 12px; }
              .summary { font-size: 14px; }
              .section-title { font-size: 20px; }
              .item { padding: 15px; }
              .item-title { font-size: 16px; }
              .item-subtitle { font-size: 14px; }
              .item-date { font-size: 12px; }
              .item-description { font-size: 14px; }
              .skill { font-size: 10px; padding: 6px 12px; }
            }
          </style>
        `;
      case 'professional':
        return `
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f9fafb; color: #333; }
            .container { max-width: 800px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #e5e7eb; }
            .name { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
            .title { font-size: 18px; color: ${colors.primary}; font-weight: 500; margin-bottom: 20px; }
            .contact { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; font-size: 14px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .links { display: flex; gap: 15px; margin-bottom: 20px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 14px; }
            .summary { margin-top: 20px; line-height: 1.6; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 15px; display: flex; align-items: center; }
            .item { margin-bottom: 20px; padding-left: 20px; border-left: 2px solid #e5e7eb; }
            .item-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .item-subtitle { color: ${colors.primary}; font-weight: 500; margin-bottom: 5px; }
            .item-date { font-size: 14px; color: #666; margin-bottom: 10px; background: #f3f4f6; padding: 3px 8px; border-radius: 5px; }
            .item-description { line-height: 1.6; margin-top: 10px; }
            .skills { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px; }
            .skill { background: white; color: #333; padding: 5px 10px; font-size: 12px; border: 1px solid #d1d5db; border-radius: 5px; }
          </style>
        `;
      case 'tech':
        return `
          <style>
            body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; background: #0f172a; color: #e2e8f0; }
            .container { max-width: 800px; margin: 0 auto; background: #1e293b; padding: 30px; border-radius: 10px; }
            .header { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #475569; }
            .name { font-size: 32px; font-weight: bold; color: white; margin-bottom: 8px; }
            .title { font-size: 18px; color: ${colors.primary}; font-weight: 500; margin-bottom: 20px; }
            .contact { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; font-size: 14px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .links { display: flex; gap: 15px; margin-bottom: 20px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 14px; }
            .summary { margin-top: 20px; line-height: 1.6; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: ${colors.primary}; margin-bottom: 15px; display: flex; align-items: center; }
            .item { margin-bottom: 20px; padding: 15px; background: #334155; border-radius: 5px; border-left: 4px solid #3B82F6; }
            .item-title { font-weight: bold; font-size: 16px; color: white; margin-bottom: 5px; }
            .item-subtitle { color: ${colors.primary}; font-weight: 500; margin-bottom: 5px; }
            .item-date { font-size: 14px; color: #94a3b8; margin-bottom: 10px; background: #475569; padding: 3px 8px; border-radius: 5px; }
            .item-description { line-height: 1.6; margin-top: 10px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
            .skill { background: #3B82F6; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-family: monospace; }
            @media (max-width: 600px) {
              body { padding: 10px; }
              .container { max-width: 100%; padding: 20px; }
              .name { font-size: 28px; }
              .title { font-size: 16px; }
              .contact { font-size: 12px; gap: 10px; }
              .links { gap: 10px; font-size: 12px; }
              .summary { font-size: 14px; }
              .section-title { font-size: 18px; }
              .item { padding: 10px; }
              .item-title { font-size: 14px; }
              .item-subtitle { font-size: 13px; }
              .item-date { font-size: 12px; }
              .item-description { font-size: 13px; }
              .skill { font-size: 10px; padding: 3px 8px; }
            }
          </style>
        `;
      default:
        return `
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 4px solid ${colors.primary}; padding-bottom: 20px; margin-bottom: 30px; }
            .name { font-size: 32px; font-weight: bold; margin-bottom: 8px; }
            .title { font-size: 18px; color: ${colors.primary}; font-weight: 500; margin-bottom: 20px; }
            .contact { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; font-size: 14px; }
            .contact-item { display: flex; align-items: center; gap: 5px; }
            .links { display: flex; gap: 15px; margin-bottom: 20px; }
            .links a { color: ${colors.primary}; text-decoration: none; font-size: 14px; }
            .summary { margin-top: 20px; line-height: 1.6; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid ${colors.primary}; }
            .item { margin-bottom: 20px; }
            .item-title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            .item-subtitle { color: ${colors.primary}; font-weight: 500; margin-bottom: 5px; }
            .item-date { font-size: 14px; color: #666; margin-bottom: 10px; }
            .item-description { line-height: 1.6; margin-top: 10px; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
            .skill { background: ${colors.primaryBg}; color: ${colors.accent}; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: 500; }
          </style>
        `;
    }
  };

  const styles = getTemplateStyles();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.title || 'Resume'}</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="name">${resume.personalInfo?.name || 'Your Name'}</h1>
          <p class="title">${resume.personalInfo?.title || 'Your Professional Title'}</p>

          <div class="contact">
            ${resume.personalInfo?.email ? `<div class="contact-item">📧 ${resume.personalInfo.email}</div>` : ''}
            ${resume.personalInfo?.phone ? `<div class="contact-item">📱 ${resume.personalInfo.phone}</div>` : ''}
            ${resume.personalInfo?.location ? `<div class="contact-item">📍 ${resume.personalInfo.location}</div>` : ''}
          </div>

          <div class="links">
            ${resume.personalInfo?.linkedin ? `<a href="${resume.personalInfo.linkedin}" target="_blank">🔗 LinkedIn</a>` : ''}
            ${resume.personalInfo?.github ? `<a href="${resume.personalInfo.github}" target="_blank">🐙 GitHub</a>` : ''}
          </div>

          ${resume.personalInfo?.summary ? `<p class="summary">${resume.personalInfo.summary}</p>` : ''}
        </div>

        ${resume.experience && resume.experience.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${resume.experience.map(exp => `
            <div class="item">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h3 class="item-title">${exp.role}</h3>
                <span class="item-date">${new Date(exp.startDate).getFullYear()} - ${exp.isCurrentRole ? 'Present' : new Date(exp.endDate).getFullYear()}</span>
              </div>
              <p class="item-subtitle">${exp.company}</p>
              ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${resume.education && resume.education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${resume.education.map(edu => `
            <div class="item">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                <h3 class="item-title">${edu.degree}</h3>
                <span class="item-date">${new Date(edu.startDate).getFullYear()} - ${new Date(edu.endDate).getFullYear()}</span>
              </div>
              <p class="item-subtitle">${edu.school}</p>
              ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${resume.skills && resume.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills">
            ${resume.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
        ` : ''}

        ${resume.projects && resume.projects.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${resume.projects.map(project => `
            <div class="item">
              <h3 class="item-title">${project.title}${project.link ? ` <a href="${project.link}" target="_blank" style="color: ${colors.primary}; text-decoration: none;">🔗</a>` : ''}</h3>
              ${project.technologies && project.technologies.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;">
                  ${project.technologies.map(tech => `<span style="font-size: 11px; background: #f0f0f0; color: #666; padding: 2px 6px; border-radius: 3px;">${tech}</span>`).join('')}
                </div>
              ` : ''}
              ${project.description ? `<p class="item-description">${project.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${resume.certificates && resume.certificates.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Certificates</h2>
          ${resume.certificates.map(cert => `
            <div class="item">
              <h3 class="item-title">${cert.title}${cert.link ? ` <a href="${cert.link}" target="_blank" style="color: ${colors.primary}; text-decoration: none;">🔗</a>` : ''}</h3>
              <p class="item-subtitle">${cert.issuer}</p>
              <span class="item-date">${new Date(cert.date).getFullYear()}</span>
              ${cert.description ? `<p class="item-description">${cert.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
