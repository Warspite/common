package com.warspite.common.database

import java.util.Properties;
import org.slf4j.LoggerFactory

abstract class Database(val props: Properties) {
  protected val log = LoggerFactory.getLogger(getClass());
  def connect();
}