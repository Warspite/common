package com.warspite.common.cli;

import com.warspite.common.cli.CliListener;
import com.warspite.common.cli.annotations.Cmd;

public class ListenerStub implements CliListener {
	private final ListenerStub secondaryListener;

	public ListenerStub(ListenerStub secondaryListener) {
		this.secondaryListener = secondaryListener;
	}

	@Cmd(name = "test", description = "", printReturnValue = false)
	public void testMethod() {
		secondaryListener.testMethod();
	}

	@Cmd(name = "testWithArguments", description = "", printReturnValue = false)
	public void testMethodWithArguments(final String strArg, final Integer intArg) {
		secondaryListener.testMethodWithArguments(strArg, intArg);
	}

	@Cmd(name = "testWithOtherArguments", description = "", printReturnValue = false)
	public void testMethodWithOtherArguments(final String strArg, final String strArg2, final Double doubleArg) {
		secondaryListener.testMethodWithOtherArguments(strArg, strArg2, doubleArg);
	}
}
