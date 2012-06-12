package com.warspite.common.servlets.sessions
import scala.actors._
import scala.actors.Actor._

case object Stop

class SessionTimer(val intervalMillis: Long, val keeper: SessionKeeper) extends Actor {
  def act {
    loop {
      reactWithin(intervalMillis) {
        case TIMEOUT => keeper.cullExpiredSessions
        case Stop => exit
      }
    }
  }
}
