package com.warspite.common.servlets

object InputChecker {
  def checkLength(s: String, name: String, min: Int, max: Int) {
    if (s.length < min)
      throw new InvalidServletInputException("The " + name + " parameter is too short! At least " + min + " characters are needed.");

    if (s.length > max)
      throw new InvalidServletInputException("The " + name + " parameter is too long! No more than " + max + " characters are allowed.");
  }

  def checkEmail(email: String) {
    if (!email.contains("@"))
      throw new InvalidServletInputException("The entered email address appear invalid.");

    if (email.lastIndexOf(".") <= (email.lastIndexOf("@") + 1))
      throw new InvalidServletInputException("The entered email address appear invalid.");

    if (email.lastIndexOf(".") > (email.length - 2))
      throw new InvalidServletInputException("The entered email address appear invalid.");

  }
}