package com.warspite.common.cli.exceptions;

public class CliTeardownException extends CliException {
	private static final long serialVersionUID = -7433521260017201733L;

	public CliTeardownException(final String msg) {
		super(msg);
	}

	public CliTeardownException(final String msg, final Throwable e) {
		super(msg, e);
	}
}
