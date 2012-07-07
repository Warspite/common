package com.warspite.common.database.sql
import java.sql.Connection
import scala.collection.mutable.Queue
import java.sql.SQLException
import org.slf4j.LoggerFactory

class MySqlQueryer(val connection: Connection) {
  protected val log = LoggerFactory.getLogger(getClass());

  def query(columnNames: List[String], q: String): SqlResultSetWrapper = {
    val query = "SELECT " + columnNames.reduceLeft(_ + ", " + _) + " " + q;
    try {
      log.debug("Executing query '" + query + "'.");
      return new SqlResultSetWrapper(connection.createStatement().executeQuery(query));
    } catch {
      case e: SQLException => throw new QueryFailedException(query, e);
    }
  }
}
