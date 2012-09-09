package com.warspite.common.database.sql

object StringEscaper {
	def escape(s: String) = s.replace("\\", "\\\\").replace("'", "\\'");
}