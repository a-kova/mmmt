const eleventySass = require("@grimlink/eleventy-plugin-sass");
const sass = require("sass");
const Image = require("@11ty/eleventy-img");
const dateFormat = require('date-format');

async function imageShortcode(src, alt, widths) {
  let metadata = await Image(src, {
    widths: Array.isArray(widths) ? widths : [widths],
    formats: ["webp"],
    outputDir: "dist/assets/images",
    urlPath: "/assets/images/",
  });

  let imageAttributes = {
    alt,
    //srcset: 'test',
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/js");

  eleventyConfig.addPlugin(eleventySass, {
    sass,
    outputPath: "assets/styles",
    outputStyle:
      process.env.ENVIRONMENT === "production" ? "compressed" : "expanded",
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  eleventyConfig.addFilter("formatDate", (date, format = 'Y/m/d') => dateFormat(format, date));
  
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    templateFormats: ["html", "md", "njk"],
  };
};
