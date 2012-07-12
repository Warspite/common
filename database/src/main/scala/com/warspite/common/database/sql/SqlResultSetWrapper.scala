package com.warspite.common.database.sql
import com.warspite.common.database.DataRecord
import java.sql.ResultSet
import org.slf4j.LoggerFactory

class SqlResultSetWrapper(val rs: ResultSet) {
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
}