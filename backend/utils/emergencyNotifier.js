const sendEmail = require('./emailService');

/**
 * Sends emergency alerts to the assigned counselor and admin.
 * @param {Object} alert - CrisisAlert document containing details.
 * @param {Object} student - User document of the student who triggered the alert.
 */
const notifyEmergency = async (alert, student) => {
    try {
        const subject = '🚨 MindCare Emergency Alert';
        const text = `A critical message was detected from student ${student.anonymousId}.\n\nKeywords: ${alert.detectedKeywords.join(', ')}\n\nPlease respond immediately.`;
        const html = `<h3>MindCare Emergency Alert</h3><p>A critical message was detected from student <strong>${student.anonymousId}</strong>.</p><p><strong>Keywords:</strong> ${alert.detectedKeywords.join(', ')}</p><p>Please respond immediately.</p>`;

        // Assuming counselor email is stored in student.assignedCounselorEmail (optional)
        const counselorEmail = student.counselorEmail || process.env.DEFAULT_COUNSELOR_EMAIL;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (counselorEmail) {
            await sendEmail(counselorEmail, subject, text, html);
        }
        if (adminEmail) {
            await sendEmail(adminEmail, subject, text, html);
        }

        // Notify Parent (Specific request)
        const parentEmail = 'nithyadhandhandapani@gmail.com';
        if (parentEmail) {
            await sendEmail(parentEmail, subject, text, html);
        }
    } catch (err) {
        console.error('Failed to send emergency notifications:', err);
    }
};

module.exports = { notifyEmergency };
