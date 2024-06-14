package project.back.msnotifications.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

  @Resource
  private JavaMailSender mailSender;

  @Value("${spring.mail.from}")
  private String from;

  public void sendEmail(String email, String subject, String content) throws MessagingException, UnsupportedEncodingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message);

    helper.setFrom(from);
    helper.setTo(email);

    helper.setSubject(subject);
    helper.setText(content, true);

    mailSender.send(message);
  }
}
