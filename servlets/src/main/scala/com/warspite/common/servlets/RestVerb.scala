package com.warspite.common.servlets;

object RestVerb extends Enumeration {
  type RestVerb = Value
  val GET = Value("GET")
  val PUT = Value("PUT")
  val POST = Value("POST")
  val DELETE = Value("DELETE")
}
