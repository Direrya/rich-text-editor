/* eslint-disable no-undef */
export default function({
    mathEditor,
    locale,
    title,
    description,
    shortcuts,
    answerTitle,
    updated,
    startedAt,
    sendFeedback,
    langLink,
    langLabel
}) {
    return `
<html>
<head>
    <meta charset='utf-8'>
    <title>${mathEditor}</title>
    <link rel="stylesheet" type="text/css" href="mathquill/build/mathquill.css">
    <link rel="stylesheet" type="text/css" href="rich-text-editor.css"/>
    <link rel="stylesheet" type="text/css" href="student.css"/>
    <script src="baconjs/dist/Bacon.js"></script>
    <link rel="icon" href="/rich-text-editor-favicon.ico" type="image/x-icon"/>
    <link rel="shortcut icon" href="/rich-text-editor-favicon.ico" type="image/x-icon"/>
    <script>
        window.locale = '${locale}'
    </script>
</head>
<body>
<article>
    <section>
        <h1>${title}</h1>

        <div class="instructions">
            <div style="width: 55%">
                ${description}
            </div>
            <div style="width:45%">
                ${shortcuts}
            </div>
        </div>

        <h2>${answerTitle} 1</h2>
        <div class="answer" id="answer1"></div>
    </section>
</article>
<footer>
    <section>
        <div class="paragraph">
            ${updated} ${startedAt}
        </div>
        <div class="paragraph">
            <a href="https://github.com/digabi/rich-text-editor">GitHub</a>
        </div>
        <div class="paragraph">
            <a href="mailto:abitti-palaute@ylioppilastutkinto.fi?subject=Palaute / Math-editor">${sendFeedback}
                (abitti-palaute@ylioppilastutkinto.fi)</a>
        </div>
        <div class="paragraph">
            <a href="${langLink}">${langLabel}</a>
        </div>
    </section>
</footer>
<script src="student.js"></script>
<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-49446143-7', 'auto');
    ga('send', 'pageview');
</script>
</body>
</html>`
}
