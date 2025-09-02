#!/bin/bash
set -e

echo "=== Installing NVM (Node Version Manager) ==="

# Скачиваем и устанавливаем nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Настройка bash
NVM_BASHRC="$HOME/.bashrc"
if ! grep -q "NVM_DIR" "$NVM_BASHRC"; then
    cat << 'EOF' >> "$NVM_BASHRC"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # загрузка nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # автодополнение
EOF
fi

# Загружаем nvm в текущую сессию bash
[ -f "$NVM_BASHRC" ] && source "$NVM_BASHRC"

echo "=== Installing latest Node.js via NVM ==="
nvm install node
nvm alias default node

echo "=== Installing PNPM ==="
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Добавляем pnpm в PATH для bash
PNPM_BASHRC_LINE='export PATH="$HOME/.local/share/pnpm:$PATH"'
grep -qxF "$PNPM_BASHRC_LINE" "$NVM_BASHRC" || echo "$PNPM_BASHRC_LINE" >> "$NVM_BASHRC"
source "$NVM_BASHRC"

echo "=== Configuring Fish shell ==="
FISH_CONFIG="$HOME/.config/fish/config.fish"
mkdir -p "$(dirname "$FISH_CONFIG")"

# Установка fisher и bass через fish
fish -c '
# Проверяем, установлен ли fisher
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

echo "=== Installation completed ==="
echo "To start using pnpm, run 'source ~/.config/fish/config.fish' or open a new fish shell."
