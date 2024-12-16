const express = require('express');
const sql = require('mssql');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const validateAndSanitize = require('../middleware/validateAndSanitize');
const router = express.Router();


// POST route for form submission
router.post('/preview-form', validateAndSanitize, async (req, res) => {
  const dbConfig = req.app.get('dbConfig'); // Access DB config from app settings
  const formData = req.body;
      const referrer = req.get('Referer');

  // Validate the incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Sanitize input data to prevent SQL injection or other malicious inputs
    const sanitizedFormData = {
      FullName: validator.escape(formData.FullName || ''),
      Email: validator.normalizeEmail(formData.Email || ''),
      PhoneNumber: validator.escape(formData.PhoneNumber || ''),
      BusinessName: validator.escape(formData.BusinessName || ''),
      Industry: validator.escape(formData.Industry || ''),
      WebsiteURL: validator.isURL(formData.WebsiteURL) ? formData.WebsiteURL : '',
      ProjectType: validator.escape(formData.ProjectType || ''),

      // Handle WebsiteFeatures as an array, if present, join them into a string
      WebsiteFeatures: Array.isArray(formData.WebsiteFeatures) ? formData.WebsiteFeatures.join(', ') : validator.escape(formData.WebsiteFeatures || ''),

      OtherFeatures: Array.isArray(formData.OtherFeatures)
        ? formData.OtherFeatures.join(', ')
        : validator.escape(formData.OtherFeatures || ''),

      DesignStyle: validator.escape(formData.DesignStyle || ''),
      DesignColors: validator.escape(formData.DesignColors || ''),
      DesignInspirations: validator.escape(formData.DesignInspirations || ''),
      TargetAudience: validator.escape(formData.TargetAudience || ''),
      UserActions: validator.escape(formData.UserActions || ''),
      PreferredPlatform: validator.escape(formData.PreferredPlatform || ''),
      ExternalIntegrations: validator.escape(formData.ExternalIntegrations || ''),
      MaintenanceRequired: formData.MaintenanceRequired ? true : false,
      Budget: validator.isInt(formData.Budget || '') ? formData.Budget : null,
      LaunchDate: validator.isDate(formData.LaunchDate || '') ? formData.LaunchDate : null,
      Milestones: validator.escape(formData.Milestones || ''),
      CurrentWebsiteChallenges: validator.escape(formData.CurrentWebsiteChallenges || ''),
      SpecificRequests: validator.escape(formData.SpecificRequests || '')
    };

    // Connect to MSSQL
    const pool = await sql.connect(dbConfig);

    // Insert Data into WebsiteProjectForm_tbl
    const query = `
      INSERT INTO dbo.WebsiteProjectForm_tbl (
        FullName, Email, PhoneNumber, BusinessName, Industry, HasWebsite, WebsiteURL, 
        ProjectType, WebsiteFeatures, OtherFeatures, DesignStyle, DesignColors, 
        DesignInspirations, TargetAudience, UserActions, PreferredPlatform, 
        ExternalIntegrations, MaintenanceRequired, Budget, LaunchDate, Milestones, 
        CurrentWebsiteChallenges, SpecificRequests
      ) VALUES (
        @FullName, @Email, @PhoneNumber, @BusinessName, @Industry, @HasWebsite, @WebsiteURL, 
        @ProjectType, @WebsiteFeatures, @OtherFeatures, @DesignStyle, @DesignColors, 
        @DesignInspirations, @TargetAudience, @UserActions, @PreferredPlatform, 
        @ExternalIntegrations, @MaintenanceRequired, @Budget, @LaunchDate, @Milestones, 
        @CurrentWebsiteChallenges, @SpecificRequests
      )
    `;

    const result = await pool.request()
      .input('FullName', sql.NVarChar, sanitizedFormData.FullName)
      .input('Email', sql.NVarChar, sanitizedFormData.Email)
      .input('PhoneNumber', sql.NVarChar, sanitizedFormData.PhoneNumber)
      .input('BusinessName', sql.NVarChar, sanitizedFormData.BusinessName)
      .input('Industry', sql.NVarChar, sanitizedFormData.Industry)
      .input('HasWebsite', sql.Bit, formData.HasWebsite || false)
      .input('WebsiteURL', sql.NVarChar, sanitizedFormData.WebsiteURL)
      .input('ProjectType', sql.NVarChar, sanitizedFormData.ProjectType)
      .input('WebsiteFeatures', sql.NVarChar, sanitizedFormData.WebsiteFeatures)
      .input('OtherFeatures', sql.NVarChar, sanitizedFormData.OtherFeatures)
      .input('DesignStyle', sql.NVarChar, sanitizedFormData.DesignStyle)
      .input('DesignColors', sql.NVarChar, sanitizedFormData.DesignColors)
      .input('DesignInspirations', sql.NVarChar, sanitizedFormData.DesignInspirations)
      .input('TargetAudience', sql.NVarChar, sanitizedFormData.TargetAudience)
      .input('UserActions', sql.NVarChar, sanitizedFormData.UserActions)
      .input('PreferredPlatform', sql.NVarChar, sanitizedFormData.PreferredPlatform)
      .input('ExternalIntegrations', sql.NVarChar, sanitizedFormData.ExternalIntegrations)
      .input('MaintenanceRequired', sql.Bit, sanitizedFormData.MaintenanceRequired)
      .input('Budget', sql.NVarChar, sanitizedFormData.Budget)
      .input('LaunchDate', sql.Date, sanitizedFormData.LaunchDate)
      .input('Milestones', sql.NVarChar, sanitizedFormData.Milestones)
      .input('CurrentWebsiteChallenges', sql.NVarChar, sanitizedFormData.CurrentWebsiteChallenges)
      .input('SpecificRequests', sql.NVarChar, sanitizedFormData.SpecificRequests)
      .query(query);

      const successMessage = encodeURIComponent("Form submitted successfully!");
    
      // Redirect back to the referring page with a success message
      res.redirect(`${referrer}?success=true&message=${successMessage}`);
    } catch (err) {
      console.error(err);
    
      // Get the referrer URL from the headers
      const errorMessage = encodeURIComponent("Error saving data to database");
    
      // Redirect back to the referring page with an error message
      res.redirect(`${referrer}?error=${errorMessage}`);
  } finally {
    sql.close();
  }
});

module.exports = router;
