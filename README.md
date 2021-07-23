# gatsby-plugin-minify-classnames

Minify CSS Modules classnames. This plugin is tested with official CSS plugins —
`gatsby-plugin-less`, `gatsby-plugin-sass`, `gatsby-plugin-stylus` and
`gatsby-plugin-postcss`.

```css
/* Without gatsby-plugin-minify-classnames */

.index-module--container--l2fVb {
  display: flex;
}

.index-module--footer--3V8ew {
  padding: 1rem;
}

.menu-module--container--28fe0 {
  position: fixed;
}

/* With gatsby-plugin-minify-classnames */

.b_b {
  display: flex;
}

.b_c {
  padding: 1rem;
}

.c_b {
  position: fixed;
}
```

## Install

```bash
$ npm install gatsby-plugin-minify-classnames
```

## Configure

__Note:__ add this plugin after all Less/Sass/Stylus/PostCSS plugins.

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    `gatsby-plugin-less`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-stylus`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-minify-classnames`,
      options: {
        dictionary: 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789',
        enable: process.env.NODE_ENV === 'production',
        prefix: '',
        sufix: ''
      },
    },
  ],
}
```

## Options

### dictionary

Default: `'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789'`. Type:
`string`.

Set a custom dictionary to create the minified classnames. The generated
classnames should always start with letters, so the string must have at least
one letter.

### enable

Default: `process.env.NODE_ENV === 'production'`. Type: `boolean`.

Set it to `true` to enable the plugin, `false` to disable. By default, it'll be
enabled on production environments.

### prefix

Default: `''`. Type: `string`.

### suffix

Default: `''`. Type: `string`.

## License

[The MIT License](./LICENSE)
