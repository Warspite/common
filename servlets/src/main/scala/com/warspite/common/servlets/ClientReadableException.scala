package com.warspite.common.servlets;

class ClientReadableException(msg: String, val clientMessage: String, inner: Throwable) extends Exception(msg, inner) {
  def this(msg: String, clientMessage: String) = this(msg, clientMessage, null);
}