package com.warspite.common.cli;

import static org.mockito.Mockito.*;

import java.io.InputStream;
import java.io.PrintStream;

import org.junit.Before;
import org.junit.Test;

import com.warspite.common.cli.Cli;
import com.warspite.common.cli.exceptions.CliException;

public class CliTest {
	
	InputStream in;
	PrintStream out;
	ListenerStub listener; //Can't mock this, because annotations disappear
	ListenerStub secondaryListener; //We'll mock this instead and do verifications
	Cli cli;
	
	@Before
	public void setup() {
		in = mock(InputStream.class);
		out = mock(PrintStream.class);
		secondaryListener = mock(ListenerStub.class);
		listener = new ListenerStub(secondaryListener);
		cli = new Cli("TestApp", "TestInstance", in, out);
		cli.getListeners().clear();
		cli.getListeners().put("test", listener);
	}
	
	@Test (expected=CliException.class)
	public void unknownCommandTest() throws Exception {
		cli.parseCommand("test unknown");
	}

	@Test (expected=CliException.class)
	public void unregisteredListenerTest() throws Exception {
		cli.parseCommand("unregistered hello");
	}

	@Test
	public void commandWithNoArgumentsTest() throws Exception  {
		cli.parseCommand("test test");
		verify(secondaryListener).testMethod();
	}

	@Test
	public void commandWithArgumentsTest() throws Exception  {
		cli.parseCommand("test testWithArguments str 5");
		verify(secondaryListener).testMethodWithArguments("str", 5);

		cli.parseCommand("test testWithArguments otherStr -3");
		verify(secondaryListener).testMethodWithArguments("otherStr", -3);
	}

	@Test(expected=CliException.class)
	public void incorrectNumberOfArgumentsTest() throws Exception  {
		cli.parseCommand("test testWithArguments str");
	}

	@Test(expected=CliException.class)
	public void incorrectArgumentTypeTest() throws Exception  {
		cli.parseCommand("test testWithArguments str hej");
	}

	@Test
	public void commandWithOtherArgumentsTest() throws Exception  {
		cli.parseCommand("test testWithOtherArguments str str2 0.5");
		verify(secondaryListener).testMethodWithOtherArguments("str", "str2", 0.5);
	}
}
