let mix = require('laravel-mix');
let webpack = require('webpack');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.js('src/js/app.js', 'assets/js')
    .sass('src/sass/app.scss', 'assets/css')
    .sass('src/sass/oauth/app.scss', 'assets/css/oauth.css')
    .setPublicPath('assets')
    .setResourceRoot('../')
    .version()
    .sourceMaps();

let plugins = [];

plugins.push(
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|fa)$/)
);

plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'GIT_SHA': JSON.stringify(process.env.GIT_SHA)
        }
    })
);

if ('production' === process.env.NODE_ENV) {
    let SentryPlugin = require('webpack-sentry-plugin');
    plugins.push(new SentryPlugin({
        // Sentry options are required
        organization: 'sentry',
        project: 'panel',
        apiKey: '2f7d2e3c06a24d9c9642ff51c44269a13d3935075f194a91982386667b4cf730',
        filenameTransform: function (filename) {
            return '~/panel/v1/assets' + filename
        },
        // Release version name/hash is required
        release: process.env.GIT_SHA,
        baseSentryURL: 'https://sentry.zarinpal.com/api/0'
    }));

}

mix.webpackConfig({
    plugins: plugins
});

// .copyDirectory('src/img', 'assets/img');

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
