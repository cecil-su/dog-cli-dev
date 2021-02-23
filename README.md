# dog-cli-dev

lerna create exec core
lerna add semver --scope @dog-cli/core
lerna add commander core/cli
lerna exec --scope @dog-cli/core npm remove npmlog
lerna exec --scope @dog-cli/core npm install file:../../utils/log
lerna exec --scope @dog-cli/core npm link
