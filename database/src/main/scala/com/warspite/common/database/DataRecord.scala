package com.warspite.common.database

class DataRecord {
  import scala.reflect.Manifest

  private var _map = Map.empty[String, (Manifest[_], Any)]

  def put[T](key: String, item: T)(implicit m: Manifest[T]) {
    _map += key -> (m, item);
  }

  def remove(key: String) {
    _map -= key;
  }
  
  def get[T](key: String)(implicit m: Manifest[T]): T = {
    val obj = _map.get(key)

    obj match {
      case Some((om: Manifest[_], s: Any)) => {
        if (om <:< m)
          s.asInstanceOf[T]
        else
          throw new IncompatibleTypeInDataRecordException(key, this, om, m);
      }
      case _ => throw new IncompleteDataRecordException(key, this);
    }
  }
}
 