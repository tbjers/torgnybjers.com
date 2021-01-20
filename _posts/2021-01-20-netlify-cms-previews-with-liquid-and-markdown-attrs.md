---
layout: post
title: Netlify CMS Previews with Liquid and Markdown Attrs
date: 2021-01-20 09:29 -0500
byline: Get accurate preview representations in Netlify CMS from your Jekyll site
tags:
  - howto
  - netlify
  - netlifycms
---

I use Jekyll for most of my static sites. I recently discovered Netlify and Netlify CMS and found them delightful. As part of a recent launch, I decided to incorporate Netlify CMS into the project.

I found it easy to add Netlify CMS to Jekyll and decided to customize the admin experience. I moved several pieces of information into data files and configured Netlify CMS to edit these data pieces.

Editable data:
- Categories
- Header/footer/legal links
- Authors (in separate files)
- Articles (`_posts`)
- Pages (any other `.markdown` page)

The way that Netlify CMS presents these in the UI can be a bit clunky. I found it an acceptable compromise.

To present the Jekyll page as accurately as possible in the CMS preview pane, I created several preview components and made some adjustments to the CMS index page.

## Jekyll Configuration

Modifications to the `_config.yml` file:

```yml
defaults:
  - scope:
      path: ""
      type: "authors"
    values:
      layout: "author"
  - scope:
      path: admin/
    values:
      sitemap: false
```

I exclude the admin site from the sitemap and also add a global configuration for Author page templates.

## Netlify CMS

This is what our `admin/index.html` currently looks like:

{% raw %}```html
---
---

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>prepper.army CMS</title>
    <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/html-react-parser@latest/dist/html-react-parser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/liquidjs/dist/liquid.browser.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/markdown-it@12.0.4/dist/markdown-it.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/markdown-it-attrs@4.0.0/markdown-it-attrs.browser.js"></script>
    <script src="{{ '/admin/init.js' | relative_url }}"></script>
    <script defer src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script defer src="https://unpkg.com/netlify-cms@2.10.80/dist/netlify-cms.js"></script>
    <script defer src="/admin/preview-templates/index.js" type="module"></script>
    <script defer src="{{ '/admin/cms.js' | relative_url }}"></script>
  </body>
</html>
```{% endraw %}

A breakdown of the tools that we use in our rendering process:

- react
- html-react-parser
- liquidjs
- markdown-it
- markdown-it-attrs

We configure Netlify CMS with a JavaScript file instead of using the YML file for Content-Security-Policy reasons.

That configuration file looks like this:

{% raw %}```js
document.addEventListener('DOMContentLoaded', () => {
  const { CMS, initCMS: init } = window;
  init({
    config: {
      backend: {
        name: "git-gateway",
        branch: "main",
        squash_merges: true,
      },
      load_config_file: false,
      logo_url: "/assets/cms-logo.svg",
      publish_mode: "editorial_workflow",
      media_library: {
        name: "cloudinary",
        config: {
          cloud_name: "",
          api_key: "",
        },
      },
      collections: [
        {
          name: "articles",
          label: "Articles",
          label_singular: "Article",
          folder: "_posts/",
          create: true,
          slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
          extension: "markdown",
          format: "yaml-frontmatter",
          editor: {
            preview: true,
          },
          fields: [
            {
              label: "Layout",
              name: "layout",
              widget: "select",
              options: [
                { label: "Standard", value: "post" },
                { label: "With Hero", value: "feature_post" },
              ],
            },
            { label: "Title", name: "title", widget: "string" },
            { label: "Publish Date", name: "date", widget: "datetime", format: "YYYY-MM-DD HH:mm ZZ", date_format: "YYYY-MM-DD", time_format: "HH:mm ZZ" },
            {
              label: "Author",
              name: "author",
              required: false,
              widget: "relation",
              collection: "authors",
              default: "",
              search_fields: ["short_name", "name"],
              value_field: "short_name",
              display_fields: ["name"],
              options_length: 100,
            },
            {
              label: "Categories",
              name: "categories",
              required: true,
              widget: "relation",
              default: "",
              collection: "config",
              file: "categories",
              search_fields: ["categories.*.title"],
              display_fields: ["categories.*.title"],
              value_field: "categories.*.slug",
              options_length: 100,
              multiple: true,
            },
            { label: "Tags", name: "tags", widget: "list", allow_add: true },
            { label: "Enable Comments", name: "comments", widget: "boolean", default: true, required: false },
            {
              label: "Title Background Image",
              hint: "Use images from Posts/Hero Headers, ratio should be 4:1 (1600x400)",
              name: "image",
              widget: "image",
              allow_multiple: false,
              required: false,
              media_library: {
                name: "cloudinary",
                output_filename_only: true,
              },
            },
            { label: "Body", name: "body", widget: "markdown" },
          ],
        },
        {
          name: "pages",
          label: "Pages",
          label_singular: "Page",
          editor: {
            preview: true,
          },
          files: [
            {
              label: "About",
              name: "about",
              file: "about.markdown",
              fields: [
                { label: "Title", name: "title", widget: "string", default: "About us" },
                { label: "Layout", name: "layout", widget: "hidden", default: "page" },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
            {
              label: "Privacy",
              name: "privacy",
              file: "privacy.markdown",
              fields: [
                { label: "Title", name: "title", widget: "string", default: "Security & Privacy Notice" },
                { label: "Layout", name: "layout", widget: "hidden", default: "page" },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
            {
              label: "Terms",
              name: "terms",
              file: "terms.markdown",
              fields: [
                { label: "Title", name: "title", widget: "string", default: "Terms & Conditions" },
                { label: "Layout", name: "layout", widget: "hidden", default: "page" },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
            {
              label: "Cookies",
              name: "cookies",
              file: "cookies.markdown",
              fields: [
                { label: "Title", name: "title", widget: "string", default: "Cookie Policy" },
                { label: "Layout", name: "layout", widget: "hidden", default: "page" },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
            {
              label: "Contact us",
              name: "contact",
              file: "contact.markdown",
              fields: [
                { label: "Title", name: "title", widget: "string", default: "Contact us", required: false },
                { label: "Layout", name: "layout", widget: "hidden", default: "page" },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
            {
              label: "Contact Success",
              name: "contact-success",
              file: "contact-success.markdown",
              fields: [
                { label: "Layout", name: "layout", widget: "hidden", default: "page" },
                { label: "Body", name: "body", widget: "markdown" },
              ],
            },
          ],
        },
        {
          name: "config",
          label: "Config",
          editor: {
            preview: false,
          },
          files: [
            {
              label: "Categories",
              name: "categories",
              file: "_data/categories.yml",
              fields: [
                {
                  label: "Categories",
                  name: "categories",
                  widget: "list",
                  fields: [
                    {
                      label: "Title",
                      name: "title",
                      widget: "string",
                    },
                    {
                      label: "Slug",
                      name: "slug",
                      widget: "string",
                    },
                  ],
                },
              ],
            },
            {
              label: "Navigation",
              name: "navigation",
              file: "_data/navigation.yml",
              fields: [
                {
                  label: "Header Navigation",
                  name: "header",
                  widget: "list",
                  fields: [
                    { label: "Name", name: "name", widget: "string" },
                    { label: "Link", name: "link", widget: "string" },
                    { label: "Target", name: "target", widget: "string", required: false },
                  ],
                },
                {
                  label: "Footer Navigation",
                  name: "footer",
                  widget: "list",
                  fields: [
                    { label: "Name", name: "name", widget: "string" },
                    { label: "Link", name: "link", widget: "string" },
                    { label: "Target", name: "target", widget: "string", required: false },
                  ],
                },
                {
                  label: "Legal Navigation",
                  name: "legal",
                  widget: "list",
                  fields: [
                    { label: "Name", name: "name", widget: "string" },
                    { label: "Link", name: "link", widget: "string" },
                    { label: "Target", name: "target", widget: "string", required: false },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "authors",
          label: "Authors",
          label_singular: "Author",
          folder: "_authors/",
          create: true,
          delete: true,
          publish: true,
          identifier_field: "short_name",
          slug: "{{slug}}",
          extension: "markdown",
          format: "yaml-frontmatter",
          editor: {
            preview: false,
          },
          fields: [
            {
              label: "Short Name",
              name: "short_name",
              widget: "string",
              hint: "Name used for author file and in relational references.",
            },
            { label: "Name", name: "name", widget: "string" },
            { label: "Position", name: "position", widget: "string", hint: "Name of the position e.g. Editor" },
            {
              label: "Rank",
              name: "rank",
              widget: "number",
              value_type: "int",
              min: 1,
              step: 1,
              hint: "Rank of position, for staff page sorting.",
            },
            { label: "Email", name: "email", widget: "string" },
            { label: "Twitter", name: "twitter_username", widget: "string" },
            { label: "Facebook", name: "facebook_username", widget: "string" },
            { label: "Instagram", name: "instagram_username", widget: "string" },
            { label: "Body", name: "body", widget: "markdown" },
          ],
        },
      ],
    },
  });
});
```{% endraw %}

We had to make a few adjustments to the regular post in order to match it up perfectly with Jekyll.

One of those changes involved updating the defaults for the date format:

```js
{ label: "Publish Date", name: "date", widget: "datetime", format: "YYYY-MM-DD HH:mm ZZ", date_format: "YYYY-MM-DD", time_format: "HH:mm ZZ" },
```

Note the changed format, `"YYYY-MM-DD HH:mm ZZ"`, which corresponds with the way Jekyll writes date strings in our configuration.

## Preview Templates

The file `admin/preview-templates/index.js` contains the good stuff:

{% raw %}```js
import htm from "https://unpkg.com/htm?module";

const Liquid = window.liquidjs.Liquid;
const html = htm.bind(h);
const engine = new Liquid();
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true,
}).use(window.markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{:',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
});

/**
 * Check if an array contains any of the elements in the
 * supplied array.
 * @param {Array} haystack Array to check against
 * @param {Array} needles Array with values to be present in haystack
 */
const contains = (haystack, needles) => {
  if (Array.isArray(haystack) && Array.isArray(needles)) {
    return needles.filter((v) => {
      return haystack.includes(v);
    }).length > 0;
  }
  return false;
};

// Create pullquote Liquid tag
engine.registerTag('pullquote', {
  parse: function (tagToken, remainTokens = []) {
    this.tokens = [];
    this.classes = [];

    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on('start', () => {
        this.classes = tagToken.args || [];
        if (!contains(this.classes, ['left', 'right', 'center'])) {
          this.classes.unshift('right');
        }
      })
      .on('token', (token) => {
        if (token.name === 'endpullquote') {
          stream.stop();
        } else {
          this.tokens.push(token);
        }
      })
      .on('end', () => {
        console.error(`tag ${tagToken.getText()} not closed`);
      });
    stream.start();
  },

  render: function () {
    const rawText = this.tokens.map((token) => token.getText()).join('');
    try {
      const re = /\{" (.+) "\}/;
      const [replace, clean] = re.exec(rawText);
      const pullquote = `<span class="pullquote ${this.classes.join(' ')}" data-pullquote="${clean}"></span>`;
      const finishedText = rawText.replace(`${replace}`, `${pullquote}${clean}`);
      return finishedText;
    } catch (error) {
      console.log(error);
      return rawText;
    }
  }
});

// ArticlePreview React Component
const ArticlePreview = createClass({
  render: function () {
    const { entry, widgetFor } = this.props;
    const rawContent = widgetFor("body").props.value;
    const liquidContent = engine.parseAndRenderSync(rawContent);
    const markdownContent = md.render(liquidContent);
    return html`
      <main class="page-content">
        <div class="wrapper">
          <article class="post h-entry">
            <header>
              <h1 class="post-title">${entry.getIn(["data", "title"], null)}</h1>
            </header>
            <p class="post-meta">
              <time class="dt-published">${entry.getIn(["data", "date"], new Date())}</time>
            </p>
            <p>${entry.getIn(["data", "summary"], "")}</p>
            <div class="post-content e-content">
              ${window.HTMLReactParser(markdownContent)}
            </div>
            <p>
              ${entry.getIn(["data", "tags"], []).map(tag => html`<span class="chip">${tag}</span>`)}
            </p>
          </article>
        </div>
      </main>
    `;
  }
});

// Articles/post preview templates
CMS.registerPreviewTemplate("articles", ArticlePreview);

// PagePreview React Component
const PagePreview = createClass({
  render() {
    const entry = this.props.entry;
    return html`
      <main class="page-content">
        <div class="wrapper">
          <article class="post h-entry">
            <header>
              <h1 class="post-title">${entry.getIn(["data", "title"], null)}</h1>
            </header>
            <p>${entry.getIn(["data", "summary"], "")}</p>
            <div class="post-content e-content">
              ${this.props.widgetFor("body")}
            </div>
            <p>
              ${entry.getIn(["data", "tags"], []).map(tag => html`<a href="#" rel="tag">${tag}</a>`)}
            </p>
          </article>
        </div>
      </main>
    `;
  }
});

// Individual page templates (must be specified individually)
// See: https://www.netlifycms.org/docs/customization/#registerpreviewtemplate
CMS.registerPreviewTemplate("about", PagePreview);
CMS.registerPreviewTemplate("privacy", PagePreview);
CMS.registerPreviewTemplate("terms", PagePreview);
CMS.registerPreviewTemplate("cookies", PagePreview);
CMS.registerPreviewTemplate("contact", PagePreview);
CMS.registerPreviewTemplate("contact-success", PagePreview);

// Register the main stylesheet for previews
CMS.registerPreviewStyle("/assets/main.css");

// Register any CSS file on the home page as a preview style
fetch("/")
  .then(response => response.text())
  .then(html => {
    const f = document.createElement("html");
    f.innerHTML = html;
    Array.from(f.getElementsByTagName("link")).forEach(tag => {
      if (tag.rel == "stylesheet" && !tag.media) {
        CMS.registerPreviewStyle(tag.href);
      }
    });
  });
```{% endraw %}

This will preprocess Liquid tags in your Jekyll Markdown and then run it through a Markdown parser that correctly handles attributes.

{% raw %}```markdown
[Exempli Gratia](https://example.com/){:class="blue"}
```{% endraw %}

The default widget renderer would yield this:

```html
<a href="https://example.com/">Exempli Gratia</a>{:class="blue"}
```

Not a big deal, right? It's still hideous. So I set out to fix it.

This particular example also handles pullquotes. We're using a slightly modded version of the [Octopress pullquote tag](https://github.com/octopress/pullquote-tag){:rel="nofollow noreferrer" target="_blank"}.

If you have any questions, feel free to reach out to me on Twitter on [@torgnybjers](https://twitter.com/torgnybjers){:rel="nofollow noreferrer" target="_blank"}!
