package com.warspite.common.database.sql
import com.warspite.common.database.DatabaseException

class SqlException(msg: String, inner: Throwable) extends DatabaseException(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class QueryFailedException(query: String, inner: Throwable) extends SqlException("Failed to execute query '" + query + "'.", inner) {}
class StatementFailedException(s: String, inner: Throwable) extends SqlException("Failed to execute statement '" + s + "'.", inner) {}
class BatchFailedException(b: Array[String], inner: Throwable) extends SqlException("Failed to execute batch of '" + b.length + " statements'.", inner) {}
class UnrecognizedSqlTypeException(typeNum: Int) extends SqlException("Received unrecognized SQL type " + typeNum + ".") {}
