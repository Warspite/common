package com.warspite.common.cli;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ScriptExecutor {
	private final Logger logger = LoggerFactory.getLogger(getClass());
	private final Cli cli;
	private final static String CLI_DIRECTORY = "cli";

	public ScriptExecutor(final Cli cli) {
		this.cli = cli;
	}

	public void listScripts() {
		final File f = new File(CLI_DIRECTORY);

		if (!f.exists()) {
			cli.println("Directory \"" + CLI_DIRECTORY + "\" does not exist.");
			return;
		}

		if (!f.isDirectory()) {
			cli.println("\"" + CLI_DIRECTORY + "\" is not a directory.");
			return;
		}

		cli.println("Files found in \"" + CLI_DIRECTORY + "\":");
		for (String s : f.list())
			cli.println("    " + s);
	}

	public void executeScript(final String name) {
		final String path = CLI_DIRECTORY + "/" + name;
		final File f = new File(path);

		if (!f.exists()) {
			cli.println("Could not find script \"" + path + "\".");
			return;
		}

		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new FileReader(f));
			String cmd = null;

			while ((cmd = reader.readLine()) != null) {
				if (!cmd.isEmpty()) {
					try {
						cli.parseCommand(cmd);
					} 
					catch (Exception e) {
						cli.println("Failed to execute command \"" + cmd + "\".");
						logger.error("Failed to execute command \"" + cmd + "\" from script \"" + path + "\".", e);
					}
				}
			}
		} catch (IOException e) {
			cli.println("Failed to read script file " + path
					+ ". Error has been logged.");
			logger.error("Failed to read script file " + path + ".", e);
		}

		try {
			if (reader != null) {
				reader.close();
			}
		} catch (IOException e) {
			cli.println("Failed to close script file " + path
					+ ". Error has been logged.");
			logger.error("Failed to close script file " + path + ".", e);
		}
	}
}
