package com.warspite.common.servlets.sessions
import scala.collection.mutable.HashMap
import scala.collection.mutable.SynchronizedMap
import com.warspite.common.cli.CliListener
import com.warspite.common.cli.annotations.Cmd

class SessionKeeper extends CliListener {
  var longevityInMinutes = 15;
  val map = new HashMap[Int, Session];
  val timer = new SessionTimer(1000, this);
  
  def start { timer.start }
  def stop { timer ! Stop }
  
  def longevityInMillis = longevityInMinutes * 60 * 1000;

  def get(id: Int, key: Int): Session = {
    val s = get(id);
    if(s.key != key)
      throw new BadSessionKeyException(s, key);
    
    s;
  }
  
  def get(id: Int): Session = {
    try {
      map.synchronized {
        val s = map(id);
        s.refresh;
        s;
      }
    } catch {
      case e: Exception => throw new SessionDoesNotExistException(id, longevityInMinutes);
    }
  }
  
  def cullExpiredSessions {
    map.synchronized {
      map.values.filter(s => s.expired).foreach(s => map.remove(s.id));
    }
  }

  @Cmd(name = "put", description = "Insert a new session with <id>. If it already exists it will simply be refreshed.", printReturnValue = true)
  def put(id: Int): Session = {
    map.synchronized {
      if (map.contains(id)) {
        map(id).refresh;
        map(id);
      } else {
        val s = new Session(id, this);
        map += id -> s;
        s;
      }
    }
  }

  @Cmd(name = "list", description = "List active sessions", printReturnValue = true)
  def printSessions: String = {
    map.synchronized {
      if (map.isEmpty)
        return "No active sessions."

      var out = "";
      val lineBreak = System.getProperty("line.separator");
      for ((key, value) <- map) out += value + lineBreak;
      return out;
    }
  }

  @Cmd(name = "setlongevity", description = "Set the session longevity in <minutes>.", printReturnValue = false)
  def setLongevityInMinutes(minutes: Int) {
    longevityInMinutes = minutes;
  }
}