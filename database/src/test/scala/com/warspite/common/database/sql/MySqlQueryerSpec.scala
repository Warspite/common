package com.warspite.common.database.sql

import org.scalatest.junit.JUnitRunner
import org.junit.runner.RunWith
import org.scalatest.FlatSpec
import org.scalatest.junit.ShouldMatchersForJUnit
import org.scalatest.mock.MockitoSugar
import org.scalatest.BeforeAndAfterEach
import org.mockito.Mockito._
import org.mockito.Matchers.{ eq => the, any }
import java.util.Date
import java.sql.Connection

@RunWith(classOf[JUnitRunner])
class MySqlQueryerSpec extends FlatSpec with ShouldMatchersForJUnit with BeforeAndAfterEach with MockitoSugar {
  var c: Connection = null
  var q: MySqlQueryer = null;

  override def beforeEach() {
    c = mock[Connection];
    q = new MySqlQueryer(c);
  }

  "MySqlQueryer" should "format a map into a proper insert statement" in {
    q.composeInsertString("MyTable", Map[String, Any]("strCol" -> "strVal", "intCol" -> 1)) should equal("INSERT INTO MyTable (strCol,intCol) VALUES ('strVal',1);");
  }
  
  it should "escape ' in insert statements" in {
    val exp = "INSERT INTO MyTable (secretSauce) VALUES ('hey\\'hey\\'dobedo\\'\\'');";
    val act = q.composeInsertString("MyTable", Map[String, Any]("secretSauce" -> "hey'hey'dobedo''")); 
    act should equal(exp);
  }
  
  it should "build valid querystrings" in {
    q.buildQueryString(List("hej", "hopp"), "FROM stuff") should equal("SELECT hej, hopp FROM stuff");
    q.buildQueryString(List("hej", "hopp"), "FROM stuff", "MyTable") should equal("SELECT MyTable.hej, MyTable.hopp FROM stuff");
  }
}