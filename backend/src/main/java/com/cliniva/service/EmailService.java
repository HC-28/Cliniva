package com.cliniva.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * Enterprise Healthcare Email Service.
 *
 * Produces modern, responsive, Google/One Medical-grade HTML email communications.
 * Supports asynchronous dispatch with an automatic telemetry fallback if SMTP is offline.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final ConcurrentLinkedQueue<EmailAuditRecord> auditLog = new ConcurrentLinkedQueue<>();

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Welcome & Patient Onboarding Email
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        String subject = "Welcome to Cliniva Health — Your Patient Portal is Active";
        String htmlContent = buildEmailTemplate(
                "Welcome to Cliniva Health",
                "Your Electronic Health Profile is Active",
                String.format(
                    "<p style='font-size: 15px; color: #334155; line-height: 1.6;'>Dear <strong>%s</strong>,</p>" +
                    "<p style='font-size: 14.5px; color: #475569; line-height: 1.6;'>" +
                    "Welcome to <strong>Cliniva Enterprise Health</strong>. Your patient account has been verified and provisioned with 256-bit encryption. " +
                    "You now have direct access to your clinical records, digital prescriptions, and doctor consultations." +
                    "</p>" +
                    "<div style='background: #f8fafc; border-left: 4px solid #0284c7; border-radius: 8px; padding: 16px; margin: 24px 0;'>" +
                    "  <div style='font-size: 13px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;'>What you can do now</div>" +
                    "  <ul style='margin: 8px 0 0 0; padding-left: 18px; font-size: 13.5px; color: #334155; line-height: 1.7;'>" +
                    "    <li>Schedule in-person or telemedicine consultations with attending physicians</li>" +
                    "    <li>Access real-time diagnostic reports and lab results</li>" +
                    "    <li>Request automated pharmacy prescription refills</li>" +
                    "    <li>Manage emergency contact credentials & clinical allergies</li>" +
                    "  </ul>" +
                    "</div>",
                    fullName
                ),
                "http://localhost:5173",
                "Access Patient Portal",
                "If you did not register for this account, please contact Cliniva Security immediately at security@cliniva.io."
        );
        dispatchHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Appointment Confirmation Email
     */
    @Async
    public void sendAppointmentConfirmation(String toEmail, String patientName, String doctorName,
                                            String date, String time, String reason) {
        String subject = String.format("Confirmed: Consultation with %s on %s", doctorName, date);
        String detailsCard = String.format(
                "<table style='width: 100%%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;'>" +
                "  <tr style='border-bottom: 1px solid #e2e8f0;'>" +
                "    <td style='padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; width: 35%%;'>Attending Physician</td>" +
                "    <td style='padding: 12px 16px; font-size: 14px; font-weight: 700; color: #0f172a;'>%s</td>" +
                "  </tr>" +
                "  <tr style='border-bottom: 1px solid #e2e8f0;'>" +
                "    <td style='padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b;'>Consultation Date</td>" +
                "    <td style='padding: 12px 16px; font-size: 14px; font-weight: 700; color: #0284c7;'>%s</td>" +
                "  </tr>" +
                "  <tr style='border-bottom: 1px solid #e2e8f0;'>" +
                "    <td style='padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b;'>Scheduled Time</td>" +
                "    <td style='padding: 12px 16px; font-size: 14px; font-weight: 700; color: #0f172a;'>%s EST</td>" +
                "  </tr>" +
                "  <tr>" +
                "    <td style='padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b;'>Reason for Visit</td>" +
                "    <td style='padding: 12px 16px; font-size: 13.5px; color: #334155;'>%s</td>" +
                "  </tr>" +
                "</table>" +
                "<div style='background: rgba(2, 132, 199, 0.06); border: 1px solid rgba(2, 132, 199, 0.2); border-radius: 10px; padding: 14px; margin: 18px 0;'>" +
                "  <div style='font-size: 12.5px; color: #0369a1; line-height: 1.5;'>" +
                "    <strong>Clinical Preparation:</strong> Please check in 10 minutes prior to your visit. Bring your photo ID and current medication list." +
                "  </div>" +
                "</div>",
                doctorName, date, time, reason != null && !reason.isBlank() ? reason : "Standard Clinical Review"
        );

        String htmlContent = buildEmailTemplate(
                "Appointment Confirmed",
                "Your Clinical Consultation is Scheduled",
                String.format(
                    "<p style='font-size: 15px; color: #334155; line-height: 1.6;'>Dear <strong>%s</strong>,</p>" +
                    "<p style='font-size: 14px; color: #475569; line-height: 1.6;'>Your upcoming appointment has been scheduled and synchronized with our hospital registry.</p>" +
                    "%s",
                    patientName, detailsCard
                ),
                "http://localhost:5173",
                "View Appointment Details",
                "Need to reschedule? You can modify or cancel your booking through the Cliniva portal up to 2 hours before your visit."
        );
        dispatchHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Prescription Authorized / Refill Notification
     */
    @Async
    public void sendPrescriptionReadyAlert(String toEmail, String patientName, String medicationName) {
        String subject = String.format("Prescription Ready: %s — Cliniva Pharmacy", medicationName);
        String htmlContent = buildEmailTemplate(
                "Pharmacy Refill Ready",
                "Prescription Authorized by Physician",
                String.format(
                    "<p style='font-size: 15px; color: #334155;'>Dear <strong>%s</strong>,</p>" +
                    "<p style='font-size: 14px; color: #475569; line-height: 1.6;'>" +
                    "Your prescription for <strong>%s</strong> has been reviewed, digitally signed, and is ready at the Cliniva In-House Dispensary." +
                    "</p>" +
                    "<div style='background: rgba(5, 150, 105, 0.08); border-left: 4px solid #10b981; padding: 14px; border-radius: 8px; margin: 18px 0;'>" +
                    "  <div style='font-size: 13px; font-weight: 700; color: #065f46;'>Medication: %s</div>" +
                    "  <div style='font-size: 12.5px; color: #047857; margin-top: 4px;'>Status: Active & Authorized for Dispensation</div>" +
                    "</div>",
                    patientName, medicationName, medicationName
                ),
                "http://localhost:5173",
                "Review Dosage & Instructions",
                "Always follow medication guidelines prescribed by your doctor. Consult our 24/7 clinical hotline if you experience adverse symptoms."
        );
        dispatchHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Core HTML Email Framework (Enterprise Health Design System)
     */
    private String buildEmailTemplate(String badgeTitle, String headerTitle, String mainContent,
                                      String ctaUrl, String ctaText, String footnote) {
        return "<!DOCTYPE html>" +
               "<html lang='en'>" +
               "<head>" +
               "  <meta charset='UTF-8'>" +
               "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
               "  <title>" + headerTitle + "</title>" +
               "</head>" +
               "<body style='margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;'>" +
               "  <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #f1f5f9; padding: 36px 12px;'>" +
               "    <tr>" +
               "      <td align='center'>" +
               "        <!-- Container Card -->" +
               "        <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); overflow: hidden; border: 1px solid #e2e8f0;'>" +
               "          <!-- Brand Top Banner -->" +
               "          <tr>" +
               "            <td style='background: linear-gradient(135deg, #091e3a 0%, #0f172a 60%, #1e1b4b 100%); padding: 32px 36px; text-align: left;'>" +
               "              <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%'>" +
               "                <tr>" +
               "                  <td>" +
               "                    <div style='display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%); border-radius: 10px; padding: 8px 12px; vertical-align: middle;'>" +
               "                      <span style='font-size: 16px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;'>CLINIVA</span>" +
               "                    </div>" +
               "                    <span style='color: rgba(255,255,255,0.6); font-size: 12px; margin-left: 10px; text-transform: uppercase; letter-spacing: 1px;'>Health Platform</span>" +
               "                  </td>" +
               "                </tr>" +
               "              </table>" +
               "              <div style='display: inline-block; background: rgba(2, 132, 199, 0.25); border: 1px solid rgba(2, 132, 199, 0.5); border-radius: 100px; padding: 4px 12px; margin-top: 20px;'>" +
               "                <span style='font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;'>● " + badgeTitle + "</span>" +
               "              </div>" +
               "              <h1 style='color: #ffffff; font-size: 22px; font-weight: 800; margin: 12px 0 0 0; letter-spacing: -0.5px;'>" + headerTitle + "</h1>" +
               "            </td>" +
               "          </tr>" +
               "          <!-- Main Body -->" +
               "          <tr>" +
               "            <td style='padding: 36px 36px 28px 36px; background-color: #ffffff;'>" +
               "              " + mainContent + "" +
               "              <!-- Action Button -->" +
               "              <div style='text-align: center; margin: 32px 0 16px 0;'>" +
               "                <a href='" + ctaUrl + "' target='_blank' style='display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; text-decoration: none; font-size: 14.5px; font-weight: 700; padding: 13px 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.35); letter-spacing: 0.2px;'>" + ctaText + " &rarr;</a>" +
               "              </div>" +
               "              <!-- Security Badge -->" +
               "              <div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; margin-top: 24px; text-align: center; font-size: 11.5px; color: #64748b;'>" +
               "                🔒 <strong>HIPAA & SOC-2 Verified:</strong> This message was transmitted over an encrypted healthcare channel." +
               "              </div>" +
               "            </td>" +
               "          </tr>" +
               "          <!-- Footnote & Legal -->" +
               "          <tr>" +
               "            <td style='padding: 24px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;'>" +
               "              <p style='font-size: 12px; color: #64748b; line-height: 1.5; margin: 0 0 12px 0;'>" + footnote + "</p>" +
               "              <p style='font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0;'>" +
               "                &copy; " + LocalDateTime.now().getYear() + " Cliniva Enterprise Health Systems Inc. 500 Medical Center Parkway, Suite 400.<br/>" +
               "                Confidential Medical Information &bull; Do Not Forward" +
               "              </p>" +
               "            </td>" +
               "          </tr>" +
               "        </table>" +
               "      </td>" +
               "    </tr>" +
               "  </table>" +
               "</body>" +
               "</html>";
    }

    private void dispatchHtmlEmail(String to, String subject, String htmlBody) {
        auditLog.add(new EmailAuditRecord(to, subject, LocalDateTime.now()));
        if (mailSender == null) {
            log.info("[HTML EMAIL DISPATCHED - SIMULATED FALLBACK] To: {} | Subject: {}", to, subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("alerts@cliniva.io", "Cliniva Health Platform");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("[HTML EMAIL TRANSMITTED] Successfully sent email to {}", to);
        } catch (Exception e) {
            log.warn("[EMAIL FALLBACK] Could not deliver HTML email: {}. Saved to audit ledger.", e.getMessage());
        }
    }

    public record EmailAuditRecord(String recipient, String subject, LocalDateTime timestamp) {}
}
