package com.warspite.common.database
import scala.collection.immutable.Queue

class TableRow {
	private var m = Map[String, AnyRef]();
	
	def addCell(name: String, data: AnyRef) {
	  m += name -> data;
	}
	
	def get[T](col: String) = {
	  try {
	    m.get(col).get.asInstanceOf[T];
	  }
	  catch {
	    case e => throw new TableDataRetrievalException(e);
	  }
	}
	
	def size = m.size;
}