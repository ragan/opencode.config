.PHONY: help install uninstall

help:
	@echo "Available targets:"
	@echo "  make install   - Install config using stow"
	@echo "  make uninstall - Uninstall config using stow"
	@echo "  make help      - Show this help message"

install:
	stow config

uninstall:
	stow -D config
