package com.warspite.common.servlets;
import com.warspite.common.servlets.RestVerb._
import com.warspite.common.servlets.sessions.Session

class ClientReadableException(msg: String, val clientMessage: String, inner: Throwable) extends Exception(msg, inner) {
  def this(msg: String, clientMessage: String) = this(msg, clientMessage, null);
  def this(inner: Throwable, clientMessage: String) = this(inner.getMessage(), clientMessage, inner);
}

class UnsupportedRestVerbException(verb: RestVerb, servletName: String) extends ClientReadableException("Servlet " + servletName + " received a " + verb + " request, which it does not support.", "Sorry! This servlet does not support " + verb + " requests.", null) {}
class NotJsonifiableTypeException(obj: Any) extends Exception("Jsonification failed. Don't know how to jsonify objects of type " + obj.asInstanceOf[AnyRef].getClass) {}
class AuthorizationFailureException(session: Session) extends ClientReadableException("Unauthorized servlet request by session " + session + " intercepted.", "Oops! It seems you were trying to perform an unauthorized action. That's most unfortunate :(") {}
