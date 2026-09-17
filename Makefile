# ============================================================
#  VARIABLES
# ============================================================

ENV		:= .env
NPM		:= npm
NPX		:= npx
EXPO		:= $(NPX) expo

# ------------------------------------------------------------
#  General Variables
# ------------------------------------------------------------

ECHO		:= echo -e
FIND		:= /bin/find
IGNORE		:= 2>/dev/null || true
MV		:= /bin/mv
MKDIR		:= mkdir -p
RM		:= rm -rf

# ------------------------------------------------------------
#  Ansi Colors
# ------------------------------------------------------------

RESET		:= \033[0m
BLACK		:= \033[1;90m
RED		:= \033[1;91m
GREEN		:= \033[1;92m
YELLOW		:= \033[1;93m
BLUE		:= \033[1;94m
MAGENTA		:= \033[1;95m
CYAN		:= \033[1;96m
WHITE		:= \033[1;97m

# ============================================================
#  RULES
# ============================================================

.PHONY: all install start run android web ios tunnel env clean fclean re help

# ------------------------------------------------------------
#  all — Default target: Setup environment and start dev server
# ------------------------------------------------------------

all: env install start

# ------------------------------------------------------------
#  env — Initialize .env from .env.example if missing
# ------------------------------------------------------------

env:
	@if [ ! -f $(ENV) ]; then \
		$(ECHO) ">>> $(YELLOW)Creating $(ENV) from .env.example...$(RESET)"; \
		cp .env.example $(ENV); \
		$(ECHO) ">>> $(GREEN)$(ENV) created. Remember to insert your 42 API credentials.$(RESET)"; \
	else \
		$(ECHO) ">>> $(CYAN)$(ENV) already exists.$(RESET)"; \
	fi

# ------------------------------------------------------------
#  install — Install dependencies
# ------------------------------------------------------------

install:
	@if [ ! -f package.json ]; then \
		$(ECHO) ">>> $(RED)Error: package.json not found.$(RESET)"; \
		$(ECHO) ">>> $(YELLOW)Scaffold the project first or check out repository files.$(RESET)"; \
		exit 1; \
	fi
	@$(ECHO) ">>> $(YELLOW)Installing dependencies...$(RESET)"
	@$(NPM) install
	@$(ECHO) ">>> $(GREEN)Dependencies installed.$(RESET)"

# ------------------------------------------------------------
#  start / run — Start Expo Metro bundler
# ------------------------------------------------------------

start:
	@$(ECHO) ">>> $(YELLOW)Launching Expo development server...$(RESET)"
	@$(EXPO) start

run: start

# ------------------------------------------------------------
#  android — Launch dev server and trigger Android emulator
# ------------------------------------------------------------

android:
	@$(ECHO) ">>> $(YELLOW)Opening on Android emulator/device...$(RESET)"
	@$(EXPO) start --android

# ------------------------------------------------------------
#  web — Launch dev server and open in browser
# ------------------------------------------------------------

web:
	@$(ECHO) ">>> $(YELLOW)Opening web preview...$(RESET)"
	@$(EXPO) start --web

# ------------------------------------------------------------
#  ios — Launch dev server targeting iOS simulator
# ------------------------------------------------------------

ios:
	@$(ECHO) ">>> $(YELLOW)Opening on iOS simulator...$(RESET)"
	@$(EXPO) start --ios

# ------------------------------------------------------------
#  tunnel — Start dev server with tunnel (for strict campus LANs)
# ------------------------------------------------------------

tunnel:
	@$(ECHO) ">>> $(YELLOW)Starting Expo with tunnel connection...$(RESET)"
	@$(EXPO) start --tunnel

# ------------------------------------------------------------
#  clean — Remove Metro caches and Expo temporary files
# ------------------------------------------------------------

clean:
	@$(ECHO) ">>> $(YELLOW)Cleaning Expo and Metro bundler cache...$(RESET)"
	@$(RM) .expo .expo-shared dist web-build metro-cache
	@$(EXPO) start --clear $(IGNORE)
	@$(ECHO) ">>> $(CYAN)Cache cleared.$(RESET)"

# ------------------------------------------------------------
#  fclean — Full purge (node_modules, caches, and local .env)
# ------------------------------------------------------------

fclean:
	@$(ECHO) ">>> $(RED)Performing full cleanup...$(RESET)"
	@$(RM) node_modules .expo .expo-shared dist web-build metro-cache
	@$(RM) package-lock.json
	@$(RM) $(ENV)
	@$(ECHO) ">>> $(GREEN)Full clean completed.$(RESET)"

# ------------------------------------------------------------
#  re — Clean everything, reinstall, and restart
# ------------------------------------------------------------

re: fclean all

# ------------------------------------------------------------
#  help — Show available rules
# ------------------------------------------------------------

help:
	@$(ECHO) ""
	@$(ECHO) " $(CYAN)AVAILABLE RULES$(RESET)"
	@$(ECHO) ""
	@$(ECHO) "     $(CYAN)all$(RESET)         Prepare $(ENV), install packages, and launch Expo"
	@$(ECHO) "     $(CYAN)env$(RESET)         Create $(ENV) from .env.example if missing"
	@$(ECHO) "     $(CYAN)install$(RESET)     Install dependencies via $(NPM)"
	@$(ECHO) "     $(CYAN)start$(RESET)       Start Metro bundler (alias: run)"
	@$(ECHO) "     $(CYAN)android$(RESET)     Start Metro bundler directly into Android"
	@$(ECHO) "     $(CYAN)web$(RESET)         Start Metro bundler directly in web browser"
	@$(ECHO) "     $(CYAN)ios$(RESET)         Start Metro bundler targeting iOS simulator"
	@$(ECHO) "     $(CYAN)tunnel$(RESET)      Start Metro using tunnel (for firewalled Wi-Fi)"
	@$(ECHO) "     $(CYAN)clean$(RESET)       Remove bundler cache, artifacts, and temp folders"
	@$(ECHO) "     $(CYAN)fclean$(RESET)      Full reset: remove dependencies, caches, and $(ENV)"
	@$(ECHO) "     $(CYAN)re$(RESET)          Reinstall dependencies and relaunch"
	@$(ECHO) "     $(CYAN)help$(RESET)        Show available rules"
	@$(ECHO) ""
