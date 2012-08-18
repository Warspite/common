package com.warspite.common.cli;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

abstract public class WarspitePoller extends Thread {
	protected final Logger logger = LoggerFactory.getLogger(getClass());
	private boolean halt = false;
	private boolean running = false;
	private final int interval;

	public WarspitePoller(int interval) {
		this.interval = interval;
	}

	public boolean isRunning() {
		return running;
	}

	@Override
	public void run() {
		running = true;
		try {
			synchronized (this) {
				while (!halt) {
					act();
					Thread.sleep(interval);
				}
			}
		} 
		catch (Exception e) {
			logger.error("Caught exception while running " + this.getClass() + ".", e);
		} 
		finally {
			try {
				teardown();
				running = false;
			} 
			catch (Exception e) {
				logger.error("Failed to stop " + this.getClass() + ".", e);
			}
		}
	}

	public void halt() {
		try {
			halt = true;
			while (isRunning() && !this.isDaemon()) {
				logger.debug("Waiting for poller shutdown...");
				Thread.sleep(50);
			}

			logger.debug("Poller has stopped, exiting.");
		} 
		catch (InterruptedException e) {
			logger.error("Caught exception while waiting for poller to halt.", e);
		}
	}

	abstract public void setup() throws Exception;
	abstract protected void teardown() throws Exception;
	abstract protected void act() throws Exception;
}
