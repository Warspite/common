package com.warspite.common.database.sql
import java.sql.Connection
import scala.collection.mutable.Queue
import java.sql.SQLException
import org.slf4j.LoggerFactory
import java.sql.Statement

class MySqlQueryer(val connection: Connection) {
  protected val log = LoggerFactory.getLogger(getClass());

  def query(columnNames: List[String], q: String): SqlResultSetWrapper = {
    val query = "SELECT " + columnNames.reduceLeft(_ + ", " + _) + " " + q;
    var stmt: Statement = null;
    try {
      log.debug("Executing query '" + query + "'.");
      stmt = connection.createStatement();
      return new SqlResultSetWrapper(stmt.executeQuery(query));
    } catch {
      case e: SQLException => throw new QueryFailedException(query, e);
    }
  }

  def stmt(s: String): Int = {
    var stmt: Statement = null;
    try {
      log.debug("Executing statement '" + s + "'.");
      stmt = connection.createStatement();
      return stmt.executeUpdate(s);
    } catch {
      case e: SQLException => throw new StatementFailedException(s, e);
    } finally {
      if (stmt != null)
        stmt.close();
    }
  }

  def insert(table: String, values: Map[String, Any]): Int = {
    stmt(composeInsertString(table, values));
  }

  def composeInsertString(table: String, values: Map[String, Any]): String = {
    var s = "INSERT INTO " + table + " (";
    values foreach ( (t) => s += (t._1 + ","));
    s = s.substring(0, s.length() - 1);
    s += ") VALUES (";
    
    values foreach ( (t) => {
      t._2 match {
        case v: String => s += ("'" + v.replace("'", "\\'") + "',");
        case v => s += (v.toString + ",");
      }
    });
    
    s = s.substring(0, s.length() - 1);
    s += ");";
    s
  }
}
