module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: "./",
                    src: ["src/**/*.json", "src/**/*.js", "gruntfile.js", "package.json"],
                    dest: "./dist"
                }]
            }
        },
        ts: {
            app: {
                files: [{
                    src: ["src/\*\*/\*.ts", "app.ts"],
                    dest: "./dist"
                }],
                options: {
                    "module": "commonjs",
                    "allowJs": true,
                    "moduleResolution": "node",
                    "outDir": "./dist",
                    "rootDir": "./",
                    "target": "es6",
                    "sourceMap": true,
                    "strict": true,
                    "noImplicitAny": true,
                    "esModuleInterop": true,
                    "resolveJsonModule": true,
                    "lib": [
                        "dom",
                        "es2017"
                    ]
                }
            }
        },
        env: {
            dev: {
                NODE_ENV: 'development',
                PORT: `4300`,
                VIRTUAL_AGENT_B2C_SERVER_BASE_URL: `https://test-va-demo-app.azurewebsites.net`,
                VIRTUAL_AGENT_SERVER_BASE_URL: `https://caelum-t-apimng.uk-1.paas.cloud.global.fujitsu.com:10443`,
                WEB_SEARCH: `enabled`,
                SWAGGER: 'OFF'
            },
            prod: {
                NODE_ENV: 'production',
                PORT: `8080`,
                VIRTUAL_AGENT_B2C_SERVER_BASE_URL: `https://test-va-demo-app.azurewebsites.net`,
                VIRTUAL_AGENT_SERVER_BASE_URL: `https://caelum-t-apimng.uk-1.paas.cloud.global.fujitsu.com:10443`,
                WEB_SEARCH: `enabled`,
                SWAGGER: 'OFF'
            }
        },
        run: {
            dev: {
                cmd: 'node',
                args: [
                    "dist/app.js"
                ]
            },
            prod: {
                cmd: 'node',
                args: [
                    "dist/app.js"
                ]
            }
        },
        watch: {
            ts: {
                files: ["src/\*\*/\*.ts"],
                tasks: ["ts"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", [
        "copy:build",
        "ts"
    ]);

    grunt.registerTask('devrun', ['env:dev', 'run:dev']);
    grunt.registerTask('prodrun', ['env:prod', 'run:prod']);
};