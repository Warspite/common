package com.warspite.common.cli.exceptions;

public class CliException extends Exception {
	private static final long serialVersionUID = -8532058780888625136L;

	public CliException(final String msg) {
		super(msg);
	}

	public CliException(final String msg, final Throwable e) {
		super(msg, e);
	}
}
