package com.warspite.common.servlets;

import com.warspite.common.servlets.RestVerb._

class UnsupportedRestVerbException(verb: RestVerb, servletName: String) extends ClientReadableException("Servlet " + servletName + " received a " + verb + " request, which it does not support.", "Sorry! This servlet does not support " + verb + " requests.", null) {
}