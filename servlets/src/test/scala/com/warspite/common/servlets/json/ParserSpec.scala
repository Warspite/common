package com.warspite.common.servlets.json;

import org.scalatest.junit.JUnitRunner
import org.junit.runner.RunWith
import org.scalatest.FlatSpec
import org.scalatest.junit.ShouldMatchersForJUnit
import java.util.HashMap
import org.scalatest.BeforeAndAfterEach
import com.warspite.common.servlets.json.Parser.ParseException

@RunWith(classOf[JUnitRunner])
class ParserSpec extends FlatSpec with ShouldMatchersForJUnit with BeforeAndAfterEach {
  "Parser" should "parse simple JSON string" in {
    val o = Parser.parse("{\"hej\": \"hopp\"}");
    o.asInstanceOf[Map[String,Any]].get("hej").get should equal("hopp")
  }

  it should "throw appropriate exception for invalid string" in {
    intercept[ParseException] {
      Parser.parse("broken");
    }
  }
}