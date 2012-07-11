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
	private final static String newLine = System.getProperty("line.separator");

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

	public String executeScript(final String name) {
		final String path = CLI_DIRECTORY + "/" + name;
		return executeScript(new File(path));
	}
	
	public String executeScript(final File f) {
		if (!f.exists())
			return "Could not find script '" + f + "'.";

		StringBuffer out = new StringBuffer();
		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new FileReader(f));
			String cmd = null;

			while ((cmd = reader.readLine()) != null) {
				if (!cmd.isEmpty()) {
					try {
						String ret = cli.parseCommand(cmd);
						if(ret != null)
							out.append(ret).append(newLine);
					} 
					catch (Exception e) {
						logger.error("Failed to execute command \"" + cmd + "\" from script '" + f + "'.", e);
						return "Failed to execute command \"" + cmd + "\" from script '" + f + "'.";
					}
				}
			}
		} catch (IOException e) {
			logger.error("Failed to read script file " + f + ".", e);
			return "Failed to read script file " + f + ".";
		}

		try {
			if (reader != null) {
				reader.close();
			}
		} catch (IOException e) {
			logger.error("Failed to close script file " + f + ".", e);
			return "Failed to close script file " + f + ". Error has been logged.";
		}
		
		return out.toString();
	}
}
