package com.classicstore.identity.security;
import com.classicstore.identity.TokenService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final TokenService tokens;
 public JwtAuthenticationFilter(TokenService tokens){this.tokens=tokens;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null){
   try{
    if(!h.startsWith("Bearer "))throw new IllegalArgumentException();
    Claims c=tokens.parse(h.substring(7));
    if(!"access".equals(c.get("typ",String.class)))throw new IllegalArgumentException();
    var auth=new UsernamePasswordAuthenticationToken(c.getSubject(),null,List.of(new SimpleGrantedAuthority("ROLE_"+c.get("role",String.class))));
    SecurityContextHolder.getContext().setAuthentication(auth);
   }catch(Exception ex){SecurityContextHolder.clearContext();req.setAttribute("identity.invalidToken",Boolean.TRUE);}
  }
  chain.doFilter(req,res);
 }
}