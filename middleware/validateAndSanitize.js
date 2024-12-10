const { body, validationResult } = require('express-validator');

const validateAndSanitize = [
  // Section 1
  body('FullName').trim().escape().notEmpty().withMessage('Full name is required.'),
  body('Email').isEmail().withMessage('Invalid email address.').normalizeEmail(),
  body('PhoneNumber').trim().isMobilePhone().withMessage('Invalid phone number.'),
  
  // Section 2
  body('BusinessName').trim().escape().notEmpty().withMessage('Business name is required.'),
  body('Industry').trim().escape().notEmpty().withMessage('Industry is required.'),
  body('HasWebsite').isIn(['Yes', 'No']).withMessage('Invalid value for HasWebsite.'),
  body('WebsiteURL').optional({ checkFalsy: true }).isURL().withMessage('Invalid URL.'),
  
  // Section 3
  body('ProjectType').isIn(['Business', 'E-commerce', 'Portfolio']).withMessage('Invalid project type.'),
  body('WebsiteFeatures').toArray().isArray().withMessage('Invalid features format.'),
  
  // Section 4
  body('DesignStyle').optional().trim().escape(),
  body('DesignColor').optional().trim().escape(),
  body('DesignInspirations').optional().trim().escape(),
  
  // Section 5
  body('TargetAudience').optional().trim().escape(),
  body('UserActions').optional().trim().escape(),
  
  // Section 6
  body('PreferredPlatform').optional().trim().escape(),
  body('ExternalIntegrations').optional().trim().escape(),
  body('MaintenanceRequired').isIn(['Yes', 'No']).withMessage('Invalid value for MaintenanceRequired.'),
  
  // Section 7
  body('Budget').optional().isNumeric().withMessage('Budget must be a number.'),
  body('LaunchDate').optional().trim().escape(),
  body('Milestones').optional().trim().escape(),
  
  // Section 8
  body('CurrentChallenges').optional().trim().escape(),
  
  // Section 9
  body('SpecialRequests').optional().trim().escape(),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateAndSanitize;
