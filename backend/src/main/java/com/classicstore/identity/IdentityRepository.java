package com.classicstore.identity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public class IdentityRepository {
 private final JdbcTemplate jdbc;
 private static final RowMapper<UserRecord> M=(r,n)->new UserRecord(r.getObject("id",UUID.class),r.getString("email"),r.getString("phone"),r.getString("password_hash"),r.getString("first_name"),r.getString("last_name"),r.getString("role"),r.getBoolean("is_active"));
 public IdentityRepository(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public Optional<UserRecord> byIdentifier(String v){return jdbc.query("select * from store.users where email=? or phone=?",M,v,v).stream().findFirst();}
 public Optional<UserRecord> byId(UUID id){return jdbc.query("select * from store.users where id=?",M,id).stream().findFirst();}
 public boolean emailExists(String e){return !jdbc.query("select 1 from store.users where email=?", (r,n)->1,e).isEmpty();}
 public boolean phoneExists(String p){return !jdbc.query("select 1 from store.users where phone=?", (r,n)->1,p).isEmpty();}
 public UserRecord create(String email,String phone,String hash,String first,String last){
  return jdbc.queryForObject("insert into store.users(email,phone,password_hash,first_name,last_name,role) values (?,?,?,?,?,'CUSTOMER') returning *",M,email,phone,hash,first,last);
 }
 public boolean updatePasswordIfCurrent(UUID id,String expectedHash,String newHash){
  return jdbc.update("update store.users set password_hash=?,updated_at=now() where id=? and password_hash=?",newHash,id,expectedHash)==1;
 }
 public void updateProfile(UUID id,String first,String last,String phone){
  jdbc.update("update store.users set first_name=coalesce(?,first_name),last_name=coalesce(?,last_name),phone=coalesce(?,phone),updated_at=now() where id=?",first,last,phone,id);
 }
}