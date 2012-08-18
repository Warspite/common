package com.warspite.common.cli;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintStream;

import com.warspite.common.cli.exceptions.CliException;

public class CliReader extends WarspitePoller {
	private final Cli cli;
	private final PrintStream out;
	private final BufferedReader in;

	public CliReader(final Cli cli, final InputStream inputStream, final PrintStream out) {
		super(10);
		this.cli = cli;
		this.out = out;
		this.in = new BufferedReader(new InputStreamReader(inputStream));
		this.setDaemon(true);
	}

	@Override
	protected void act() throws Exception {
		String cmd = null;
		
		try {
			out.print("> ");
			cmd = in.readLine();
			cli.parseCommand(cmd);
		}
		catch (CliException e) {
			out.println("Command failed: " + e.getMessage());
		}
		catch (IOException e) {
			logger.error("Failed to read CLI input.", e);
		}
		catch (Exception e) {
			logger.error("Failed to execute command \"" + cmd + "\".", e);
		} 

	}

	@Override
	public void setup() throws Exception {
	}

	@Override
	protected void teardown() throws Exception {
	}
}
