package com.warspite.common.cli;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.warspite.common.cli.annotations.Cmd;
import com.warspite.common.cli.exceptions.CliException;

public class Cli {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private final String appName;
	private final BufferedReader in;
	private final PrintStream out;
	private final Map<String, CliListener> listeners = new HashMap<String, CliListener>();
	private boolean exit;

	public Cli(final String appName) {
		this(appName, System.in, System.out);
	}

	public Cli(final String appName, final InputStream inputStream, final PrintStream out) {
		this.appName = appName;
		this.in = new BufferedReader(new InputStreamReader(inputStream));
		this.out = out;

		this.listeners.put("cli", new DefaultListener(this));

		loadAnnotations();
	}

	private void loadAnnotations() {
		try {
			getClass().getClassLoader().loadClass(Cmd.class.getName());
		} 
		catch (ClassNotFoundException e) {
			logger.error("Failed to load annotations.", e);
		}
	}

	public void start() {
		out.println("Welcome!");
		out.println("Application: " + appName);
		out.println("Type 'cli help' for help.");

		while( !isExit() )
			read();
	}

	private void read() {
		out.print("> ");

		try {
			parseCommand(in.readLine());
		}
		catch (CliException e) {
			out.println("Command failed: " + e.getMessage());
		}
		catch (IOException e) {
			logger.error("Failed to read CLI input.", e);
		}
		catch (Exception e) {
			logger.error("Failed to execute command.", e);
		} 
	}

	protected void parseCommand(String cmdString) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException, CliException {
		logger.debug("Received command '" + cmdString + "'.");

		if( cmdString.isEmpty() )
			return;

		final String[] cmdArray = cmdString.split(" ");

		if(cmdArray.length < 2)
			throw new CliException("Command line too short. Correct syntax is <listener> <cmd> [args]. Type 'cli help' for help.");

		final String listenerName = cmdArray[0];
		final String cmd = cmdArray[1];
		final String[] args = new String[cmdArray.length - 2];
		System.arraycopy(cmdArray, 2, args, 0, args.length);

		final CliListener listener = listeners.get(listenerName);
		if(listener == null)
			throw new CliException("Unrecognized listener '" + listenerName + "'. Type 'cli help' for help.");

		MethodObjectPair m = findMethod(cmd, listener);
		if( m == null )
			throw new CliException("Unrecognized command '" + cmdString + "'. Type 'cli help' for help.");

		invokeMethod(m, args);
	} 

	private void invokeMethod(MethodObjectPair m, String[] args) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException, CliException {
		m.getMethod().invoke(m.getObject(), parseArguments(m.getMethod(), args));
	}

	private Object[] parseArguments(Method m, String[] argStrings) throws CliException {
		final Object[] args = new Object[argStrings.length];
		Class<?>[] parameterTypes = m.getParameterTypes();

		if(args.length != parameterTypes.length)
			throw new CliException("Incorrect number of parameters. Expected " + parameterTypes.length + ", but received " + args.length + ".");

		for(int i = 0; i < args.length; i++)
			args[i] = parseParameter(parameterTypes[i], argStrings[i]);

		return args;
	}

	private Object parseParameter(Class<?> argClass, String argString) throws CliException {
		try {
			if(argClass == String.class)
				return argString;

			if(argClass == Integer.class) {
				return Integer.parseInt(argString);
			}

			if(argClass == Double.class) {
				return Double.parseDouble(argString);
			}
		}
		catch(NumberFormatException e) {
			throw new CliException("Failed to parse parameter '" + argString + "' into " + argClass.getSimpleName() + ".", e);
		}

		throw new CliException("Can't handle parameter type " + argClass.getSimpleName() + ".");
	}

	private MethodObjectPair findMethod(String cmd, final CliListener listener) {
		for(Method m : listener.getClass().getMethods()) {
			Cmd c = m.getAnnotation(Cmd.class);
			if( c != null && c.name().equals(cmd) )
				return new MethodObjectPair(listener, m);
		}

		return null;
	}

	public void println(final String msg) {
		out.println(msg);
	}

	synchronized public void registerListeners(final String name, final CliListener listener) throws CliException {
		if(listeners.containsKey(name))
			throw new CliException("Attempted to register listener named '" + name + "', but a listener with that name already exists.");

		listeners.put(name, listener);
	}

	public void setExit(boolean exit) {
		this.exit = exit;
	}

	public boolean isExit() {
		return exit;
	}

	public Map<String, CliListener> getListeners() {
		return listeners;
	}
}
