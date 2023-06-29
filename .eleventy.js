const eleventySass = require('@grimlink/eleventy-plugin-sass');
const sass = require('sass');
const Image = require('@11ty/eleventy-img');
const dateFormat = require('date-format');
const site = require('./src/_data/site');
const uniqid = require('uniqid');

const AVG_WORDS_READ_PER_MINUTE = 250;
const IS_PRODUCTION = process.env.ELEVENTY_ENV === 'production';

async function imageShortcode(filename, alt, widths = [800, null]) {
  const src = `./src/assets/images/${filename}`;

  let metadata = await Image(src, {
    widths,
    formats: ['webp'],
    outputDir: 'dist/assets/images',
    urlPath: '/assets/images/',
  });

  metadata.webp = metadata.webp.map((img) => {
    if (!img.url.includes(site.url)) {
      img.url = site.url + img.url;
    }

    if (!img.srcset.includes(site.url)) {
      img.srcset = site.url + img.srcset;
    }

    return img;
  });

  const srcset = [`${metadata.webp[0].url} 1x`];
  if (metadata.webp[1]) {
    srcset.push(`${metadata.webp[1].url} 2x`);
  }

  let imageAttributes = {
    alt,
    srcset: srcset.join(', '),
    sizes: '100vw',
    loading: 'eager',
    decoding: 'async',
  };

  return Image.generateHTML(metadata, imageAttributes);
}

async function metaImageShortcode(filename) {
  const src = `./src/assets/images/${filename}`;

  let metadata = await Image(src, {
    widths: [null],
    formats: ['png'],
    outputDir: 'dist/assets/images',
    urlPath: '/assets/images/',
  });

  return `<meta property="og:image" content="${site.url}/${metadata.png[0].url}">`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets/js');
  eleventyConfig.addPassthroughCopy('src/assets/icons');
  eleventyConfig.addPassthroughCopy('src/assets/logo.svg');
  eleventyConfig.addPassthroughCopy('src/assets/favicon.png');

  eleventyConfig.addPlugin(eleventySass, {
    sass,
    outputPath: 'assets/styles',
    outputStyle: IS_PRODUCTION ? 'compressed' : 'expanded',
  });

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addLiquidShortcode('image', imageShortcode);
  eleventyConfig.addJavaScriptFunction('image', imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode('metaImage', metaImageShortcode);
  eleventyConfig.addLiquidShortcode('metaImage', metaImageShortcode);
  eleventyConfig.addJavaScriptFunction('metaImage', metaImageShortcode);

  eleventyConfig.addFilter('formatdate', (date, format = 'Y/m/d') =>
    dateFormat(format, date)
  );
  eleventyConfig.addFilter('readtime', (wordsCount) =>
    Math.ceil(wordsCount / AVG_WORDS_READ_PER_MINUTE)
  );
  eleventyConfig.addFilter('hash', (filePath) =>
    IS_PRODUCTION ? `${filePath}?v=${uniqid.time()}` : filePath
  );
  eleventyConfig.addFilter(
    'attrvalue',
    (string, attr) => new RegExp(`(${attr}=")([^"]*)(")`).exec(string)?.[2]
  );

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    templateFormats: ['html', 'md', 'njk'],
  };
};
