package com.warspite.common.cli.exceptions;

public class CliSetupException extends CliException {
	private static final long serialVersionUID = -7433521260017201733L;

	public CliSetupException(final String msg) {
		super(msg);
	}

	public CliSetupException(final String msg, final Throwable e) {
		super(msg, e);
	}
}
