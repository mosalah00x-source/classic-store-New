package com.classicstore.identity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class PasswordResetMailer {
 private static final Logger log=LoggerFactory.getLogger(PasswordResetMailer.class);
 private final JavaMailSender sender; private final IdentityProperties.Mail cfg;
 public PasswordResetMailer(JavaMailSender sender,IdentityProperties p){this.sender=sender;cfg=p.mail();}
 @Async public void send(String email,String token){
  try{
  var m=new SimpleMailMessage();m.setFrom(cfg.from());m.setTo(email);
  m.setSubject("Classic Store password reset");
  m.setText("Use this link within 15 minutes: "+cfg.resetUrl()+"?token="+token);
  sender.send(m);
  }catch(Exception ex){log.warn("Password reset email delivery failed");}
 }
}