package com.warspite.common.database.types
import com.warspite.common.database.Mappable
import com.warspite.common.database.json.JsonSerializable
import com.warspite.common.database.json.Json

object StoredType {
  val fields = List[String]();
}

abstract class StoredType extends Mappable with JsonSerializable {
  def asMap(): Map[String, Any] = {
    Map[String, Any]();
  }
  
  def toJson(): String = {
    Json.build(asMap()).toString();
  }
}