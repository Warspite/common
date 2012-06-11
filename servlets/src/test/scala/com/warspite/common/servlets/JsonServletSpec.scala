import org.scalatest.junit.JUnitRunner
import org.junit.runner.RunWith
import org.scalatest.FlatSpec
import org.scalatest.junit.ShouldMatchersForJUnit
import com.warspite.common.servlets.{JsonServlet, NotJsonifiableTypeException}
import java.util.HashMap
import org.scalatest.BeforeAndAfterEach

@RunWith(classOf[JUnitRunner])
class JsonServletSpec extends FlatSpec with ShouldMatchersForJUnit with BeforeAndAfterEach {
  var js: JsonServlet = null;

  override def beforeEach() {
    js = new JsonServlet(null);
  }

  "JsonServlet" should "jsonify an empty map to an empty JSON object" in {
    js.jsonify(Map[String, Any]()) should equal("{}");
  }

  it should "jsonify a string value to a well formed JSON object" in {
    js.jsonify(Map[String, Any]("dobedo" -> "dobi")) should equal("{\"dobedo\":\"dobi\"}");
  }

  it should "jsonify an integer value to a well formed JSON object" in {
    js.jsonify(Map[String, Any]("dobedo" -> 5)) should equal("{\"dobedo\":5}");
  }

  it should "jsonify a float value to a well formed JSON object" in {
    js.jsonify(Map[String, Any]("dobedo" -> 0.35)) should equal("{\"dobedo\":0.35}");
  }

  it should "jsonify a boolean value to a well formed JSON object" in {
    js.jsonify(Map[String, Any]("a" -> false, "b" -> true)) should equal("{\"a\":false,\"b\":true}");
  }
  
  it should "jsonify multiple values into a comma separated sequence" in {
    js.jsonify(Map[String, Any]("dobedo" -> 2, "dudelu" -> "plupp")) should equal("{\"dobedo\":2,\"dudelu\":\"plupp\"}");
  }

  it should "jsonify map values into nested JSON objects" in {
    js.jsonify(Map("dobedo" -> 2, "child" -> Map("dudelu" -> "plupp"))) should equal("{\"dobedo\":2,\"child\":{\"dudelu\":\"plupp\"}}");
  }

  it should "jsonify arrays into JSON arrays" in {
    js.jsonify(Map("dobedo" -> Array(1, 2), "z" -> Array("hej", "hopp"), "x" -> Array(Array(2, 3), Array[Int]()))) should equal("{\"dobedo\":[1,2],\"z\":[\"hej\",\"hopp\"],\"x\":[[2,3],[]]}");
  }

  it should "throw exception when attempting to jsonify unknown types" in {
    intercept[NotJsonifiableTypeException] {
      js.jsonify(Map("dobedo" -> js));
    }
  }
}