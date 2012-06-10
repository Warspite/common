package com.warspite.common.servlets.sessions
import scala.collection.mutable.HashMap
import scala.collection.mutable.SynchronizedMap

class SessionKeeper {
  val map = new HashMap[Int, Session];

  def get(id: Int) = {
    try {
      map.synchronized {
        val s = map(id);
        s.refresh;
        s;
      }
    } catch {
      case e: Exception => throw new SessionDoesNotExistException(id);
    }
  }

  def put(id: Int) = {
    map.synchronized {
      if (map.contains(id)) {
        map(id).refresh;
        map(id);
      }
      else {
        val s = new Session(id);
        map += id -> s;
        s;
      }
    }
  }
}