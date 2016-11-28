# stage-fright
Yet another web-based presentation library


## Markup

Markup is fairly straight-forward with an eye towards semantics. First, you set up the `stage`, which is going to be where all slides are in.

```html
<main class="_stage">
  …
</main>
```

Then, each grouping of slides (even if there is a single slide) is inside a `stage group`

```html
<article class="_stage--group">
  …
</article>
```

Finally, each `slide` is a `section` inside the `stage group`. Slides are made up of the actual slide, and an inner `content` area

```html
<section class="_stage--slide">
  <div class="_stage--content">
    …
  </div>
</section>
```

Inside of slides, you can have a `fragment` which is a piece of content to be progressively revealed. When a fragment has been activated, it will get a `data-active` attribute on it. By default, fragments fade in, but CSS can be used to change it to whatever is desired

```html
<h3>This is a big bit of the slide</h3>
<ul>
  <li class="fragment">This is a revealed talking point</li>
  <li class="fragment">And this is another one</li>
  <li class="fragment">And this is a third</li>
</ul>
```

### Full Sample Markup

A basic example of this all in place looks something like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Stage Fright Presentation</title>
  <!-- Bring in the CSS from wherever it's been rendered -->
  <link rel="stylesheet" href="/css/stage-fright.css">
</head>
<body>
  <!-- Only the main section is needed for our slide deck -->
  <main class="_stage">
    <!-- First slide group, an introduction slide maybe -->
    <article class="_stage--group">
      <section class="_stage--slide">
        <div class="_stage--content">
          <h1>Hello World!</h1>
        </div>
      </section>
    </article>

    <!-- A second slide group -->
    <article class="_stage--group">
      <!-- The first slide in this group -->
      <section class="_stage--slide">
        <div class="_stage--content">
          <h2>This is a Second Section</h2>
        </div>
      </section>

      <!-- The second slide in this group -->
      <section class="_stage--slide">
        <div class="_stage--content">
          <p>It has good content</p>
          <!-- Fragments to be revealed as we go -->
          <ul>
            <li class="fragment">And some content</li>
            <li class="fragment">That gets revealed</li>
            <li class="fragment">As I talk</li>
          </ul>
        </div>
      </section>
    </article>
  </main>

  <!-- Bring in the Stage Fright JS, defered for better performance -->
  <script src="/js/stage-fright.min.js" defer></script>
</body>
</html>
```
