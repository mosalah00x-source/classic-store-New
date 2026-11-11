package com.classicstore.identity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class PasswordResetMailer {
 private final JavaMailSender sender; private final IdentityProperties.Mail cfg;
 public PasswordResetMailer(JavaMailSender sender,IdentityProperties p){this.sender=sender;cfg=p.mail();}
 public void send(String email,String token){
  var m=new SimpleMailMessage();m.setFrom(cfg.from());m.setTo(email);
  m.setSubject("Classic Store password reset");
  m.setText("Use this link within 15 minutes: "+cfg.resetUrl()+"?token="+token);
  sender.send(m);
 }
}