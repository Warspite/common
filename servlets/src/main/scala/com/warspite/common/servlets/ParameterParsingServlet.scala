package com.warspite.common.servlets

import javax.servlet.http.HttpServlet
import org.slf4j.LoggerFactory
import javax.servlet.http.HttpServletResponse
import javax.servlet.http.HttpServletRequest

class ParameterParsingServlet extends HttpServlet {
  protected val logger = LoggerFactory.getLogger(getClass());

  def getIntParameter(p: String, req: HttpServletRequest, required: Boolean = true): java.lang.Integer = {
    var value = "";

    value = req.getParameter(p);

    if (value == null) {
      if (required)
        throw new ClientReadableException("Received request is missing required parameter " + p + ".", "Oops! Couldn't find the expected " + p + " parameter in a request made by your client :(");
      else
        return null;
    }
    try {
      value.toInt;
    } catch {
      case e: NumberFormatException => throw new ClientReadableException("Received request has parameter " + p + " with value " + value + " that can not be parsed to an integer.", "Oops! I couldn't understand the value of the " + p + " parameter in your request. I thought it would be an integer, but it was " + value + ".");
    }
  }

  def getStringParameter(p: String, req: HttpServletRequest, required: Boolean = true): String = {
    val value = req.getParameter(p);
    if (value == null && required)
      throw new ClientReadableException("Received request is missing required parameter " + p + ".", "Oops! Couldn't find the expected " + p + " parameter in a request made by your client :(");

    value;
  }
}
