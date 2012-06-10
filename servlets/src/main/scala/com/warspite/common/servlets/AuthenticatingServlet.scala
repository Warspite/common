package com.warspite.common.servlets;

import sessions.SessionKeeper
import javax.servlet.http.HttpServlet
import org.slf4j.LoggerFactory
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest
import com.warspite.common.servlets.sessions.BadSessionKeyException

class AuthenticatingServlet(protected val sessionKeeper: SessionKeeper) extends ParameterParsingServlet {
  val SESSION_ID_PARAMETER_NAME = "sessionId";
  val SESSION_KEY_PARAMETER_NAME = "sessionKey";

  def authenticateRequest(req: HttpServletRequest) = {
    val id = getIntParameter(SESSION_ID_PARAMETER_NAME, req);
    val key = getLongParameter(SESSION_KEY_PARAMETER_NAME, req);
    val session = sessionKeeper.get(id);
    
    if(!session.key.equals(key))
      throw new BadSessionKeyException(session, key);
    
    session;
  }
}
