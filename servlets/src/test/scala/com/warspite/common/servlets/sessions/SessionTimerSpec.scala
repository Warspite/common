package com.warspite.common.servlets.sessions

import org.scalatest.junit.JUnitRunner
import org.junit.runner.RunWith
import org.scalatest.FlatSpec
import org.scalatest.junit.ShouldMatchersForJUnit
import com.warspite.common.servlets.{ JsonServlet, NotJsonifiableTypeException }
import java.util.HashMap
import org.scalatest.BeforeAndAfterEach

@RunWith(classOf[JUnitRunner])
class SessionTimerSpec extends FlatSpec with ShouldMatchersForJUnit with BeforeAndAfterEach {
  var k: SessionKeeper = null;

  override def beforeEach() {
    k = new SessionKeeper();
  }

  "SessionKeeper" should "remove expired sessions and only expired sessions when cullExpired is called" in {
    var validSession = new Session(2, k);
    var expiredSession = new Session(1, k);
    expiredSession.touched = 0;

    k.map += expiredSession.id -> expiredSession;
    k.map += validSession.id -> validSession;
    
    k.cullExpiredSessions;
    
    k.map.size should equal(1);
    k.map.get(1) should equal(None);
    k.map.get(2).get should equal(validSession);
  }
}