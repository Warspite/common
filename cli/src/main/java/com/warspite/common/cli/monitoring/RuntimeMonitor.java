package com.warspite.common.cli.monitoring;

import java.io.File;
import java.io.IOException;

import com.warspite.common.cli.ScriptExecutor;
import com.warspite.common.cli.WarspitePoller;
import com.warspite.common.cli.exceptions.CliSetupException;
import com.warspite.common.cli.exceptions.CliTeardownException;

public class RuntimeMonitor extends WarspitePoller {
	private final File runtimeDirectory;
	private final File cmdDirectory;
	private final ScriptExecutor executor;

	public RuntimeMonitor(final File runtimeDirectory, final ScriptExecutor executor) {
		super(50);
		
		this.runtimeDirectory = runtimeDirectory;
		this.executor = executor;
		this.cmdDirectory = new File(runtimeDirectory, "cmd");
	}

	@Override
	protected void teardown() throws Exception {
		logger.info("Tearing down.");
		
		if (!deleteDirectory(runtimeDirectory))
			throw new CliTeardownException("Failed to clean up runtime directory " + runtimeDirectory + ". If this is left it may cause problems for future instances of the application.");
	}

	private boolean deleteDirectory(File dir) {
		logger.debug("Deleting directory " + dir);
		
		if(!dir.exists())
			return false;
		
		for(File f : dir.listFiles()) {
			boolean success = false;
			if(f.isDirectory())
				success = deleteDirectory(f);
			else
				success = f.delete();
			
			if(!success)
				return false;
		}
		
		return dir.delete();
	}

	@Override
	public void setup() throws Exception {
		logger.info("Setting up.");
		
		if( runtimeDirectory.exists() )
			throw new CliSetupException("This instance needs to use the runtime directory " + runtimeDirectory + ", but it already exists. Maybe there's already another instance with the same name running, or a previous instance did not shut down cleanly?");
		
		cmdDirectory.mkdirs();
	}

	@Override
	protected void act() throws Exception {
		for(File f : cmdDirectory.listFiles()) {
			if(f.getName().endsWith(".in")) {
				try {
					handleInput(f);
				}
				catch(IOException e) {
					logger.error("Error occured while handling input file " + f + ".", e);
				}
			}
		}
	}

	private void handleInput(File f) throws IOException {
		String lockFilePath = f.getPath().substring(0, f.getPath().length() - ".in".length()) + ".lck";
		File lockFile = new File(lockFilePath);
		logger.debug("Handling input file " + f + ", will look for lockfile " + lockFile + ".");
		
		if(lockFile.exists()) {
			logger.debug("Input file " + f + " is locked. Skipping for now.");
			return;
		}

		lockFile.createNewFile();
		
		executor.executeScript(f);
		
		if(!f.delete())
			throw new IOException("Failed to delete input file " + f + ". If it remains it will clutter the input.");
		
		if(!lockFile.delete())
			throw new IOException("Failed to delete lockfile " + lockFile + ". If it remains it will clutter the input.");
	}
}
