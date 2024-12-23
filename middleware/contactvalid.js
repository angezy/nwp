const { body, validationResult } = require('express-validator');

// Validation rules for signup
const validatecontact = [
    body('FullName').notEmpty().withMessage('Full name is required'),
    body('Email').isEmail().withMessage('Valid email is required'),
    body('content').notEmpty().withMessage('Content cannot exceed 10000 characters'),

    // Middleware to handle validation errors
    (req, res, next) => {
        const referrer = req.get('Referer');
        const errors = validationResult(req);
        const lang = req.body.lang === 'fa' ? 'fa' : 'en';

        // Language-specific error messages
        const errorMessages = {
            en: {
                FullName: 'Full name is required.',
                Email: 'Invalid email address.',
                content: 'Content cannot exceed 10000 characters.',

            },
            fa: {
                FullName: 'وارد کردن نام الزامی است.',
                Email: 'آدرس ایمیل نامعتبر است.',
                content: 'محتوا نباید بیش از 10000 کاراکتر باشد.',
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


module.exports = validatecontact;
