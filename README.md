# gatsby-plugin-minify-classnames

Minify CSS Modules class names. This plugin is tested with official CSS plugins —
`gatsby-plugin-less`, `gatsby-plugin-sass` and `gatsby-plugin-stylus`.

## Install

```sh
$ npm install gatsby-plugin-minify-classnames
```

## Configure

> Add this plugin after Less/Sass/Stylus plugins in `gatsby-config.js`.

```js
module.exports = {
  plugins: [
    'gatsby-plugin-less',
    'gatsby-plugin-sass',
    'gatsby-plugin-stylus',
    {
      resolve: 'gatsby-plugin-minify-classnames',
      // options: {
      //   // The options below are the plugin defaults
      //   dictionary: 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789',
      //   enable: process.env.NODE_ENV === 'production',
      //   prefix: '',
      //   sufix: ''
      // }
    }
  ]
}
```

### dictionary

Type: `string`.
Default: `'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789'`.

Characters used to generate the minified class names. Class names should start
with letters, so the string must have at least one letter.

### enable

Type: `boolean`. Default: `process.env.NODE_ENV === 'production'`.

Set it to `true` to enable the plugin, `false` to disable. By default, it'll be
enabled on production environments.

### prefix

Type: `string`. Default: `''`.

### suffix

Type: `string`. Default: `''`.

## How it works

It shortens the class name length by mapping the `resourcePath` and the
`localName` to incremental strings. To avoid issues between specific class names
and ad blockers, the default dictionary uses only consonants and numbers.

### Example

— The files `index.module.css` and `menu.module.css`, respectively:

```css
.container {
  display: flex;
}

.footer {
  padding: 1rem;
}
```

```css
.container {
  position: fixed;
}
```

— Generate the following CSS with `gatsby-plugin-minify-classnames`:

```css
/* index.module.css */

.b_b {
  display: flex;
}

.b_c {
  padding: 1rem;
}

/* menu.module.css */

.c_b {
  position: fixed;
}
```

— Without `gatsby-plugin-minify-classnames`:

```css
/* index.module.css */

.index-module--container--l2fVb {
  display: flex;
}

.index-module--footer--3V8ew {
  padding: 1rem;
}

/* menu.module.css */

.menu-module--container--28fe0 {
  position: fixed;
}
```

## License

[The MIT License][license]

[license]: ./LICENSE
