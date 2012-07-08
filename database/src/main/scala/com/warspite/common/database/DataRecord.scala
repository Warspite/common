package com.warspite.common.database

object DataRecord {
  def apply(m: Map[String, Any]): DataRecord = {
    val dr = new DataRecord();
    m foreach ((tuple) => dr.put(tuple._1, tuple._2));
    return dr;
  }
}

class DataRecord {
  import scala.reflect.Manifest

  private var _map = Map.empty[String, ManifestTuple]

  def put[T](key: String, item: T)(implicit m: Manifest[T]) {
    _map += key -> new ManifestTuple(m, item);
  }

  def remove(key: String) {
    _map -= key;
  }
  
  def contains(key: String): Boolean = {
    return _map.contains(key);
  }

  private def find(key: String): ManifestTuple = {
    val obj = _map.get(key)

    obj match {
      case Some(x: ManifestTuple) => x;
      case _ => throw new IncompleteDataRecordException(key, this);
    }
  }
  
  def get[T](key: String)(implicit m: Manifest[T]): T = {
    val tuple = find(key);
    if (tuple.m <:< m)
      tuple.o.asInstanceOf[T]
    else
      throw new IncompatibleTypeInDataRecordException(key, this, tuple.m.toString(), m.toString());
  }

  def getInt(key: String, allowCasting: Boolean = true): Int = {
    val tuple = find(key);
    try {
    	val x: Int = tuple.o.asInstanceOf[Int];
    	return x;
    }
    catch {
      case e: ClassCastException => {
        if(allowCasting) {
          try {
        	  return tuple.o.asInstanceOf[Double].toInt;
          }
          catch {
            case _ => throw new IncompatibleTypeInDataRecordException(key, this, tuple.o.getClass().getName(), classOf[Int].getName());
          }
        }
        throw new IncompatibleTypeInDataRecordException(key, this, tuple.o.getClass().getName(), classOf[Int].getName());
      }
    }
  }

  def getDouble(key: String): Double = {
    val tuple = find(key);
    try {
    	val x: Double = tuple.o.asInstanceOf[Double];
    	return x;
    }
    catch {
      case e: ClassCastException => throw new IncompatibleTypeInDataRecordException(key, this, tuple.o.getClass().getName(), classOf[Double].getName());
    }
  }

  def getString(key: String): String = {
    val tuple = find(key);
    try {
    	val x: String = tuple.o.asInstanceOf[String];
    	return x;
    }
    catch {
      case e: ClassCastException => throw new IncompatibleTypeInDataRecordException(key, this, tuple.o.getClass().getName(), classOf[String].getName());
    }
  }

  def getDataRecord(key: String): DataRecord = {
    val tuple = find(key);
    try {
    	val x: Map[String, Any] = tuple.o.asInstanceOf[Map[String, Any]];
    	return DataRecord(x);
    }
    catch {
      case e: ClassCastException => throw new IncompatibleTypeInDataRecordException(key, this, tuple.o.getClass().getName(), classOf[Map[String, Any]].getName());
    }
  }
}

class ManifestTuple(val m: Manifest[_], val o: Any) {}
 