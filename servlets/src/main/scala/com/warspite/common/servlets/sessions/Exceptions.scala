package com.warspite.common.servlets.sessions;
import com.warspite.common.servlets.ClientReadableException

class BadSessionKeyException(s: Session, key: Int) extends ClientReadableException("Request attempted to use session " + s.id + " with an incorrect session key. Used key: " + key + ". Valid key: " + s.key, "Uh oh! The session key you're using is invalid. Try logging in again?") {}
class SessionDoesNotExistException(id: Int, longevityInMinutes: Int) extends ClientReadableException("Request attempted to use non-existent session " + id + ".", "There's no active session! Maybe it timed out - if there is no client activity for " +  longevityInMinutes + " minutes the session will be dropped.") {}