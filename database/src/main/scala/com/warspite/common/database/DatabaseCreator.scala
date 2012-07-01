package com.warspite.common.database

import java.util.Properties;
import java.io.FileInputStream

class DatabaseCreator[T <: Database]() {
	val DATABASE_PROPERTIES_FILE = "configuration/database.properties";
	val DATABASE_IMPLEMENTATION_PROPERTY_NAME = "db_implementation";
	
	def create(): T = {
	  val dbProps = loadProps;
	  val dbImplName = dbProps.getProperty(DATABASE_IMPLEMENTATION_PROPERTY_NAME);
	  
	  if(dbImplName == null)
	    throw new DatabaseCreationException("Property " + DATABASE_IMPLEMENTATION_PROPERTY_NAME + " undefined in " + DATABASE_PROPERTIES_FILE);
	  
	  try {
		val clazz = Class.forName(dbImplName);
		val constructor = clazz.getConstructor(classOf[Properties]);
	    return constructor.newInstance(dbProps).asInstanceOf[T];
	  }
	  catch {
	    case e => throw new DatabaseCreationException("Failed to instantiate " + dbImplName + ".", e);
	  }
	  
	  
	  
	  
	  
	  //	  val db = new DummyDb();
//	  val dbT: T = db.asInstanceOf[T];
//	  return dbT;
	}
	
	def loadProps: Properties = {
	  val dbProps = new Properties;
	  dbProps.load(new FileInputStream(DATABASE_PROPERTIES_FILE));
	  return dbProps;
	}
}
