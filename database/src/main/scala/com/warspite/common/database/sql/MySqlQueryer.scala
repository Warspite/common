package com.warspite.common.database.sql
import java.sql.Connection
import scala.collection.mutable.Queue
import java.sql.SQLException
import org.slf4j.LoggerFactory
import java.sql.Statement
import org.scala_tools.time.Imports._

class MySqlQueryer(val connection: Connection) {
  protected val log = LoggerFactory.getLogger(getClass());

  def query(query: String): SqlResultSetWrapper = {
    var stmt: Statement = null;
    try {
      log.debug("Executing query '" + query + "'.");
      stmt = connection.createStatement();
      return new SqlResultSetWrapper(stmt.executeQuery(query), query);
    } catch {
      case e: SQLException => throw new QueryFailedException(query, e);
    }
  }

  def query(columnNames: List[String], q: String, tableName: String = null): SqlResultSetWrapper = {
    query(buildQueryString(columnNames, q, tableName));
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

  def batch(b: Array[String]): Array[Int] = {
    var stmt: Statement = null;
    try {
      log.debug("Creating batch of " + b.length + " statements.");
      stmt = connection.createStatement();
      for(s <- b)
        stmt.addBatch(s);
      
      return stmt.executeBatch();
    } catch {
      case e: SQLException => throw new BatchFailedException(b, e);
    } finally {
      if (stmt != null)
        stmt.close();
    }
  }
  
  def buildQueryString(columnNames: List[String], q: String, tableName: String = null): String = {
    var actualColumnNames = columnNames;
    if (tableName != null)
      actualColumnNames = columnNames.map(s => tableName + "." + s);

    "SELECT " + actualColumnNames.reduceLeft(_ + ", " + _) + " " + q;
  }

  def insertArray(table: String, values: Array[Map[String, Any]]): Array[Int] = {
    batch(values.map(v => composeInsertString(table, v)));
  }
  
  def insert(table: String, values: Map[String, Any]): Int = {
    stmt(composeInsertString(table, values));
  }

  def composeInsertString(table: String, values: Map[String, Any]): String = {
    var s = "INSERT INTO " + table + " (";
    values foreach ((t) => s += (t._1 + ","));
    s = s.substring(0, s.length() - 1);
    s += ") VALUES (";

    values foreach ((t) => {
      t._2 match {
        case v: String => s += ("'" + StringEscaper.escape(v) + "',");
        case v: DateTime => s += ("'" + v.toLocalDateTime() + "',");
        case v => s += (v.toString + ",");
      }
    });

    s = s.substring(0, s.length() - 1);
    s += ");";
    s
  }
}
