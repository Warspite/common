package com.warspite.common.cli;

import java.io.File;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.warspite.common.cli.annotations.Cmd;
import com.warspite.common.cli.exceptions.CliException;
import com.warspite.common.cli.monitoring.RuntimeMonitor;

public class Cli {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private final ScriptExecutor scriptExecutor;
	private final String appName;
	private final PrintStream out;
	private final Map<String, CliListener> listeners = new HashMap<String, CliListener>();
	private boolean exit;
	private final String instanceName;
	private final CliReader cliReader; 

	public Cli(final String appName, final String instanceName) {
		this(appName, instanceName, System.in, System.out);
	}

	public Cli(final String appName, final String instanceName, final InputStream inputStream, final PrintStream out) {
		this.appName = appName;
		this.instanceName = instanceName;
		this.out = out;
		this.scriptExecutor = new ScriptExecutor(this);
		this.cliReader = new CliReader(this, inputStream, out);

		this.listeners.put("cli", new DefaultListener(this, scriptExecutor));
		
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
		out.println("Instance: " + instanceName);
		
		final RuntimeMonitor runtimeMonitor = new RuntimeMonitor(new File("runtime/" + instanceName), scriptExecutor); 
		
		out.println("Type 'cli help' for help.");

		try {
			runtimeMonitor.setup();
			runtimeMonitor.start();
		} 
		catch (Exception e) {
			logger.error("Failed to set up cli runtime monitor. Aborting.", e);
			this.exit = true;
		}
		
		try {
			cliReader.setup();
			cliReader.start();
		} 
		catch (Exception e) {
			logger.error("Failed to set up cli reader. Aborting.", e);
			this.exit = true;
		}
		
		while( !isExit() ) {
			try {
				Thread.sleep(100);
			}
			catch (InterruptedException e) {
				logger.error("InterruptedException while polling isExit().", e);
			}
		}

		cliReader.halt();
		runtimeMonitor.halt();
	}

	protected String parseCommand(String cmdString) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException, CliException {
		logger.debug("Received command '" + cmdString + "'.");

		if( cmdString.isEmpty() )
			return null;

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

		logger.debug("Invoking " + m.getMethod() + " with " + args.length + " arguments.");
		return invokeMethod(m, args);
	} 

	private String invokeMethod(MethodObjectPair m, String[] args) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException, CliException {
		try {
			Object ret = m.getMethod().invoke(m.getObject(), parseArguments(m.getMethod(), args));

			if(ret != null && m.getMethod().getAnnotation(Cmd.class).printReturnValue()) {
				return printAndReturn(ret.toString());
			}
			else {
				return null;
			}
		}
		catch(InvocationTargetException e) {
			if(e.getCause() != null) {
				logger.error("Cli executed method " + m.getMethod() + " threw an exception.", e);
				return printAndReturn("Command failed: " + e.getCause());
			}
			else {
				logger.error("Cli invocation failed.", e);
				return printAndReturn("Command invocation failed: " + e);
			}
		}
	}
	
	private String printAndReturn(String s) {
		out.println(s);
		return s;
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

			if(argClass == Integer.class || argClass == int.class)
				return Integer.parseInt(argString);

			if(argClass == Double.class)
				return Double.parseDouble(argString);
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
		logger.debug("Setting exit flag to " + exit);
		this.exit = exit;
	}

	public boolean isExit() {
		return exit;
	}

	public Map<String, CliListener> getListeners() {
		return listeners;
	}
}
