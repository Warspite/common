package com.warspite.common.database.sql
import com.warspite.common.database.DataRecord
import java.sql.ResultSet

class SqlResultSetWrapper(val rs: ResultSet) {

  def hasNext: Boolean = {
    return true;
  }

  def next: DataRecord = {
    return null;
  }
}