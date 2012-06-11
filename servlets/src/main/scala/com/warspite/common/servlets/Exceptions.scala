package com.warspite.common.servlets;
import com.warspite.common.servlets.RestVerb._

class ClientReadableException(msg: String, val clientMessage: String, inner: Throwable) extends Exception(msg, inner) {
  def this(msg: String, clientMessage: String) = this(msg, clientMessage, null);
}

class UnsupportedRestVerbException(verb: RestVerb, servletName: String) extends ClientReadableException("Servlet " + servletName + " received a " + verb + " request, which it does not support.", "Sorry! This servlet does not support " + verb + " requests.", null) {}


class NotJsonifiableTypeException(obj: Any) extends Exception("Jsonification failed. Don't know how to jsonify objects of type " + obj.asInstanceOf[AnyRef].getClass) {}