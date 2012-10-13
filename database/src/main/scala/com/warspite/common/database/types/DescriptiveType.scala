package com.warspite.common.database.types

object DescriptiveType {
  val NAME = "name";
  val DESCRIPTION = "description";
  val CANONICAL_NAME = "canonicalName";

  val fields = List(NAME, DESCRIPTION, CANONICAL_NAME) ++ IdentifiedType.fields;

  def canonicalNameMapify[T <: DescriptiveType](in: Seq[T]): Map[String, T] = {
    in.foldLeft(Map[String, T]()) { (m, r) => m + (r.canonicalName -> r); }
  }

}

abstract class DescriptiveType(id: Int, var name: String, var description: String, var canonicalName: String) extends IdentifiedType(id) {
  override def toString = getClass().getSimpleName() + "#" + id + " [" + canonicalName + "]";

  override def asMap(includeNonDatabaseInsertionFields: Boolean = true, includeSensitiveInformation: Boolean = false): Map[String, Any] = {
    var map = Map[String, Any](
      DescriptiveType.NAME -> name,
      DescriptiveType.DESCRIPTION -> description,
      DescriptiveType.CANONICAL_NAME -> canonicalName);

    return map ++ super.asMap(includeNonDatabaseInsertionFields, includeSensitiveInformation);
  }
}