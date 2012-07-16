package com.warspite.common.servlets;

import org.scalatest.junit.JUnitRunner
import org.junit.runner.RunWith
import org.scalatest.FlatSpec
import org.scalatest.junit.ShouldMatchersForJUnit
import java.util.HashMap
import org.scalatest.BeforeAndAfterEach
import com.warspite.common.database.DataRecord
import com.warspite.common.database.IncompatibleTypeInDataRecordException

@RunWith(classOf[JUnitRunner])
class InputCheckerSpec extends FlatSpec with ShouldMatchersForJUnit with BeforeAndAfterEach {
  "InputChecker" should "throw appropriate exception if @ is missing in email address" in {
    intercept[InvalidServletInputException] {
      InputChecker.checkEmail("sfkl.com");
    }
  }

  it should "throw appropriate exception if . is missing in email address" in {
    intercept[InvalidServletInputException] {
      InputChecker.checkEmail("sfkl@com");
    }
  }

  it should "throw appropriate exception if there is no . after the @ in the email address" in {
    intercept[InvalidServletInputException] {
      InputChecker.checkEmail("sfkl.com@");
    }
  }

  it should "throw appropriate exception if there are no characters after the last . in the email address" in {
    intercept[InvalidServletInputException] {
      InputChecker.checkEmail("sfkl@hej.");
    }
  }

  it should "throw appropriate exception if there isn't at least one character in between @ and . in email address" in {
    intercept[InvalidServletInputException] {
      InputChecker.checkEmail("sfkl@.com");
    }
  }
}