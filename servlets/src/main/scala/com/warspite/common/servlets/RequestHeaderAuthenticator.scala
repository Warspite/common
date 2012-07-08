package com.warspite.common.servlets;

import sessions.SessionKeeper
import javax.servlet.http.HttpServlet
import org.slf4j.LoggerFactory
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest
import com.warspite.common.servlets.sessions.BadSessionKeyException

class RequestHeaderAuthenticator(protected val sessionKeeper: SessionKeeper) extends JsonServlet {
  val SESSION_ID_PARAMETER_NAME = "sessionId";
  val SESSION_KEY_PARAMETER_NAME = "sessionKey";

  def auth(req: HttpServletRequest) = {
    try {
      val authObj = parseHeader("auth", req);
      sessionKeeper.get(authObj.getInt("id"), authObj.getInt("key"));
    }
    catch {
      case e: ClientReadableException => throw e;
      case e: Throwable => throw new ClientReadableException("Failed to authenticate servlet request.", "Something's fishy about your authentication. Please ensure you have a well formed auth JSON object in your request header.", e); 
    }
  }
}
