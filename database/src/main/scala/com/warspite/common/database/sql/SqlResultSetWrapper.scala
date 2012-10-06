package com.warspite.common.database.sql
import com.warspite.common.database.DataRecord
import java.sql.ResultSet
import org.slf4j.LoggerFactory
import org.scala_tools.time.Imports._
import scala.collection.mutable.Queue
import com.warspite.common.database.IncompleteDataRecordException
import com.warspite.common.database.DatabaseException
import com.warspite.common.database.ExpectedRecordNotFoundException

class SqlResultSetWrapper(val rs: ResultSet, val query: String) {
  protected val log = LoggerFactory.getLogger(getClass());
  val meta = rs.getMetaData();

  def next(closeAfterRetrieval: Boolean = false): Option[DataRecord] = {
    if (!rs.next) {
      rs.getStatement().close();
      return None;
    }

    val dr = new DataRecord;
    for (i <- 1 to meta.getColumnCount()) {
      meta.getColumnType(i) match {
      	case java.sql.Types.INTEGER => {val x: Int = rs.getObject(i).asInstanceOf[Int]; dr.put(meta.getColumnName(i), x);}
        case java.sql.Types.VARCHAR => dr.put(meta.getColumnName(i), rs.getString(i));
        case java.sql.Types.LONGVARCHAR => dr.put(meta.getColumnName(i), rs.getString(i));
        case java.sql.Types.TIMESTAMP => dr.put(meta.getColumnName(i), new DateTime(rs.getTimestamp(i)));
      	case java.sql.Types.FLOAT => {val x: Double = rs.getObject(i).asInstanceOf[Float].toDouble; dr.put(meta.getColumnName(i), x);}
      	case java.sql.Types.REAL => {val x: Double = rs.getObject(i).asInstanceOf[Float].toDouble; dr.put(meta.getColumnName(i), x);}
      	case java.sql.Types.BIT => dr.put(meta.getColumnName(i), rs.getBoolean(i));
        case x => throw new UnrecognizedSqlTypeException(x);
      }
    }

    if(closeAfterRetrieval)
      close();
    
    return Some(dr);
  }

  def close() {
    if (!rs.isClosed())
      rs.getStatement().close();
  }
  
  def buildArray[T](creator: DataRecord => T)(implicit m:ClassManifest[T]): Array[T] = {
    var q = new Queue[T]();
    var done = false;
    try {
      
    while(!done) next() match {
      case Some(x) => q += creator(x);
      case None => done = true;
    }
    }
    catch {
      case e: IncompleteDataRecordException => throw new DatabaseException("Failed to create " + m + " from database. The retrieved data record is missing fields. Query: " + query);
    }
    
    return q.toArray;
  }

  def buildSingle[T](creator: DataRecord => T)(implicit m:ClassManifest[T]): T = {
    val t = next(true).getOrElse(throw new ExpectedRecordNotFoundException("Query for " + m + " returned no results from database. Query: " + query));
    return creator(t);
  }
}