const {execSync} = require('child_process');

compileMainTheme();

function compileMainTheme() {
    const pathFrom = `../ngx-flow/src`;
    const pathTo = `dist/helpers`;

    execSync(`lessc ${pathFrom}/global-vars.less ${pathTo}/main-theme.css`);
}
