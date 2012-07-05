package com.warspite.common.database
import scala.collection.immutable.Queue

class Table {
  private var q = Queue[TableRow]();
  var size = 0;

  def addRow(row: TableRow) {
    q = q.enqueue(row);
    size += 1;
  }

  def get[T](row: Int, col: String) = {
    q(row).get[T](col);
  }

  def row(num: Int) = q(num);
}