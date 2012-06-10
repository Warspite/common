package com.warspite.common.servlets.sessions
import scala.util.Random
import org.slf4j.LoggerFactory

class Session(val id: Int) {
  val logger = LoggerFactory.getLogger(getClass());

  val key: Long = Session.rand.nextLong();
  var timeout = System.currentTimeMillis() + Session.longevityInMillis;

  def refresh {
    timeout = System.currentTimeMillis() + Session.longevityInMillis;
  }

  def expired: Boolean = {
    System.currentTimeMillis() > timeout;
  }
}

object Session {
  val rand = new Random(System.currentTimeMillis());
  val KEY_LENGTH = 16;
  var longevityInMinutes = 15;

  def longevityInMillis = longevityInMinutes * 60 * 1000;
}
