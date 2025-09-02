#!/bin/bash
set -euo pipefail

# === Установка nvm для bash ===
if [ ! -d "$HOME/.nvm" ]; then
  echo ">>> Installing nvm..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Добавляем строки в ~/.bashrc (если их ещё нет)
if ! grep -q 'NVM_DIR' ~/.bashrc 2>/dev/null; then
  cat << 'EOF' >> ~/.bashrc

# >>> nvm setup >>>
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # загрузка nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # автодополнение
# <<< nvm setup <<<
EOF
fi

# Загружаем nvm в текущую сессию
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Устанавливаем Node.js (последний LTS)
nvm install --lts
nvm use --lts

# === pnpm для bash ===
curl -fsSL https://get.pnpm.io/install.sh | sh -
if ! grep -q 'pnpm' ~/.bashrc 2>/dev/null; then
  echo 'export PATH="$HOME/.local/share/pnpm:$PATH"' >> ~/.bashrc
fi

# === Настройка для fish ===
if command -v fish >/dev/null 2>&1; then
  mkdir -p ~/.config/fish

  # Установка fisher + плагинов (nvm.fish и bass)
  fish -c 'curl -sL https://git.io/fisher | source; fisher install jorgebucaran/nvm.fish edc/bass'

  # Добавляем настройки nvm в config.fish (если их ещё нет)
  if ! grep -q 'NVM_DIR' ~/.config/fish/config.fish 2>/dev/null; then
    cat << 'EOF' >> ~/.config/fish/config.fish

# >>> nvm setup >>>
set -x NVM_DIR $HOME/.nvm
bass source $NVM_DIR/nvm.sh ';' nvm use default
# <<< nvm setup <<<
EOF
  fi

  # pnpm в fish
  if ! grep -q 'pnpm' ~/.config/fish/config.fish 2>/dev/null; then
    cat << 'EOF' >> ~/.config/fish/config.fish

# >>> pnpm setup >>>
set -gx PNPM_HOME "$HOME/.local/share/pnpm"
if not string match -q -- $PNPM_HOME $PATH
  set -gx PATH "$PNPM_HOME" $PATH
end
# <<< pnpm setup <<<
EOF
  fi
fi

echo "✅ Установка завершена!"
echo "Перезапусти терминал (bash или fish), чтобы окружение применилось."
