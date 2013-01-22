package com.warspite.common.database.types

object IdentifiedType {
  val ID = "id";
  val fields = ID :: StoredType.fields;

  def idMapify[T <: IdentifiedType](in: Seq[T]): Map[Int, T] = {
    in.foldLeft(Map[Int, T]()) { (m, r) => m + (r.id -> r); }
  }
}

abstract class IdentifiedType(var id: Int) extends StoredType {
  override def toString = getClass().getSimpleName() + "#" + id;

  override def asMap(): Map[String, Any] = {
    var map = Map[String, Any]();
    
    if (transientFieldsToBeMapped)
      map += IdentifiedType.ID -> id;

    return map ++ super.asMap();
  }
}