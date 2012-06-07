package com.warspite.common.cli;

import java.lang.reflect.Method;

public class MethodObjectPair {
	private final Object o;
	private final Method m;

	public MethodObjectPair(Object o, Method m) {
		this.o = o;
		this.m = m;
	}

	public Object getObject() {
		return o;
	}

	public Method getMethod() {
		return m;
	}
}
