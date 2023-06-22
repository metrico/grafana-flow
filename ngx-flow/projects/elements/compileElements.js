const fs = require('fs');
const {execSync} = require('child_process');

const projects = ['ngx-flow'];

projects.forEach(project => {
    const components = fs.readdirSync(`src/${project}`);

    console.log(`\nCompiling "${project}":\n`);

    components.forEach(component => compileComponent(project, component));
});

function compileComponent(project, component) {
    console.log(`\t- ${component}`);

    const buildJsFiles = `ng run elements:build:production --aot --main=projects/elements/src/${project}/${component}/compile.ts`;
    console.log(buildJsFiles,project,component)
    const bundleIntoSingleFile = `cat dist/tmp/runtime.js dist/tmp/main.js > dist/tmp/${component}.js`;
    const copyBundledComponent = `cp dist/tmp/${component}.js dist/components/`;

    execSync(`${buildJsFiles} && ${bundleIntoSingleFile} && ${copyBundledComponent}`);
}
