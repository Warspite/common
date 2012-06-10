package com.warspite.common.servlets.sessions;
import com.warspite.common.servlets.ClientReadableException

class BadSessionKeyException(s: Session, key: Int) extends ClientReadableException("Request attempted to use session " + s.id + " with an incorrect session key. Used key: " + key + ". Valid key: " + s.key, "Uh oh! The session key you're using is invalid. Try logging in again?") {
}