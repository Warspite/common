package com.warspite.common.servlets.sessions
import scala.util.Random
import org.slf4j.LoggerFactory

class Session(val id: Int, private val keeper: SessionKeeper) {
  val logger = LoggerFactory.getLogger(getClass());

  val key: Int = Session.rand.nextInt();
  var touched = System.currentTimeMillis();

  def refresh {
    touched = System.currentTimeMillis();
  }

  def expired: Boolean = {
    System.currentTimeMillis() > touched + keeper.longevityInMillis;
  }
  
  override def toString(): String = {
    "Id:" + id + "   Key:" + key + "   Seconds to live:" + ((touched + keeper.longevityInMillis - System.currentTimeMillis) / 1000);
  }
}

object Session {
  val rand = new Random(System.currentTimeMillis());
}
