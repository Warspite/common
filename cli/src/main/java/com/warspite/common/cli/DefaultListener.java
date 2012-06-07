package com.warspite.common.cli;

import java.lang.reflect.Method;
import java.util.Map.Entry;

import com.warspite.common.cli.annotations.Cmd;

public class DefaultListener implements CliListener {
	private final Cli cli;
	private final ScriptExecutor scriptExecutor;

	public DefaultListener(Cli cli, ScriptExecutor scriptExecutor) {
		this.cli = cli;
		this.scriptExecutor = scriptExecutor;
	}

	@Cmd(name = "help", description = "Display this help.")
	public void help() {
		cli.println("Command syntax is: <listener> <cmd> [args]");
		cli.println("Example: cli help");
		cli.println("Registered listeners:");
		for(Entry<String, CliListener> entry : cli.getListeners().entrySet())
			printListenerInfo(entry.getKey(), entry.getValue());
	}

	private void printListenerInfo(final String name, final CliListener listener) {
		cli.println("------------------------------");
		cli.println("Listener: " + name);
		cli.println("------------------------------");
		for(Method m : listener.getClass().getMethods()) {
			Cmd c = m.getAnnotation(Cmd.class);
			if(c != null) {
				cli.println(getCommandSignature(m, c));
				cli.println(c.description());
				cli.println("");
			}
		}
		cli.println("");
	}

	private String getCommandSignature(Method m, Cmd c) {
		String out = c.name();

		boolean firstParameter = true;
		for(Class<?> p : m.getParameterTypes()) {
			if(firstParameter) {
				out += ":";
				firstParameter = false;
			}
			out += " [" + p.getSimpleName() + "]";
		}

		return out;
	}

	@Cmd(name = "exit", description = "Exit the application.")
	public void exit() {
		cli.setExit(true);
	}

	@Cmd(name = "list", description = "List available scripts.")
	public void list() {
		scriptExecutor.listScripts();
	}

	@Cmd(name = "exec", description = "Execute <script>.")
	public void exec(String script) {
		scriptExecutor.executeScript(script);
	}

	@Cmd(name = "print", description = "Print <str>.")
	public void print(String str) {
		cli.println(str);
	}
}
