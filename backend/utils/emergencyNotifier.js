const sendEmail = require('./emailService');

/**
 * Sends emergency alerts to the assigned counselor and admin.
 * @param {Object} alert - CrisisAlert document containing details.
 * @param {Object} student - User document of the student who triggered the alert.
 */
const notifyEmergency = async (alert, student) => {
    try {
        const subject = '🚨 Critical Safety Alert: Immediate Action Required';
        const text = `URGENT: A critical safety concern has been detected for student ${student.name} (Anonymous ID: ${student.anonymousId}).\n\nDetected Keywords: ${alert.detectedKeywords.join(', ')}\n\nPlease contact them immediately to ensure their safety.`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #d32f2f;">🚨 Emergency Safety Alert</h2>
                <p>A critical message indicating potential risk was detected from:</p>
                <p><strong>Name:</strong> ${student.name}</p>
                <p><strong>Anonymous ID:</strong> ${student.anonymousId}</p>
                <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <p style="margin: 0; color: #c62828;"><strong>Detected Concern:</strong> ${alert.detectedKeywords.join(', ')}</p>
                </div>
                <p style="font-weight: bold;">Please contact your ward immediately to verify their safety.</p>
            </div>`;

        // Assuming counselor email is stored in student.assignedCounselorEmail (optional)
        const counselorEmail = student.counselorEmail || process.env.DEFAULT_COUNSELOR_EMAIL;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (counselorEmail) {
            await sendEmail(counselorEmail, subject, text, html);
        }
        if (adminEmail) {
            await sendEmail(adminEmail, subject, text, html);
        }

        // Notify Parent (Dynamic)
        const parentEmail = student.parentEmail;
        if (parentEmail) {
            await sendEmail(parentEmail, subject, text, html);
        }
    } catch (err) {
        console.error('Failed to send emergency notifications:', err);
    }
};

module.exports = { notifyEmergency };
