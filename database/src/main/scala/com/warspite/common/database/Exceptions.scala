package com.warspite.common.database

class DatabaseException(msg: String, inner: Throwable) extends Exception(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class DatabaseCreationException(msg: String, inner: Throwable) extends DatabaseException(msg, inner) {
  def this(msg: String) = this(msg, null);
}
