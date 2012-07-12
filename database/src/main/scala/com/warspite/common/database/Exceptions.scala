package com.warspite.common.database

class DatabaseException(msg: String, inner: Throwable) extends RuntimeException(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class DatabaseCreationException(msg: String, inner: Throwable) extends DatabaseException(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class TableDataRetrievalException(inner: Throwable) extends DatabaseException("Failed to retrieve data from table.", inner) {}

class ExpectedRecordNotFoundException(msg: String, inner: Throwable) extends DatabaseException(msg, inner) {
  def this(msg: String) = this(msg, null);
}

class IncompleteDataRecordException(missingKey: String, val record: DataRecord) extends DatabaseException("The data record does not contain expected key '" + missingKey + "'.") {}
class IncompatibleTypeInDataRecordException(key: String, val record: DataRecord, objManifest: String, expectedManifest: String) extends DatabaseException("The data record object '" + key + "' is of type " + objManifest + ", but " + expectedManifest + " was expected.") {}
