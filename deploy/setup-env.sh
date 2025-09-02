#!/bin/bash
set -e
echo "=== Starting environment setup ==="

# -------------------------------
# 1️⃣ Установка NVM
# -------------------------------
echo "=== Installing/updating NVM ==="
export NVM_DIR="$HOME/.nvm"

if [ -d "$NVM_DIR" ]; then
    echo "NVM already installed, updating..."
    git -C "$NVM_DIR" pull
else
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Подключаем nvm в текущую сессию
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# -------------------------------
# 2️⃣ Установка Node.js
# -------------------------------
echo "=== Installing latest Node.js ==="
nvm install node
nvm alias default node

# -------------------------------
# 3️⃣ Установка pnpm
# -------------------------------
echo "=== Installing pnpm ==="
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Добавляем pnpm в PATH для bash
PNPM_BASHRC_LINE='export PATH="$HOME/.local/share/pnpm:$PATH"'
if ! grep -Fxq "$PNPM_BASHRC_LINE" "$HOME/.bashrc"; then
    echo "$PNPM_BASHRC_LINE" >> "$HOME/.bashrc"
fi

# Загружаем PATH в текущую сессию
export PATH="$HOME/.local/share/pnpm:$PATH"

# -------------------------------
# 4️⃣ Настройка Fish shell
# -------------------------------
echo "=== Configuring Fish shell ==="
FISH_CONFIG="$HOME/.config/fish/config.fish"
mkdir -p "$(dirname "$FISH_CONFIG")"

fish -c '
# Установка fisher и bass, если ещё не установлены
if not functions -q fisher
    curl -sL https://git.io/fisher | source
    fisher install jorgebucaran/fisher
end
fisher install edc/bass

# Настройка nvm и pnpm для fish
set -gx NVM_DIR $HOME/.nvm
bass source $NVM_DIR/nvm.sh "; nvm use default"

set -gx PNPM_HOME $HOME/.local/share/pnpm
if not contains $PNPM_HOME $PATH
    set -gx PATH $PNPM_HOME $PATH
end
'

echo "=== Environment setup completed ==="
echo "To start using pnpm in Fish shell, run 'source ~/.config/fish/config.fish' or open a new Fish shell."
