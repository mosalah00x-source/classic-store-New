package com.classicstore.identity;

import org.springframework.stereotype.Component;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class AuthRateLimiter {
 private record Window(long startedAtMillis,int count,long windowMillis){}
 private final ConcurrentHashMap<String,Window> windows=new ConcurrentHashMap<>();
 private final AtomicLong operations=new AtomicLong();

 public boolean allow(String key,int limit,Duration duration){
  long now=System.currentTimeMillis(),window=duration.toMillis();
  Window current=windows.compute(key,(k,old)->old==null||now-old.startedAtMillis()>=window
   ?new Window(now,1,window):new Window(old.startedAtMillis(),old.count()+1,old.windowMillis()));
  if(operations.incrementAndGet()%1024==0)
   windows.entrySet().removeIf(e->now-e.getValue().startedAtMillis()>=e.getValue().windowMillis()*2);
  return current.count()<=limit;
 }
}