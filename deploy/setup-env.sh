#!/bin/bash

# nvm installation
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# enable in bash
cat << 'EOF' >> ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # загрузка nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # автодополнение
EOF

source ~/.bashrc
# enable in fish
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/nvm.fish
cat << 'EOF' >> ~/.config/fish/config.fish
set -x NVM_DIR $HOME/.nvm
bass source $NVM_DIR/nvm.sh ';' nvm use default
EOF

fisher install edc/bass

source ~/.config/fish/config.fish

# node installation
nvm install latest

# pnpm install
curl -fsSL https://get.pnpm.io/install.sh | sh -
echo "export PATH="$HOME/.local/share/pnpm:$PATH"" >> ~/.bashrc
echo "export PATH="$HOME/.local/share/pnpm:$PATH"" >> ~/.config/fish/config.fish

source ~/.bashrc
source ~/.config/fish/config.fish