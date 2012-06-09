package com.warspite.common.servlets;

import com.warspite.common.servlets.RestVerb._
import javax.servlet.http.HttpServlet
import org.slf4j.LoggerFactory
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest

class JsonServlet extends HttpServlet {
  private val logger = LoggerFactory.getLogger(getClass());

  def handleRequest(verb: RestVerb, request: HttpServletRequest, response: HttpServletResponse) {
    logger.debug("Received " + verb.toString() + " request from " + request.getRemoteHost() + ".");
    val startTime = System.currentTimeMillis();

    var success = false;
    var message = "";
    var content = "";

    try {
      content = verb match {
        case RestVerb.GET => get(request);
        case RestVerb.PUT => put(request);
        case RestVerb.POST => post(request);
        case RestVerb.DELETE => delete(request);
      }
      success = true;
    } catch {
      case e: UnsupportedRestVerbException => {
        logger.debug(e.getMessage());
        message = e.clientMessage;
      }
      case e: ClientReadableException => {
        logger.error("Failed to handle servlet request. Client message: \"" + e.clientMessage + "\"", e);
        message = e.clientMessage;
      }
      case e: Throwable => {
        logger.error("Failed to handle servlet request", e);
        message = "Oops! A request failed due to an internal server error. The problem has been logged and we're fast at work fixing it - promise!";
      }
    }

    response.getWriter().append(jsonify(success, message, content));
    val stopTime = System.currentTimeMillis();
    logger.debug("Responded to " + verb.toString() + " request from " + request.getRemoteHost() + " in " + (stopTime - startTime) + "ms.");
  }

  override def doGet(request: HttpServletRequest, response: HttpServletResponse) {
    handleRequest(RestVerb.GET, request, response);
  }

  override def doPut(request: HttpServletRequest, response: HttpServletResponse) {
    handleRequest(RestVerb.PUT, request, response);
  }

  override def doDelete(request: HttpServletRequest, response: HttpServletResponse) {
    handleRequest(RestVerb.DELETE, request, response);
  }

  override def doPost(request: HttpServletRequest, response: HttpServletResponse) {
    handleRequest(RestVerb.POST, request, response);
  }

  def get(request: HttpServletRequest): String = {
    throw new UnsupportedRestVerbException(RestVerb.GET, getClass().getSimpleName());
  }

  def put(request: HttpServletRequest): String = {
    throw new UnsupportedRestVerbException(RestVerb.PUT, getClass().getSimpleName());
  }

  def post(request: HttpServletRequest): String = {
    throw new UnsupportedRestVerbException(RestVerb.POST, getClass().getSimpleName());
  }

  def delete(request: HttpServletRequest): String = {
    throw new UnsupportedRestVerbException(RestVerb.DELETE, getClass().getSimpleName());
  }

  def jsonify(success: Boolean, message: String, content: String) = {
    "{\"success\":" + success + ",\"message\":\"" + message.replace("\"", "\\\"") + "\", \"content\": {" + content + "}}"
  }
}
