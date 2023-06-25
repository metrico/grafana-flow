
const fs = require('fs-extra');
    const concat = require('concat');

    build = async () =>{
        const files = [
            './dist/lib-flow/runtime.js',
            './dist/lib-flow/polyfills.js',
            './dist/lib-flow/main.js'
          ];


          await fs.ensureDir('widget');
          await concat(files, 'widget/ngx-flow.js');
    }
    build();
