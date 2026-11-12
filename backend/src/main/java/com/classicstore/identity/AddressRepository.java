package com.classicstore.identity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.math.BigDecimal;
@Repository
public class AddressRepository {
 private final JdbcTemplate jdbc;
 private static final RowMapper<AddressView> M=(r,n)->new AddressView(r.getObject("id",UUID.class).toString(),r.getString("recipient_name"),r.getString("phone"),r.getString("country_code"),(Long)r.getObject("governorate_id"),(Long)r.getObject("city_id"),r.getString("district"),r.getString("street"),r.getString("building"),r.getString("apartment"),r.getString("postal_code"),decimal(r,"latitude"),decimal(r,"longitude"),r.getBoolean("is_default"));
 public record AddressView(String id,String recipientName,String phone,String countryCode,Long governorateId,Long cityId,String district,String street,String building,String apartment,String postalCode,Double latitude,Double longitude,boolean isDefault){}
 public AddressRepository(JdbcTemplate jdbc){this.jdbc=jdbc;}
 private static Double decimal(ResultSet r,String column)throws SQLException{BigDecimal value=r.getBigDecimal(column);return value==null?null:value.doubleValue();}
 public List<AddressView> list(UUID user){return jdbc.query("select * from store.addresses where user_id=? order by is_default desc,created_at",M,user);}
 public Optional<AddressView> get(UUID user,UUID id){return jdbc.query("select * from store.addresses where user_id=? and id=?",M,user,id).stream().findFirst();}
 @Transactional public AddressView create(UUID user,IdentityDtos.AddressRequest a){
  if(a.isDefault())jdbc.update("update store.addresses set is_default=false where user_id=?",user);
  return jdbc.queryForObject("insert into store.addresses(user_id,recipient_name,phone,country_code,governorate_id,city_id,district,street,building,apartment,postal_code,latitude,longitude,is_default) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?) returning *",M,user,a.recipientName(),a.phone(),a.countryCode(),a.governorateId(),a.cityId(),a.district(),a.street(),a.building(),a.apartment(),a.postalCode(),a.latitude(),a.longitude(),a.isDefault());
 }
 @Transactional public Optional<AddressView> update(UUID user,UUID id,IdentityDtos.AddressRequest a){
  if(get(user,id).isEmpty())return Optional.empty();
  if(a.isDefault())jdbc.update("update store.addresses set is_default=false where user_id=?",user);
  jdbc.update("update store.addresses set recipient_name=?,phone=?,country_code=?,governorate_id=?,city_id=?,district=?,street=?,building=?,apartment=?,postal_code=?,latitude=?,longitude=?,is_default=? where user_id=? and id=?",
   a.recipientName(),a.phone(),a.countryCode(),a.governorateId(),a.cityId(),a.district(),a.street(),a.building(),a.apartment(),a.postalCode(),a.latitude(),a.longitude(),a.isDefault(),user,id);
  return get(user,id);
 }
 public boolean delete(UUID user,UUID id){return jdbc.update("delete from store.addresses where user_id=? and id=?",user,id)==1;}

 public boolean countryEnabled(String code){return !jdbc.query("select 1 from store.countries where code=cast(? as char(2)) and is_enabled=true",(r,n)->1,code).isEmpty();}
 public boolean governorateBelongs(Long id,String country){return id==null||!jdbc.query("select 1 from store.governorates where id=? and country_code=cast(? as char(2))",(r,n)->1,id,country).isEmpty();}
 public boolean cityBelongs(Long id,Long governorate){return id==null||governorate!=null&&!jdbc.query("select 1 from store.cities where id=? and governorate_id=?",(r,n)->1,id,governorate).isEmpty();}
}