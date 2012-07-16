package com.warspite.common.servlets;

import com.warspite.common.servlets.RestVerb._
import javax.servlet.http.HttpServlet
import org.slf4j.LoggerFactory
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest
import com.warspite.common.servlets.sessions.SessionKeeper
import com.warspite.common.servlets.sessions.BadSessionKeyException
import com.warspite.common.servlets.json.Parser
import com.warspite.common.database.DataRecord
import com.warspite.common.servlets.json.Parser.ParseException
import org.scala_tools.time.Imports._
import org.joda.time.format.ISODateTimeFormat
import com.warspite.common.database.Mappable

class JsonServlet extends HttpServlet {
  protected val logger = LoggerFactory.getLogger(getClass());

  def handleRequest(verb: RestVerb, request: HttpServletRequest, response: HttpServletResponse) {
    logger.debug("Received " + verb.toString() + " request from " + request.getRemoteHost() + ".");
    val startTime = System.currentTimeMillis();

    var success = false;
    var message = "";
    var jsonOutput = Map[String, Any]();

    try {
      val params = parseHeader("params", request);
      jsonOutput = verb match {
        case RestVerb.GET => get(request, params);
        case RestVerb.PUT => put(request, params);
        case RestVerb.POST => post(request, params);
        case RestVerb.DELETE => delete(request, params);
      }
      success = true;
    } catch {
      case e: ParseException => {
        logger.info("Received malformed JSON: " + e.getMessage());
        message = "Oops! I was unable to parse the JSON parameters of your request.";
      }
      case e: UnsupportedRestVerbException => {
        logger.debug(e.getMessage());
        message = e.clientMessage;
      }
      case e: ClientReadableException => {
        logger.info("Request failed: " + e.getMessage() + " (Client message: " + e.clientMessage + ")");
        message = e.clientMessage;
      }
      case e: Throwable => {
        logger.error("Failed to handle servlet request", e);
        message = "Oops! A request failed due to an internal server error. The problem has been logged and we're fast at work fixing it - promise!";
      }
    }

    try {
      var out = jsonify(Map("success" -> success, "message" -> message, "content" -> jsonOutput));
      response.getWriter().append(out);
      val stopTime = System.currentTimeMillis();
      logger.debug("Responded to " + verb.toString() + " request from " + request.getRemoteHost() + " in " + (stopTime - startTime) + "ms: " + out);
    } catch {
      case e: Throwable => {
        logger.error("Failed to write servlet output!", e);
        response.getWriter().write(jsonify(Map("success" -> false, "message" -> "Something pretty bad happened in the server. We'll look into it as soon as possible!")));
      }
    }
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

  def get(request: HttpServletRequest, params: DataRecord): Map[String, Any] = {
    throw new UnsupportedRestVerbException(RestVerb.GET, getClass().getSimpleName());
  }

  def put(request: HttpServletRequest, params: DataRecord): Map[String, Any] = {
    throw new UnsupportedRestVerbException(RestVerb.PUT, getClass().getSimpleName());
  }

  def post(request: HttpServletRequest, params: DataRecord): Map[String, Any] = {
    throw new UnsupportedRestVerbException(RestVerb.POST, getClass().getSimpleName());
  }

  def delete(request: HttpServletRequest, params: DataRecord): Map[String, Any] = {
    throw new UnsupportedRestVerbException(RestVerb.DELETE, getClass().getSimpleName());
  }

  def jsonify(map: Map[String, Any]): String = {
    var json = "";
    for ((key, value) <- map) {
      if (!json.isEmpty())
        json += ",";

      json += "\"" + key + "\":" + jsonifyVal(value);
    }

    "{" + json + "}"
  }

  def jsonifyVal(v: Any): String = {
    v match {
      case v: Int => return v.toString();
      case v: Integer => return v.toString();
      case v: Float => return v.toString();
      case v: Double => return v.toString();
      case v: Boolean => return v.toString();
      case v: String => return "\"" + v + "\"";
      case v: DateTime => return "\"" + ISODateTimeFormat.dateTime().print(v) + "\"";
      case v: Mappable => return jsonify(v.asMap(true, false));
      case v: Array[_] => {
        var contents = "";
        for (element <- v) {
          if (!contents.isEmpty())
            contents += ",";

          contents += jsonifyVal(element);
        }
        return "[" + contents + "]";
      }
      case ParseableMap(v) => return jsonify(v);
      case v => throw new NotJsonifiableTypeException(v);
    }
  }

  object ParseableMap {
    def unapply(v: Any): Option[Map[String, Any]] = {
      try {
        Some(v.asInstanceOf[Map[String, Any]]);
      } catch {
        case _ => None;
      }
    }
  }

  def parseHeader(header: String, req: HttpServletRequest): DataRecord = {
    val s = req.getHeader(header);

    if (s == null)
      throw new ClientReadableException("Attempted to parse missing request header '" + header + "'.", "I received a malformed request header. I had expected it to contain '" + header + "', but it didn't!.");

    return parseJson(s);
  }

  def parseJson(json: String): DataRecord = {
    return DataRecord(Parser.parse(json).asInstanceOf[Map[String, AnyRef]]);
  }
}
