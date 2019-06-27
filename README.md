# gatsby-plugin-minify-classnames

Minify classnames when using CSS Modules. It's compatible with official Gatsby PostCSS, Sass and Less plugins.

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

__Note:__ add this plugin after all PostCSS/Sass/Less plugins.

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    `gatsby-plugin-less`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-minify-classnames`,
      options: {
        develop: true, // Enable on `gatsby develop`
      },
    },
  ],
}
```

## License

[The MIT License](./LICENSE)
