if ! gem list foreman -i --silent; then
echo “Installing foreman…”
gem install foreman
fi