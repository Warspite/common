package com.warspite.common.servlets.sessions;
import com.warspite.common.servlets.ClientReadableException

class SessionDoesNotExistException(id: Int, longevityInMinutes: Int) extends ClientReadableException("Request attempted to use non-existent session " + id + ".", "There's no active session! Maybe it timed out - if there is no client activity for " +  longevityInMinutes + " minutes the session will be dropped.") {
}