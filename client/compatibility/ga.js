// GA = function(code) {
//     var _gaq = window._gaq || [];
//     _gaq.push(['_setAccount', code]);
//     _gaq.push(['_trackPageview']);
//     console.log("doing this!");
//         var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//         ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//         var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//         window.ga = ga;
// };

GA =  function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    };
