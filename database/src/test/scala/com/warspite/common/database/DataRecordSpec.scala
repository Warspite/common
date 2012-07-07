package com.warspite.common.database

import org.scalatest.junit.JUnitRunner
import org.junit.runner.RunWith
import org.scalatest.FlatSpec
import org.scalatest.junit.ShouldMatchersForJUnit
import org.scalatest.mock.MockitoSugar
import org.scalatest.BeforeAndAfterEach
import org.mockito.Mockito._
import org.mockito.Matchers.{ eq => the, any }
import java.util.Date

@RunWith(classOf[JUnitRunner])
class DataRecordSpec extends FlatSpec with ShouldMatchersForJUnit with BeforeAndAfterEach with MockitoSugar {
  var dr: DataRecord = null;
  val intObj = 3;
  val strObj = "dummy";
  val dateObj = new Date;

  override def beforeEach() {
    dr = new DataRecord();
    dr.put("int", intObj);
    dr.put("string", strObj);
    dr.put("date", dateObj);
  }

  "DataRecord" should "return contained object" in {
    dr.get[Int]("int") should equal(intObj);
    dr.get[String]("string") should equal(strObj);
    dr.get[Date]("date") should equal(dateObj);
  }

  "DataRecord" should "throw appropriate exception if wrong type is retrieved" in {
    intercept[IncompatibleTypeInDataRecordException] {
      dr.get[String]("date");
    }
  }

  "DataRecord" should "throw appropriate exception if object is missing" in {
    intercept[IncompleteDataRecordException] {
      dr.get[String]("plupp");
    }
  }
  
  //  it should "throw exception when attempting to create with incomplete data record" in {
  //    dr -= "callSign";
  //    intercept[NotJsonifiableTypeException] {
  //      Account(dr);
  //    }
  //  }
}