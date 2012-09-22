package com.warspite.common.database.types
import com.warspite.common.database.Mappable

object StoredType {
  val fields = List[String]();
}

abstract class StoredType extends Mappable {
  def asMap(includeNonDatabaseInsertionFields: Boolean = true, includeSensitiveInformation: Boolean = false): Map[String, Any] = {
    Map[String, Any]();
  }
}