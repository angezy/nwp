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
  body('tos').notEmpty().withMessage('Please accept the Terms of Service.'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const referrer = req.get('Referer');
    const errors = validationResult(req);

    console.log('Received lang:', req.body.lang);
    const lang = req.body.lang === 'fa' ? 'fa' : 'en';

    // Language-specific error messages
    const errorMessages = {
      en: {
        FullName: 'Full name is required.',
        Email: 'Invalid email address.',
        PhoneNumber: 'Invalid phone number.',
        BusinessName: 'Business name is required.',
        Industry: 'Industry is required.',
        HasWebsite: 'Invalid value for HasWebsite.',
        WebsiteURL: 'Invalid URL.',
        ProjectType: 'Invalid project type.',
        WebsiteFeatures: 'Invalid features format.',
        MaintenanceRequired: 'Invalid value for MaintenanceRequired.',
        Budget: 'Budget must be a number.',
        tos: 'Please accept the Terms of Service.',
      },
      fa: {
        FullName: 'وارد کردن نام الزامی است.',
        Email: 'آدرس ایمیل نامعتبر است.',
        PhoneNumber: 'شماره تلفن نامعتبر است.',
        BusinessName: 'وارد کردن نام کسب‌و‌کار الزامی است.',
        Industry: 'وارد کردن صنعت الزامی است.',
        HasWebsite: 'مقدار وارد شده برای وبسایت معتبر نیست.',
        WebsiteURL: 'آدرس وبسایت نامعتبر است.',
        ProjectType: 'نوع پروژه نامعتبر است.',
        WebsiteFeatures: 'فرمت ویژگی‌ها نامعتبر است.',
        MaintenanceRequired: 'مقدار وارد شده برای نیاز به نگهداری معتبر نیست.',
        Budget: 'بودجه باید عدد باشد.',
        tos: 'لطفاً شرایط خدمات را بپذیرید.',
      },
    };

    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
    
      // Collect all error messages for the selected language
      const errorMessagesForLang = errors.array().map((error) => {
        const errorPath = error?.path; // Use path instead of param
        console.log('Validation error path:', errorPath);
    
        // Select the error message for the appropriate language
        return (
          (errorMessages[lang] && errorMessages[lang][errorPath]) || error.msg // Fallback to default message
        );
      });
    
      console.log('Selected error messages for lang:', errorMessagesForLang);
    
      // Include form data and all error messages in query parameters
      const formData = req.body;
      const query = new URLSearchParams({
        errors: encodeURIComponent(JSON.stringify(errorMessagesForLang)), // Encode for safe transmission
        ...formData,
      }).toString();
    
      return res.redirect(`${referrer}?${query}`);
    }
    

    next();
  },
];

module.exports = validateAndSanitize;
