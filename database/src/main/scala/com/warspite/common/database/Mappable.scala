package com.warspite.common.database

trait Mappable {
  var sensitiveFieldsToBeMapped = false;
  var transientFieldsToBeMapped = true;
  
  def asMap(): Map[String, Any];

  def sensitive(b: Boolean): Mappable = {
    sensitiveFieldsToBeMapped = b;
    return this;
  }
  
  def transient(b: Boolean): Mappable = {
    transientFieldsToBeMapped = b;
    return this;
  }
  
}