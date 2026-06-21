package com.sneha.notification_system.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    public boolean sendEmail(String toEmail, String subject, String message) {
        try {
            Email from = new Email(fromEmail);
            Email to = new Email(toEmail);
            Content content = new Content("text/plain", message);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email sent successfully to={} statusCode={}",
                        toEmail, response.getStatusCode());
                return true;
            } else {
                log.error("Failed to send email to={} statusCode={} body={}",
                        toEmail, response.getStatusCode(), response.getBody());
                return false;
            }

        } catch (IOException e) {
            log.error("Exception sending email to={} error={}", toEmail, e.getMessage());
            return false;
        }
    }
}