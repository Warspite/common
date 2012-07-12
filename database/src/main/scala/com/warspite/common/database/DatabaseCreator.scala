package com.warspite.common.database

import java.util.Properties
import java.io.FileInputStream
import com.warspite.common.cli.CliListener
import com.warspite.common.cli.annotations.Cmd
import java.io.FileNotFoundException

class DatabaseCreator[T <: Database] extends CliListener {
  var db: Any = null;
  val DATABASE_PROPERTIES_FILE = "configuration/database.properties";
  val DATABASE_IMPLEMENTATION_PROPERTY_NAME = "db_implementation";

  @Cmd(name = "create", description = "Create a database instance, using configuration/<propFilename> for properties.", printReturnValue = true)
  def create(propFilename: String): String = {
    try {
      val dbProps = loadProps(propFilename);
      val dbImplName = dbProps.getProperty(DATABASE_IMPLEMENTATION_PROPERTY_NAME);

      if (dbImplName == null)
        throw new DatabaseCreationException("Property " + DATABASE_IMPLEMENTATION_PROPERTY_NAME + " undefined in " + DATABASE_PROPERTIES_FILE);

      val clazz = Class.forName(dbImplName);
      val constructor = clazz.getConstructor(classOf[Properties]);
      db = constructor.newInstance(dbProps);
      db.asInstanceOf[T].connect();
      return "Database (" + dbImplName + ") created.";
    } catch {
      case e: FileNotFoundException => throw new DatabaseCreationException("Couldn't file propfile " + propFilename + ".", e);
      case e => throw new DatabaseCreationException("Failed to instantiate database using propfile " + propFilename + ".", e);
    }
  }

  def getDatabase(): T = {
    if (db == null)
      throw new DatabaseCreationException("Cannot get the database, it has not been instantiated.");

    return db.asInstanceOf[T];
  }

  def loadProps(filename: String): Properties = {
    val dbProps = new Properties;
    dbProps.load(new FileInputStream("configuration/" + filename));
    return dbProps;
  }
}
