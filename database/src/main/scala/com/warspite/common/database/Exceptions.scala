package com.warspite.common.database

class DatabaseException(msg: String, inner: Throwable) extends Exception(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class DatabaseCreationException(msg: String, inner: Throwable) extends DatabaseException(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class TableDataRetrievalException(inner: Throwable) extends DatabaseException("Failed to retrieve data from table.", inner) {}

class UnexpectedNumberOfRowsException(expected: Int, actual: Int, query: String) extends DatabaseException("Unexpected number of rows in data set. Expected " + expected + ", but received " + actual + ". Query: '" + query + "'." ) {}

