(function(f) {
    ChopSlider3 = function(a, c) {
        f.fn.csTransitionEnd = function(a) {
            return this.each(function() {
                var b = this,
                    c = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"];
                if (a)
                    for (var d = function() {
                            a.call(this);
                            for (var e = 0; e < c.length; e++) b.removeEventListener(c[e], d, !1)
                        }, e = 0; e < c.length; e++) b.addEventListener(c[e], d, !1)
            })
        };
        f.fn.csTransform = function(a) {
            return this.each(function() {
                var c = f(this)[0].style;
                if (a.transform) {
                    if (!b.support.threeD && 0 <= a.transform.indexOf("translate3d")) {
                        var d = a.transform.split("translate3d(")[1].split(")")[0].split(","),
                            e = a.transform.split("translate3d(")[0],
                            h = a.transform.split("translate3d(")[1].split(")")[1];
                        a.transform = e + " translateX(" + d[0] + ") translateY(" + d[1] + ") " + h
                    }
                    b.support.threeD && 0 > a.transform.indexOf("translate") && (a.transform += " translate3d(0px,0px,0px)");
                    c.webkitTransform = c.MsTransform = c.MozTransform = c.OTransform = c.transform = a.transform
                }
                if (a.time || 0 === a.time) c.webkitTransitionDuration = c.MsTransitionDuration = c.MozTransitionDuration = c.OTransitionDuration = c.transitionDuration = a.time / 1E3 + "s";
                if (a.delay || 0 === a.delay) c.webkitTransitionDelay = c.MsTransitionDelay = c.MozTransitionDelay = c.OTransitionDelay = c.transitionDelay = a.delay / 1E3 + "s";
                a.origin && (c.webkitTransformOrigin = c.MsTransformOrigin = c.MozTransformOrigin = c.OTransformOrigin = c.transformOrigin = a.origin);
                a.ease && (c.webkitTransitionTimingFunction = c.MsTransitionTimingFunction = c.MozTransitionTimingFunction = c.OTransitionTimingFunction = c.transitionTimingFunction = a.ease);
                c.webkitTransitionProperty = c.MsTransitionTransitionProperty = c.MozTransitionTransitionProperty = c.OTransitionProperty = c.transitionProperty = "all"
            })
        };
        if (0 == a.length || a.hasClass("cs3-initialized")) return {};
        var b = {},
            b = this;
        c = c || {};
        f.extend(b, {
            params: c,
            c: a,
            slides: a.find(".cs3-slide"),
            _plugins: {
                onStartFuncs: [],
                onEndFuncs: [],
                initFuncs: []
            },
            images: [],
            newSlideIndex: !1,
            support: {
                touch: "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch,
                css3: b.hasCSS3(),
                threeD: b.has3D(),
                canvas: b.hasCanvas(),
                fullscreen: function() {
                    var a = document.documentElement;
                    return a.requestFullScreen || a.webkitRequestFullScreen || a.oRequestFullScreen || a.mozRequestFullScreen || a.msRequestFullScreen ? !0 : !1
                }()
            },
            user: {}
        });
        b.path = b.params.pathToCS3 || f('link[href*="idangerous.chopslider-3"]').attr("href").split("idangerous.chopslider-3")[0];
        b.params.callbacks || (b.params.callbacks = {});
        var d = !1,
            e = !1,
            h = !1;
        b.slides.each(function() {
            f(this).find("img").attr("src");
            b.images.push(f(this).find("img").attr("src"))
        });
        b.slides.eq(0).addClass("cs3-active-slide");
        b.c.addClass("cs3-initialized");
        b.slides.wrapAll('<div class="cs3-view"></div>');
        b.v = b.c.children(".cs3-view");
        b.v.append('<div class="cs3-loader"></div>');
        b.l = b.v.find(".cs3-loader");
        b.slideNext = function() {
            if (b.isAnimating) return !1;
            b.newSlideIndex = b.h.indexes().next;
            b.direction = 1;
            b.run()
        };
        b.slidePrev = function() {
            if (b.isAnimating) return !1;
            b.newSlideIndex = b.h.indexes().prev;
            b.direction = -1;
            b.run()
        };
        b.slideTo = function(a) {
            if (b.isAnimating) return !1;
            0 > a || a >= b.slides.length || (b.newSlideIndex = a, b.direction = a > b.h.indexes().active ? 1 : -1, b.run())
        };
        b.switchTo = function(a) {
            if (b.isAnimating) return !1;
            if (!(0 > a || a >= b.slides.length) && a != b.h.indexes().active) b.newSlideIndex = a, b._plugins.onStart(b), b.updateSlides()
        };
        for (var j in b.plugins) "onStart" in b.plugins[j] && b._plugins.onStartFuncs.push(b.plugins[j].onStart), "onEnd" in b.plugins[j] && b._plugins.onEndFuncs.push(b.plugins[j].onEnd), "init" in b.plugins[j] && b._plugins.initFuncs.push(b.plugins[j].init), b._plugins[j] = {};
        f.extend(b._plugins, {
            onStart: function(a, c) {
                for (var d = 0; d < b._plugins.onStartFuncs.length; d++) b._plugins.onStartFuncs[d](a, c)
            },
            onEnd: function(a, c) {
                for (var d = 0; d < b._plugins.onEndFuncs.length; d++) b._plugins.onEndFuncs[d](a, c)
            },
            init: function(a, c) {
                for (var d = 0; d < b._plugins.initFuncs.length; d++) b._plugins.initFuncs[d](a, c)
            }
        });
        b.calcEffects = function() {
            var a = b.params.effects;
            a || (a = "random-flat");
            var c = [],
                d = [];
            0 <= a.indexOf(",") ? c = a.split(",") : c.push(a);
            for (var e = 0; e < c.length; e++) {
                var h = f.trim(c[e]);
                if (0 <= h.indexOf("random-")) {
                    var g = h.split("-")[1];
                    if ("2D" == g || "2d" == g) g = "twoD";
                    if ("3D" == g || "3d" == g) g = "threeD";
                    for (var k in b.e[g]) "_" != k.charAt(0) && d.push(k)
                } else d.push(f.trim(c[e]))
            }
            c = [];
            for (e = 0; e < d.length; e++) g = d[e], g in b.e.threeD && b.support.threeD && c.push("threeD-" + g), g in b.e.twoD && b.support.css3 && c.push("twoD-" + g), g in b.e.canvas && b.support.canvas && c.push("canvas-" + g), g in b.e.flat && c.push("flat-" + g);
            if (0 == c.length)
                for (h in b.e.flat) c.push("flat-" + h);
            if (b.params.effectsGroupLock) {
                d = b.params.effectsGroupLock;
                h = [];
                if (b.support.threeD && d.support3d) {
                    k = d.support3d.split(",");
                    for (e = 0; e < c.length; e++)
                        for (var j = 0; j < k.length; j++) g = f.trim(k[j]), 0 <= c[e].indexOf(g) && h.push(c[e]);
                    c = h
                }
                if (b.support.css3 && d.support2d && !b.support.threeD) {
                    k = d.support2d.split(",");
                    for (e = 0; e < c.length; e++)
                        for (j = 0; j < k.length; j++) g = f.trim(k[j]), 0 <= c[e].indexOf(g) && h.push(c[e]);
                    c = h
                }
                if (!b.support.threeD && d.supportCanvasNoCSS3 && b.support.canvas && !b.support.css3) {
                    k = d.supportCanvasNoCSS3.split(",");
                    for (e = 0; e < c.length; e++)
                        for (j = 0; j < k.length; j++) g = f.trim(k[j]), 0 <= c[e].indexOf(g) && h.push(c[e]);
                    c = h
                }
            }
            if (0 == c.length)
                for (a in b.e.flat) "_" != a.charAt(0) && c.push("flat-" + a);
            b.effects = c
        };
        b.calcEffects();
        b.set_timeout = function(a, c) {
            function d() {
                document[e] && (k = c - ((new Date).getTime() - g), document.removeEventListener(h, d))
            }
            var e, h, f = {
                hidden: "visibilitychange",
                mozHidden: "mozvisibilitychange",
                webkitHidden: "webkitvisibilitychange",
                msHidden: "msvisibilitychange",
                oHidden: "ovisibilitychange"
            };
            for (e in f)
                if (f.hasOwnProperty(e) && e in document) {
                    h = f[e];
                    break
                }
            if (!h) return setTimeout(function() {
                a()
            }, c);
            var g = (new Date).getTime(),
                k = !1;
            document.addEventListener(h, d);
            if (document[e]) {
                var j = function() {
                    document[e] || (document.removeEventListener(h, j), b.set_timeout(a, c))
                };
                document.addEventListener(h, j)
            } else return setTimeout(function() {
                if (document[e]) {
                    var c = function() {
                        document[e] || (b.set_timeout(a, k), document.removeEventListener(h, c))
                    };
                    document.addEventListener(h, c)
                } else a()
            }, c)
        };
        b.params.autoplay = b.params.autoplay || {};
        b.params.autoplay.delay = b.params.autoplay.delay || 5E3;
        b.autoplayTimeout = !1;
        b.autoplayStart = function() {
            b.params.autoplay.enabled = !0;
            b.autoplayTimeout = b.set_timeout(function() {
                b.slideNext()
            }, b.params.autoplay.delay)
        };
        b.autoplayStop = function() {
            clearTimeout(b.autoplayTimeout);
            b.params.autoplay.enabled = !1
        };
        b.h = {
            updateDimension: function() {
                if (b.params.responsive) {
                    b.params.touch && (b.params.touch.enabled && b.support.touch && "touch" in b.plugins) && b.slides.eq(b.h.indexes().active).show();
                    b.width = b.width || b.c.width();
                    b.height = b.height || b.c.height();
                    var a = b.width,
                        c = b.height;
                    b.params.responsiveSetSize && (b.c.width("auto"), b.c.height("auto"));
                    if (b.slides.eq(b.h.indexes().active).hasClass("cs3-video-slide")) {
                        var d = !1;
                        b.slides.each(function() {
                            f(this).hasClass("cs3-video-slide") || (d = f(this).index())
                        });
                        !1 !== d ? (b.slides.eq(d).show(), b.width = b.slides.eq(d).find("img").width(), b.height = b.slides.eq(d).find("img").height(), b.slides.eq(d).hide()) : b.width = b.c.width()
                    } else b.width = b.slides.eq(b.h.indexes().active).find("img").width(), b.height = b.slides.eq(b.h.indexes().active).find("img").height();
                    b.params.responsiveSetSize && (b.c.width(b.width), b.c.height(b.height));
                    b.params.touch && (b.params.touch.enabled && b.support.touch && "touch" in b.plugins) && b.slides.eq(b.h.indexes().active).hide();
                    if (0 == b.width || 0 == b.height) b.width = a, b.height = c, b.c.width(b.width), b.c.height(b.height)
                } else b.width = b.c.width(), b.height = b.c.height()
            },
            setPerspective: function(a, c) {
                a = a || {};
                a.value = a.value || 1200;
                a.origin = a.origin || "50% 50%";
                c || (c = 0 <= navigator.userAgent.indexOf("MSIE") ? b.l : b.c);
                c.css({
                    "-webkit-perspective-origin": a.origin,
                    "-webkit-perspective": a.value,
                    "-moz-perspective-origin": a.origin,
                    "-moz-perspective": a.value,
                    "-ms-perspective-origin": a.origin,
                    "-ms-perspective": a.value,
                    "-o-perspective-origin": a.origin,
                    "-o-perspective": a.value,
                    "perspective-origin": a.origin,
                    perspective: a.value
                })
            },
            triggerIndex: !1,
            getDelay: function(a) {
                var c = 0;
                if (a.grid.cols && a.grid.rows) var d = Math.floor(a.index / a.grid.cols),
                    e = a.index - a.grid.cols * Math.floor(a.index / a.grid.cols);
                a.startIndex || (a.startIndex = 0);
                switch (a.type) {
                    case "linear":
                        "middle" == a.startIndex && (a.startIndex = Math.floor(a.grid.rows * a.grid.cols / 2));
                        c = Math.abs(a.delay * (a.startIndex - a.index));
                        b.h.triggerIndex = a.startIndex >= a.grid.cols * a.grid.rows / 2 ? 0 : a.grid.cols * a.grid.rows - 1;
                        break;
                    case "progressive":
                        c = Math.abs(a.delay * (a.startIndex - (e * a.grid.rows / 5 + d)));
                        b.h.triggerIndex = a.startIndex >= a.grid.cols * a.grid.rows / 2 ? 0 : a.grid.cols * a.grid.rows - 1;
                        break;
                    case "horizontal":
                        c = Math.abs(a.delay * (a.startIndex - e));
                        b.h.triggerIndex = a.startIndex >= a.grid.cols / 2 ? 0 : a.grid.cols - 1;
                        break;
                    case "vertical":
                        c = Math.abs(a.delay * (a.startIndex - d)), b.h.triggerIndex = a.startIndex >= a.grid.rows / 2 ? 0 : a.grid.rows * a.grid.cols - 1
                }
                return c
            },
            indexes: function() {
                var a = {};
                a.active = b.c.find(".cs3-active-slide").index();
                a.next = a.active + 1 >= b.slides.length ? 0 : a.active + 1;
                a.prev = 0 > a.active - 1 ? b.slides.length - 1 : a.active - 1;
                return a
            },
            transformString: function(a) {
                return "-webkit-transform:" + a + ";-moz-transform:" + a + ";-o-transform:" + a + ";-ms-transform:" + a + ";transform:" + a + ";"
            },
            slice: function(a) {
                a.square && (a.squareSize || (a.squareSize = 100), a.cols = Math.ceil(b.width / a.squareSize), a.rows = Math.ceil(b.height / a.squareSize));
                var c = a.cols,
                    d = a.rows;
                0 === a.index2 && (a.index2 = "0");
                var e = Math.floor(b.width / c),
                    h = e;
                e * c < b.width && (h = b.width - e * (c - 1));
                var g = Math.floor(b.height / d),
                    k = g;
                g * d < b.height && (k = b.height - g * (d - 1));
                var j = "",
                    r = b.images[a.index1];
                if (a.index2) var m = b.images[a.index2];
                var l = "";
                a.separate && (j += '<div class="cs3-slices-block">', l += '<div class="cs3-slices-block">');
                for (var B = 0; B < c * d; B++) {
                    var F = 0 == (B + 1) % c,
                        E = B > c * d - 1 - c,
                        v = F ? h : e,
                        z = E ? k : g,
                        x = (B - c * Math.floor(B / c)) * (J || 0),
                        w = Math.floor(B / c) * (K || 0),
                        y = -x + "px -" + w + "px";
                    if (a.make3d) {
                        var u = a.make3d;
                        f.extend({
                            left: "#555",
                            right: "#222",
                            top: "#555",
                            bottom: "#222",
                            back: "#333"
                        }, u.faces);
                        j += '<div class="cs3-slice" style="left:' + x + "px; top:" + w + "px; width:" + v + "px; height:" + z + 'px;">';
                        j += '<div style="background-position:' + y + "; background-image:url(" + r + "); width:" + v + "px; height:" + z + 'px" class="cs3-front-face"></div>';
                        x = "background-position:" + y + "; background-image:url(" + m + ");";
                        w = "";
                        y = "rotateY(180deg)";
                        "back" == u.newFace && (w = x);
                        u.newFace && u.newFaceRotate && (y = u.newFaceRotate);
                        u.depth || (u.depth = 0);
                        y = y + " translate3d(0,0," + parseInt(u.depth, 10) + "px)";
                        j += '<div style="' + w + " width:" + v + "px; height:" + z + "px; " + b.h.transformString(y) + '" class="cs3-back-face"></div>';
                        u.depth && (w = "", y = "rotateY(90deg) translate3d(" + u.depth / 2 + "px,0," + (v - u.depth / 2) + "px)", "right" == u.newFace && (w = x), j += '<div style="' + w + " width:" + u.depth + "px; height:" + z + "px; " + b.h.transformString(y) + '" class="cs3-right-face"></div>', w = "", y = "rotateY(-90deg) translate3d(" + -u.depth / 2 + "px,0," + u.depth / 2 + "px)", "left" == u.newFace && (w = x), j += '<div style="' + w + " width:" + u.depth + "px; height:" + z + "px; " + b.h.transformString(y) + '" class="cs3-left-face"></div>', w = "", y = "rotateX(-90deg) translate3d(0px," + u.depth / 2 + "px," + (z - u.depth / 2) + "px)", "bottom" == u.newFace && (w = x), j += '<div style="' + w + " width:" + v + "px; height:" + u.depth + "px; " + b.h.transformString(y) + '" class="cs3-bot-face"></div>', w = "", y = "rotateX(90deg) translate3d(0px," + -u.depth / 2 + "px," + u.depth / 2 + "px)", "top" == u.newFace && (w = x), j += '<div style="' + w + " width:" + v + "px; height:" + u.depth + "px; " + b.h.transformString(y) + '" class="cs3-top-face"></div>');
                        j += "</div>"
                    } else u = "background-position:" + y + "; background-image:url(" + r + "); left:" + x + "px; top:" + w + "px; width:" + v + "px; height:" + z + "px;", a.wrap && (u = "background-position:" + y + "; background-image:url(" + r + "); left:0px; top:0px; width:" + v + "px; height:" + z + "px;"), a.index2 && a.wrap && (j += '<div class="cs3-slices-block" style="left:' + x + "px; top:" + w + "px; width:" + v + "px; height:" + z + 'px;">', w = x = 0), j += '<div class="cs3-slice" style="' + u + '"></div>', a.index2 && (u = '<div class="cs3-slice" style="' + ("background-position:" + y + "; background-image:url(" + m + "); left:" + x + "px; top:" + w + "px; width:" + v + "px; height:" + z + "px;") + '"></div>', a.separate ? l += u : j += u), a.index2 && a.wrap && (j += "</div>");
                    if (!E) var K = z;
                    if (!F) var J = v
                }
                a.separate && (j = j + "</div>" + (l + "</div>"));
                return {
                    html: j,
                    cols: c,
                    rows: d
                }
            },
            animFrame: function(a) {
                return window.requestAnimationFrame ? window.requestAnimationFrame(a) : window.webkitRequestAnimationFrame ? window.webkitRequestAnimationFrame(a) : window.mozRequestAnimationFrame ? window.mozRequestAnimationFrame(a) : window.oRequestAnimationFrame ? window.oRequestAnimationFrame(a) : window.msRequestAnimationFrame ? window.msRequestAnimationFrame(a) : window.MSRequestAnimationFrame ? window.MSRequestAnimationFrame(a) : window.setTimeout(a, 1E3 / 60)
            }
        };
        if (b.params.responsive) {
            f(window).on("resize", function() {
                b.h.updateDimension()
            });
            if (b.params.touch && b.params.touch.enabled && b.support.touch && "touch" in b.plugins) f(window).on("orientationchange", function() {
                b.h.updateDimension();
                b.slides.eq(b.h.indexes().active).show();
                b.plugins.touch.init(b)
            });
            if (0 < b.params.ambilight && "ambilight" in b.plugins)
                if (b.support.touch) f(window).on("orientationchange", function() {
                    b.plugins.ambilight.init(b)
                });
                else f(window).on("resize", function() {
                    b.plugins.ambilight.init(b)
                })
        }
        b.prepare = function(a) {
            if (a.l || 0 === a.l) b.l[0].style.display = 1 === a.l ? "block" : "none";
            if (a["new"] || 0 === a["new"]) b.slides.eq(b.newSlideIndex)[0].style.display = 1 === a["new"] ? "block" : "none";
            if (a.active || 0 === a.active) b.slides.eq(b.h.indexes().active)[0].style.display = 1 === a.active ? "block" : "none";
            a.p && b.h.setPerspective({
                value: 1200
            });
            if (b.params.responsive) b.l.find("*").css({
                backgroundSize: b.width + "px " + b.height + "px",
                "-webkit-background-size": b.width + "px " + b.height + "px"
            });
            else {
                a = f(b.slides[b.h.indexes().active]);
                var c = f(b.slides[b.newSlideIndex]);
                (a.hasClass("cs3-video-slide") || c.hasClass("cs3-video-slide")) && b.l.find("*").css({
                    backgroundSize: b.width + "px " + b.height + "px",
                    "-webkit-background-size": b.width + "px " + b.height + "px"
                })
            }
        };
        b.run = function() {
            function a() {
                var c = Math.floor(Math.random() * b.effects.length),
                    c = b.effects[c].split("-");
                b.e[c[0]][c[1]](b)
            }
            if (!b.isAnimating) {
                b.h.updateDimension();
                b._plugins.onStart(b);
                if (b.params.callbacks.onTransitionStart) b.params.callbacks.onTransitionStart(b);
                if (!b.e.preventedByPlugin)
                    if (b.isAnimating = !0, b.slides.eq(b.h.indexes().active).hasClass("cs3-video-slide")) {
                        var c = b.slides.eq(b.h.indexes().active);
                        "youtube" == c.find("iframe").data("videoservice") && "undefined" !== typeof c.data("player") && "undefined" !== typeof c.data("player").pauseVideo && c.data("player").pauseVideo();
                        "vimeo" == c.find("iframe").data("videoservice") && window.$f && $f(c.find("iframe")[0]).api("pause");
                        c.find("img").fadeIn(300, function() {
                            a()
                        })
                    } else a()
            }
        };
        b.updateSlides = function() {
            if (!1 !== b.newSlideIndex) {
                b.slides.eq(b.h.indexes().active).removeClass("cs3-active-slide")[0].style.display = "none";
                b.slides.eq(b.newSlideIndex).addClass("cs3-active-slide")[0].style.display = "block";
                b.l.removeAttr("style")[0].innerHTML = "";
                b.l[0].style.display = "none";
                b.isAnimating = b.direction = b.newSlideIndex = !1;
                b._plugins.onEnd(b);
                b.params.autoplay.enabled && b.autoplayStart();
                if (b.params.callbacks.onTransitionEnd) b.params.callbacks.onTransitionEnd(b);
                if (b.slides.eq(b.h.indexes().active).hasClass("cs3-video-slide")) {
                    var a = b.slides.eq(b.h.indexes().active);
                    a.find("img").fadeOut(300);
                    a.find(".cs3-video")
                }
            }
        };
        b.init = function() {
            b.h.updateDimension();
            b._plugins.init(b);
            b.params.autoplay.enabled && b.autoplayStart();
            if (b.params.callbacks.onInit) b.params.callbacks.onInit(b)
        };
        if (!1 != b.params.preloader) {
            b.c.append('<div class="cs3-preloader"><div class="cs3-preloader-in"></div></div>');
            for (var g = 0 <= navigator.userAgent.indexOf("MSIE 6") || 0 <= navigator.userAgent.indexOf("MSIE 7") || 0 <= navigator.userAgent.indexOf("MSIE 8") || 0 <= navigator.userAgent.indexOf("MSIE 9"), l = 0, m = !1, r = b.params.preloadOnlyFirst ? 1 : b.images.length, k = 0; k < r; k++) j = new Image, j.onload = function() {
                l++;
                l == r && !m && (m = !0, b.c.find(".cs3-preloader").remove(), b.slides.eq(0).fadeIn(300), b.init())
            }, j.src = b.images[k];
            g && setTimeout(function() {
                m || (m = !0, b.c.find(".cs3-preloader").remove(), b.slides.eq(0).fadeIn(300), b.init())
            }, 3E3)
        } else b.slides.eq(0).show(), b.init();
        return b
    };
    ChopSlider3.prototype = {
        e: {
            flat: {},
            twoD: {},
            threeD: {},
            canvas: {},
            preventedByPlugin: !1
        },
        plugins: {},
        hasCSS3: function() {
            f("body").append('<div class="cs3-css3Test"></div>');
            var a = f(".cs3-css3Test")[0].style,
                a = void 0 !== a.transition || void 0 !== a.WebkitTransition || void 0 !== a.MozTransition || void 0 !== a.MsTransition || void 0 !== a.OTransition;
            f(".cs3-css3Test").remove();
            return a
        },
        has3D: function() {
            if (this.hasCSS3()) {
                var a = !1,
                    c = !1;
                f("body").append('<div class="cs3-css3Test"></div>');
                var b = f(".cs3-css3Test")[0].style;
                if ("webkitPerspective" in b || "MozPerspective" in b || "OPerspective" in b || "MsPerspective" in b || "perspective" in b) a = !0;
                "webkitPerspective" in b && (c = !0);
                a && c && (c = f('<style media="(transform-3d), (-moz-transform-3d), (-webkit-transform-3d), (-o-transform-3d), (-ms-transform-3d)">div.cs3-css3Test { overflow: hidden }</style>'), f("head").append(c), a = !1, "hidden" == f(".cs3-css3Test").css("overflow") && (a = !0), c.remove());
                f(".cs3-css3Test").remove();
                return a
            }
            return !1
        },
        hasCanvas: function() {
            var a = document.createElement("canvas");
            return !(!a.getContext || !a.getContext("2d"))
        }
    };
    ChopSlider3.prototype.e.flat = {
        fade: function(a) {
            a.prepare({
                l: 0,
                active: 1,
                "new": 1
            });
            a.slides.eq(a.h.indexes().active).fadeOut(300, function() {
                a.updateSlides()
            })
        },
        bricks: function(a) {
            var c = a.h.slice({
                index1: a.newSlideIndex,
                square: !0
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1
            });
            a.l.children().each(function() {
                var b = f(this),
                    d = b.index(),
                    e = b.width(),
                    h = b.height();

                b.css({
                    width: 0,
                    height: 0,
                    opacity: 0
                }).delay(a.h.getDelay({
                    type: "progressive",
                    index: d,
                    delay: 150,
                    grid: c
                })).animate({
                    width: e,
                    height: h,
                    opacity: 1
                }, 300, function() {
                    d == a.h.triggerIndex && a.updateSlides()
                })
            })
        },
        blinds_h: function(a) {
            var c = a.h.slice({
                index1: a.newSlideIndex,
                cols: Math.floor(a.width / 50),
                rows: 1
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1
            });
            a.l.children().each(function() {
                var b = f(this),
                    d = b.index(),
                    e = b.width(),
                    h = b.position().left;
                b.css({
                    width: 0,
                    opacity: 0,
                    left: h + (1 == a.direction ? 30 : -30)
                }).delay(a.h.getDelay({
                    type: "linear",
                    index: d,
                    delay: 50,
                    grid: c,
                    startIndex: 1 === a.direction ? 0 : c.cols
                })).animate({
                    width: e,
                    opacity: 1,
                    left: h
                }, 400, function() {
                    d == a.h.triggerIndex && a.updateSlides()
                })
            })
        },
        blinds_v: function(a) {
            var c = a.h.slice({
                index1: a.newSlideIndex,
                cols: Math.floor(a.width / 50),
                rows: 1
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1
            });
            a.l.css({
                overflow: "hidden"
            });
            a.l.children().each(function() {
                var b = f(this),
                    d = b.index();
                b.css({
                    top: -a.height,
                    opacity: 0
                }).delay(a.h.getDelay({
                    type: "linear",
                    index: d,
                    delay: 50,
                    grid: c,
                    startIndex: 1 === a.direction ? 0 : c.cols
                })).animate({
                    top: 0,
                    opacity: 1
                }, 400, function() {
                    d == a.h.triggerIndex && a.updateSlides()
                })
            })
        },
        zip: function(a) {
            var c = a.h.slice({
                index1: a.newSlideIndex,
                cols: Math.floor(a.width / 50),
                rows: 1
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1
            });
            a.l.css({
                overflow: "hidden"
            });
            a.l.children().each(function() {
                var b = f(this),
                    d = b.index();
                b.css({
                    top: 0 == b.index() % 2 ? -a.height : a.height,
                    opacity: 0
                }).delay(a.h.getDelay({
                    type: "linear",
                    index: d,
                    delay: 50,
                    grid: c,
                    startIndex: 1 === a.direction ? 0 : c.cols
                })).animate({
                    top: 0,
                    opacity: 1
                }, 400, function() {
                    d == a.h.triggerIndex && a.updateSlides()
                })
            })
        }
    };
    ChopSlider3.prototype.e.twoD = {
        smear: function(a) {
            var c = a.h.slice({
                index1: a.h.indexes().active,
                square: !0
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1,
                active: 0,
                "new": 1
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = 1 == a.direction ? 100 : -100,
                        d = 1 == a.direction ? 5 : -5,
                        e = 1 == a.direction ? 0 : c.cols;
                    f(this).csTransform({
                        time: 1E3,
                        transform: "scale(2,1.5) rotate(" + d + "deg) translate3d(" + b + "px,0,0)",
                        delay: a.h.getDelay({
                            type: "horizontal",
                            index: f(this).index(),
                            delay: 50,
                            grid: c,
                            startIndex: e
                        })
                    }).csTransitionEnd(function() {
                        f(this).index() == a.h.triggerIndex && a.updateSlides()
                    }).css({
                        opacity: 0
                    })
                })
            }, 50)
        },
        __bars: function(a, c) {
            c = c || {};
            c.cols = c.cols || 1;
            c.rows = c.rows || 6;
            c.type = c.type || "h";
            var b = a.direction,
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: c.cols,
                    rows: c.rows,
                    wrap: !0
                });
            a.l[0].innerHTML = d.html;
            a.l.find(".cs3-slice").each(function() {
                var d = f(this),
                    h = d.index(),
                    g = "h" == c.type ? 0 == h % 2 ? 0 : 0 == d.parent().index() % 2 ? a.width : -a.width : 0,
                    h = "h" == c.type ? 0 : 0 == h % 2 ? 0 : 0 == d.parent().index() % 2 ? a.height : -a.height,
                    g = g * b,
                    h = h * b;
                d.csTransform({
                    transform: "translate3d(" + g + "px, " + h + "px, 0px)"
                })
            });
            a.l.css({
                overflow: "hidden"
            });
            a.prepare({
                l: 1,
                active: 0,
                "new": 1
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var d = f(this),
                        h = "h" == c.type ? 0 != d.index() % 2 ? a.width : -a.width : 0,
                        h = h * b,
                        g = "h" == c.type ? 0 : 0 != d.index() % 2 ? a.height : -a.height,
                        g = g * b;
                    d.csTransform({
                        transform: "translate3d(" + h + "px, " + g + "px, 0px)",
                        time: 1E3,
                        delay: 0,
                        ease: "cubic-bezier(1,0,0.8,0.2)"
                    }).csTransitionEnd(function() {
                        d.index() == c.cols - 1 && a.updateSlides()
                    })
                })
            }, 50)
        },
        slide_h: function(a) {
            a.e.twoD.__bars(a, {
                type: "h",
                cols: 1,
                rows: 1
            })
        },
        zip_h: function(a) {
            a.e.twoD.__bars(a, {
                type: "h",
                cols: 1,
                rows: 6
            })
        },
        slide_v: function(a) {
            a.e.twoD.__bars(a, {
                type: "v",
                cols: 1,
                rows: 1
            })
        },
        zip_v: function(a) {
            a.e.twoD.__bars(a, {
                type: "v",
                cols: 10,
                rows: 1
            })
        },
        gravity: function(a, c) {
            c = c || {};
            c.cols = c.cols || 10;
            c.rows = c.rows || 10;
            c.type = c.type || "v";
            var b = a.h.slice({
                index1: a.h.indexes().active,
                cols: c.cols,
                rows: c.rows,
                square: !0
            });
            a.l[0].innerHTML = b.html;
            a.prepare({
                l: 1,
                active: 0,
                "new": 1
            });
            a.l.children().each(function() {
                var c = f(this);
                setTimeout(function() {
                    c.csTransform({
                        delay: a.h.getDelay({
                            type: "progressive",
                            index: c.index(),
                            delay: 220,
                            grid: b,
                            startIndex: 0
                        }),
                        time: 800,
                        transform: "scaleY(1) scaleX(1) translate3d(0, -1500px,0)",
                        ease: "ease-in"
                    }).csTransitionEnd(function() {
                        c.index() == a.h.triggerIndex && a.updateSlides()
                    })
                }, 50)
            })
        },
        bulb: function(a) {
            var c = a.h.slice({
                index1: a.h.indexes().active,
                index2: a.newSlideIndex,
                separate: !0,
                square: !0
            });
            a.l[0].innerHTML = c.html;
            var b = c.cols,
                d = c.rows,
                e = f(".cs3-slices-block:eq(0)", a.l),
                h = f(".cs3-slices-block:eq(1)", a.l);
            e.children().csTransform({
                time: 800
            });
            h.children().each(function() {
                var a = 10 * Math.random(),
                    c = f(this).index(),
                    e = Math.floor(c / b),
                    c = c - b * Math.floor(c / b),
                    c = -10 * c - -10 * (b - c),
                    e = -20 * e - -20 * (d - e);
                f(this).csTransform({
                    time: 1200,
                    transform: "scale(0) rotate(" + a + "deg) translate3d(" + c + "px," + e + "px,0px)"
                })
            });
            a.prepare({
                l: 1,
                active: 0
            });
            setTimeout(function() {
                e.children().each(function() {
                    var b = f(this),
                        d = b.index();
                    b.csTransform({
                        transform: " scale(0) translate3d(0,0,0px)",
                        time: 600,
                        delay: a.h.getDelay({
                            index: d,
                            delay: 80,
                            grid: c,
                            type: "progressive"
                        }),
                        ease: "cubic-bezier(1, -1, 0, 0.1)"
                    })
                });
                h.children().each(function() {
                    f(this).csTransform({
                        transform: "scale(1) rotate(0deg) translate3d(0,0,0)",
                        time: 800,
                        delay: 600 + a.h.getDelay({
                            index: f(this).index(),
                            delay: 80,
                            grid: c,
                            type: "progressive"
                        }),
                        ease: "cubic-bezier(0, 1, 0, 1.3)"
                    }).csTransitionEnd(function() {
                        f(this).index() == a.h.triggerIndex && a.updateSlides()
                    })
                })
            }, 50)
        },
        morpher: function(a) {
            for (var c = Math.min(a.width, a.height), b = a.width > a.height ? "h" : "v", d = "", e = a.h.indexes().active, h = c, g = 0; 50 < h; h -= 20, g++) var k = "h" == b ? {
                    left: a.width - h - 10 * g,
                    top: c - h - 10 * g
                } : {
                    left: c - h - 10 * g,
                    top: a.height - h - 10 * g
                },
                j = "background-image :url(" + a.images[e] + "); background-position: -" + k.left + "px -" + k.top + "px; ",
                l = "background-image :url(" + a.images[a.newSlideIndex] + "); background-position: -" + 10 * g + "px -" + k.top + "px; ",
                d = d + ('<div class="cs3-slices-block" style="width:' + h + "px; height:" + h + "px; left:" + k.left + "px; top:" + k.top + 'px">'),
                d = d + ('<div class="cs3-slice" style="' + j + " width:" + h + "px; height:" + h + 'px; ; border-radius:50px"></div>'),
                d = d + ('<div class="cs3-slice" style="' + l + " width:" + h + "px; height:" + h + 'px; opacity:0; ; border-radius:50px"></div>'),
                d = d + "</div>";
            a.l[0].innerHTML = '<div class="cs3-dummy"></div><div class="cs3-dummy">' + d + "</div>";
            a.l.children().eq(0).css({
                width: a.width,
                height: a.height,
                opacity: 0,
                backgroundImage: "url(" + a.images[a.newSlideIndex] + ")",
                position: "absolute"
            });
            a.l.find(".cs3-slices-block").csTransform({
                transform: "rotate(0deg) translate3d(0px,0,0)"
            });
            a.prepare({
                l: 1,
                active: 1
            });
            setTimeout(function() {
                a.l.find(".cs3-slices-block").each(function() {
                    var b = f(this),
                        d = b.index(),
                        e = parseInt(b.css("left"), 10),
                        h = parseInt(b.css("top"), 10),
                        k = 50 * (g - d - 1);
                    b.csTransform({
                        delay: k,
                        transform: "rotate(-360deg) translate3d(30px,0,0)",
                        time: 2E3,
                        ease: "ease-in-out"
                    }).css({
                        left: e - (a.width - c) - 30,
                        top: h - (a.height - c)
                    });
                    b.children().eq(0).csTransform({
                        time: 500,
                        delay: k + 1500,
                        ease: "ease-in-out"
                    }).css({
                        opacity: 0
                    });
                    b.children().eq(1).csTransform({
                        time: 1E3,
                        delay: k + 1E3,
                        ease: "ease-in-out"
                    }).css({
                        opacity: 1
                    });
                    0 == d && a.l.children().eq(0).csTransform({
                        time: 2E3,
                        delay: k,
                        ease: "ease-in-out"
                    }).css({
                        opacity: 1
                    }).csTransitionEnd(function() {
                        a.updateSlides()
                    })
                })
            }, 50)
        },
        reveal: function(a) {
            var c = a.h.slice({
                index1: a.h.indexes().active,
                cols: 1,
                rows: 2
            });
            a.l[0].innerHTML = c.html;
            a.l.css({
                overflow: "hidden"
            });
            a.l[0].innerHTML += '<div style="background-image:url(' + a.images[a.newSlideIndex] + "); width:" + a.width + "px; height:" + a.height + 'px; position:absolute; z-index:0; left:0; top:0"></div>';
            a.prepare({
                l: 1,
                active: 0,
                "new": 0
            });
            var b = a.l.children().eq(0).css({
                    position: "absolute",
                    zIndex: 10
                }),
                d = a.l.children().eq(1).css({
                    position: "absolute",
                    zIndex: 10
                }),
                e = a.l.children().eq(2).csTransform({
                    transform: "scale(0.8) translate3d(" + (200 * Math.random() - 100) + "px,0,0) rotate(" + (10 * Math.random() - 5) + "deg)"
                });
            setTimeout(function() {
                b.css({
                    opacity: 1
                }).csTransform({
                    ease: "ease-in",
                    transform: "scale(1.2) translate3d(0,-" + a.height + "px,0) rotate(" + (30 * Math.random() - 10) + "deg)",
                    time: 900
                });
                d.css({
                    opacity: 1
                }).csTransform({
                    ease: "ease-in",
                    transform: "scale(1.2) translate3d(0," + a.height + "px,0) rotate(" + (30 * Math.random() - 10) + "deg)",
                    time: 900
                });
                e.csTransform({
                    transform: "scale(1) translate3d(0,0,0) rotate(0deg)",
                    time: 900
                }).csTransitionEnd(function() {
                    a.updateSlides()
                })
            }, 1E3 / 30)
        }
    };
    ChopSlider3.prototype.e.threeD = {
        turn: function(a) {
            var c = a.direction,
                b = a.h.slice({
                    index1: a.h.indexes().active,
                    cols: 2,
                    rows: 1
                });
            a.l[0].innerHTML = b.html;
            var d = a.l.append('<div class="cs3-dummy"></div>').find(".cs3-dummy");
            1 === c ? (a.l.children().eq(1).appendTo(d), d.children().clone().appendTo(d), d.children().eq(1).css({
                backgroundImage: "url(" + a.images[a.newSlideIndex] + ")",
                backgroundPosition: "0px 0px"
            }).csTransform({
                transform: "rotateY(-180deg) translate3d(0,0,2px)"
            })) : (a.l.children().eq(0).appendTo(d), d.children().clone().appendTo(d), d.children().eq(1).css({
                backgroundImage: "url(" + a.images[a.newSlideIndex] + ")",
                backgroundPosition: a.l.children().eq(0).css("background-position")
            }).csTransform({
                transform: "rotateY(-180deg) translate3d(0,0,2px)"
            }));
            a.l.find(".cs3-slice:eq(0)").clone().insertAfter(a.l.children().eq(0)).addClass("cs3-fade-black").csTransform({
                time: 500,
                delay: 200
            });
            a.prepare({
                l: 1,
                "new": 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.find(".cs3-fade-black").css({
                    opacity: 0.3
                });
                d.csTransform({
                    transform: 1 === c ? "rotateY(-179.9deg)" : "rotateY(179.9deg)",
                    time: 700
                }).csTransitionEnd(function() {
                    a.updateSlides()
                })
            }, 50)
        },
        _flip: function(a, c) {
            c = c || {};
            c.cols = c.cols || 1;
            c.rows = c.rows || 6;
            c.type = c.type || "h";
            var b = {
                    newFace: "back",
                    newFaceRotate: 1 == a.direction ? "h" == c.type ? "rotateY(180deg)" : "rotateX(180deg)" : "h" == c.type ? "rotateY(-180deg)" : "rotateX(-180deg)"
                },
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: c.cols,
                    rows: c.rows,
                    wrap: !0,
                    make3d: b
                });
            a.l[0].innerHTML = d.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            var e = "h" == c.type ? c.rows - 1 : 0;
            setTimeout(function() {
                a.l.children().each(function() {
                    var d = f(this),
                        g = d.index();
                    d.csTransform({
                        transform: b.newFaceRotate,
                        time: 1E3,
                        delay: "h" == c.type ? 50 * g : 50 * (c.cols - g),
                        ease: "cubic-bezier(1, 0 , 0.8, 1.2)"
                    }).csTransitionEnd(function() {
                        d.index() == e && a.updateSlides()
                    })
                })
            }, 50)
        },
        flip_h_single: function(a) {
            a.e.threeD._flip(a, {
                cols: 1,
                rows: 1,
                type: "h"
            })
        },
        flip_h_multi: function(a) {
            a.e.threeD._flip(a, {
                cols: 1,
                rows: 6,
                type: "h"
            })
        },
        flip_v_single: function(a) {
            a.e.threeD._flip(a, {
                cols: 1,
                rows: 1,
                type: "v"
            })
        },
        flip_v_multi: function(a) {
            a.e.threeD._flip(a, {
                cols: 10,
                rows: 1,
                type: "v"
            })
        },
        flip_random: function(a) {
            var c = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    square: !0,
                    wrap: !0,
                    make3d: {
                        newFace: "back",
                        newFaceRotate: "rotateY(180deg)"
                    }
                }),
                b = c.cols,
                d = c.rows;
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            for (var e = [], h = 0, c = 0; c < b * d; c++) {
                var g = Math.round(500 * Math.random());
                e.push(g);
                h = Math.max(h, g)
            }
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        c = b.index(),
                        d = 0 == c % 2 ? 180 : 0,
                        g = 0 == c % 2 ? 0 : 180;
                    b.find(".cs3-back-face").csTransform({
                        transform: "rotateX(" + g + "deg) rotateY(" + d + "deg)"
                    });
                    b.csTransform({
                        transform: "rotateX(" + g + "deg) rotateY(" + d + "deg)",
                        time: 1E3,
                        delay: e[c]
                    }).csTransitionEnd(function() {
                        e[c] == h && a.updateSlides()
                    })
                })
            }, 50)
        },
        _blocks_v: function(a, c) {
            var b = a.direction,
                d = c.cols,
                e = c.depth,
                h = {
                    newFace: 1 === b ? "top" : "bottom",
                    depth: e
                };
            c.newFace && (h.newFace = c.newFace, h.newFaceRotate = c.newFaceRotate);
            var g = a.h.slice({
                index1: a.h.indexes().active,
                index2: a.newSlideIndex,
                cols: d,
                rows: 1,
                wrap: !0,
                make3d: h
            });
            a.l[0].innerHTML = g.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var g = f(this),
                        j = g.index(),
                        j = c.delay * (d - j),
                        l = 1 === b ? -c.rotate : c.rotate,
                        m = 1 === b ? e / 2 : -e / 2,
                        r = e / 2;
                    "back" == h.newFace && (m = 0, r = e);
                    g.csTransform({
                        transform: "rotateX(" + l + "deg) translate3d(0," + m + "px," + r + "px)",
                        time: c.time,
                        delay: j,
                        ease: c.ease
                    }).csTransitionEnd(function() {
                        0 == g.index() && a.updateSlides()
                    })
                })
            }, 50)
        },
        blocks_v_1: function(a) {
            a.e.threeD._blocks_v(a, {
                cols: 6,
                depth: a.height,
                delay: 170,
                time: 500,
                ease: "ease-in-out",
                rotate: 90
            })
        },
        blocks_v_2: function(a) {
            var c = a.direction,
                b = Math.floor(a.width / 50),
                d = a.height,
                e = {
                    newFace: 1 == c ? "top" : "bottom",
                    depth: d,
                    newFaceRotate: "rotateX(180deg)"
                },
                e = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: b,
                    rows: 1,
                    wrap: !0,
                    make3d: e
                });
            a.l[0].innerHTML = e.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            var h = 1 == c ? 0 : e.cols - 1;
            setTimeout(function() {
                a.l.children().each(function() {
                    var e = f(this),
                        k = e.index(),
                        j = 1 === c ? -90 : 90,
                        l = 1 === c ? d / 2 : -d / 2;
                    e.csTransform({
                        transform: "translate3d(0,0px,-200px)",
                        time: 500,
                        delay: 1 === c ? 50 * (b - k) : 50 * k,
                        ease: "ease-in-out"
                    }).csTransitionEnd(function() {
                        e.csTransform({
                            transform: "rotateX(" + j + "deg) translate3d(0," + l + "px," + d / 2 + "px)",
                            delay: 0
                        }).csTransitionEnd(function() {
                            e.index() == h && a.updateSlides()
                        })
                    })
                })
            }, 50)
        },
        blocks_v_3: function(a) {
            a.e.threeD._blocks_v(a, {
                cols: 2 * Math.floor(a.width / 100),
                depth: 20,
                delay: 70,
                time: 800,
                ease: "cubic-bezier(1, 0 , 0.8, 1)",
                rotate: 180,
                newFace: "back",
                newFaceRotate: "rotateX(180deg)"
            })
        },
        blocks_v_4: function(a) {
            var c = 3 * Math.floor(a.width / 100),
                b = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: c,
                    rows: 1,
                    wrap: !0,
                    make3d: {
                        newFace: "back",
                        newFaceRotate: "rotateX(180deg)",
                        depth: 10
                    }
                });
            a.l[0].innerHTML = b.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        e = b.index();
                    b.csTransform({
                        transform: "rotateX(30deg) translateZ(10px)",
                        time: 800,
                        delay: 70 * (c - e),
                        ease: "ease-out",
                        origin: "50% 0%"
                    }).csTransitionEnd(function() {
                        setTimeout(function() {
                            b.csTransform({
                                transform: "rotateX(-180deg) translateZ(10px)",
                                time: 800,
                                delay: 0,
                                ease: "cubic-bezier(1, 0 , 0.8, 1)",
                                origin: "50% 50%"
                            }).csTransitionEnd(function() {
                                0 == f(this).index() && a.updateSlides()
                            })
                        }, 50)
                    })
                })
            }, 50)
        },
        blocks_v_5: function(a) {
            var c = a.direction,
                b = Math.floor(a.width / 50),
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: b,
                    rows: 1,
                    wrap: !0,
                    make3d: {
                        newFace: "back",
                        newFaceRotate: "rotateX(180deg)",
                        depth: 10
                    }
                });
            a.l[0].innerHTML = d.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            var e = 1 == c ? 0 : d.cols - 1;
            setTimeout(function() {
                a.l.children().each(function() {
                    var d = f(this),
                        g = d.index();
                    d.csTransform({
                        transform: "rotateX(-120deg) translateZ(10px)",
                        time: 600,
                        delay: 50 * (1 == c ? b - g : g),
                        ease: "ease-in-out",
                        origin: "50% 60%"
                    }).csTransitionEnd(function() {
                        setTimeout(function() {
                            d.csTransform({
                                transform: "rotateX(180deg) translateZ(10px)",
                                time: 1200,
                                delay: 0,
                                ease: "ease-in-out",
                                origin: "50% 50%"
                            }).csTransitionEnd(function() {
                                f(this).index() == e && a.updateSlides()
                            })
                        }, 50)
                    })
                })
            }, 50)
        },
        blocks_v_6: function(a) {
            var c = a.direction,
                b = Math.floor(a.width / 50),
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: b,
                    rows: 1,
                    wrap: !0,
                    make3d: {
                        newFace: "back",
                        newFaceRotate: "rotateY(180deg)",
                        depth: 5
                    }
                });
            a.l[0].innerHTML = d.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var e = f(this),
                        h = e.index(),
                        g = 1 == c ? -90 : 90;
                    e.csTransform({
                        transform: "rotateX(" + -(-g + 2 * g * h / (b - 1)) + "deg) rotateY(-90deg) translate3d(50px,0,5px)",
                        time: 900,
                        delay: a.h.getDelay({
                            type: "linear",
                            delay: 30,
                            index: h,
                            grid: d,
                            startIndex: "middle"
                        }),
                        ease: "ease-in-out",
                        origin: "50% 60%"
                    }).csTransitionEnd(function() {
                        setTimeout(function() {
                            e.csTransform({
                                transform: "rotateX(0deg) rotateY(180deg) translate3d(0,0,5px)",
                                time: 900,
                                delay: 0,
                                ease: "ease-in-out",
                                origin: "50% 50%"
                            }).csTransitionEnd(function() {
                                f(this).index() == a.h.triggerIndex && a.updateSlides()
                            })
                        }, 50)
                    })
                })
            }, 50)
        },
        blocks_v_7: function(a) {
            var c = a.direction,
                b = Math.floor(a.height / 30),
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: 2,
                    rows: b,
                    wrap: !0,
                    make3d: {
                        newFace: "back",
                        newFaceRotate: "rotateX(180deg)",
                        depth: 5
                    }
                });
            a.l[0].innerHTML = d.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        h = b.index(),
                        g = 0 == h % 2 ? -50 : 50;
                    1 != c && (g = -g);
                    b.csTransform({
                        transform: "rotateX(0deg) rotateY(" + g + "deg) translate3d(0px,0,5px)",
                        time: 1E3,
                        delay: a.h.getDelay({
                            type: "vertical",
                            delay: 60,
                            index: h,
                            grid: d,
                            startIndex: 0
                        }),
                        ease: "ease-in-out",
                        origin: "50% 60%"
                    }).csTransitionEnd(function() {
                        setTimeout(function() {
                            b.csTransform({
                                transform: "rotateX(180deg) rotateY(0deg) translate3d(0,0,5px)",
                                time: 1E3,
                                delay: 0,
                                ease: "ease-in-out",
                                origin: "50% 50%"
                            }).csTransitionEnd(function() {
                                h == a.h.triggerIndex && a.updateSlides()
                            })
                        }, 50)
                    })
                })
            }, 50)
        },
        _blocks_h: function(a, c) {
            var b = a.direction,
                d = c.cols,
                e = c.rows,
                h = c.depth,
                g = {
                    newFace: 1 === b ? "right" : "left",
                    depth: h
                },
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: d,
                    rows: e,
                    wrap: !0,
                    make3d: g
                });
            a.l[0].innerHTML = d.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var d = f(this),
                        g = d.index();
                    d.csTransform({
                        transform: "rotateY(" + (1 === b ? -c.rotate : c.rotate) + "deg) translate3d(" + (1 === b ? -h / 2 : h / 2) + "px, 0, " + h / 2 + "px)",
                        time: c.time,
                        delay: c.delay * (e - g),
                        ease: "ease-in-out"
                    }).csTransitionEnd(function() {
                        0 == d.index() && a.updateSlides()
                    });
                    c.loader1 && c.loader2 && a.l.csTransform({
                        transform: c.loader1,
                        time: c.time / 2
                    }).csTransitionEnd(function() {
                        f(this).csTransform({
                            transform: c.loader2
                        })
                    })
                })
            }, 50)
        },
        blocks_h_1: function(a) {
            a.e.threeD._blocks_h(a, {
                cols: 1,
                rows: 5,
                depth: a.width,
                delay: 170,
                time: 500,
                ease: "ease-in-out",
                rotate: 90
            })
        },
        blocks_h_2: function(a) {
            a.e.threeD._blocks_h(a, {
                cols: 1,
                rows: Math.floor(a.height / 20),
                depth: a.width,
                delay: 30,
                time: 900,
                ease: "ease-in-out",
                rotate: 90
            })
        },
        cube: function(a) {
            a.e.threeD._blocks_h(a, {
                cols: 1,
                rows: 1,
                depth: a.width,
                delay: 0,
                time: 600,
                ease: "ease-in-out",
                rotate: 90,
                loader1: "scale(0.9)",
                loader2: "scale(1)"
            })
        },
        blocks_h_3: function(a) {
            var c = a.direction,
                b = 4 * Math.floor(a.height / 100),
                d = a.h.slice({
                    index1: a.h.indexes().active,
                    index2: a.newSlideIndex,
                    cols: 1,
                    rows: b,
                    wrap: !0,
                    make3d: {
                        newFace: "back",
                        newFaceRotate: "rotateY(180deg)",
                        depth: 20
                    }
                });
            a.l[0].innerHTML = d.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var d = f(this),
                        h = d.index(),
                        g = 1 === c ? -180 : 180;
                    d.csTransform({
                        transform: "rotateY(" + (1 === c ? 30 : -30) + "deg) translate3d(" + (1 === c ? 100 : -100) + "px, 0, 0px)",
                        time: 800,
                        delay: 70 * (b - h),
                        ease: "ease-out"
                    }).csTransitionEnd(function() {
                        d.csTransform({
                            transform: "rotateY(" + g + "deg) translate3d(0px, 0, 20px)",
                            delay: 0,
                            ease: "cubic-bezier(1, 0 , 0.8, 1)"
                        }).csTransitionEnd(function() {
                            0 == d.index() && a.updateSlides()
                        })
                    })
                })
            }, 50)
        },
        _paper: function(a, c) {
            c = c || {};
            c.cols = c.cols || 1;
            c.rows = c.rows || 6;
            var b = a.h.slice({
                index1: a.h.indexes().active,
                index2: a.newSlideIndex,
                cols: c.cols,
                rows: c.rows,
                wrap: !0,
                make3d: {
                    newFace: "back",
                    newFaceRotate: "rotateY(0deg) rotateZ(0deg)"
                }
            });
            a.l[0].innerHTML = b.html;
            a.l.find(".cs3-back-face").each(function() {
                var b = "h" == c.type ? a.width : a.height,
                    b = 0 == f(this).parent().index() % 2 ? b : -b,
                    b = "h" == c.type ? "translate3d(" + b + "px,0,0)" : "translate3d(0," + b + "px,0)";
                f(this).csTransform({
                    transform: b
                })
            });
            a.l.find(".cs3-slice").css({
                overflow: "hidden"
            });
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            var d = "h" == c.type ? c.rows - 1 : c.cols - 1;
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        h = b.index(),
                        g = 0 == h % 2,
                        k = g ? 35 : -35,
                        j = parseInt(b[0].style.height),
                        l = parseInt(b[0].style.width),
                        m = "h" == c.type ? Math.sin(55 * (2 * Math.PI / 360)) * j : Math.sin(55 * (2 * Math.PI / 360)) * l,
                        r = parseInt(b[0].style.top),
                        q = parseInt(b[0].style.left);
                    f(this).attr("data-cs3top", r);
                    f(this).attr("data-cs3left", q);
                    g || (b.append('<div class="cs3-fade-black"></div>'), b.find(".cs3-fade-black").csTransform({
                        time: 500,
                        ease: "cubic-bezier(1, 0 , 0.8, 1)"
                    }));
                    setTimeout(function() {
                        b.find(".cs3-fade-black").css({
                            opacity: 0.3
                        })
                    }, 50);
                    g = "h" == c.type ? "rotateX(" + k + "deg)" : "rotateY(" + k + "deg)";
                    j = "h" == c.type ? {
                        top: r * m / j + (a.height - Math.sin(55 * (2 * Math.PI / 360)) * a.height) / 2
                    } : {
                        left: q * m / l + (a.width - Math.sin(55 * (2 * Math.PI / 360)) * a.width) / 2
                    };
                    b.csTransform({
                        transform: g + " translate3d(0,0px,0px)",
                        time: 500,
                        delay: 0,
                        ease: "cubic-bezier(1, 0 , 0.8, 1)"
                    }).css(j).csTransitionEnd(function() {
                        b.find(".cs3-back-face").each(function() {
                            f(this).csTransform({
                                transform: "translate3d(0,0,0)",
                                time: 500,
                                ease: "ease-in-out",
                                delay: 50 * h
                            }).csTransitionEnd(function() {
                                b.index() == d && a.l.children().each(function() {
                                    var b = f(this);
                                    setTimeout(function() {
                                        b.css({
                                            top: 1 * b.attr("data-cs3top"),
                                            left: 1 * b.attr("data-cs3left")
                                        }).csTransform({
                                            transform: "rotateX(0deg) translate3d(0,0px,0px)"
                                        }).csTransitionEnd(function() {
                                            a.updateSlides()
                                        }).find(".cs3-fade-black").css({
                                            opacity: 0
                                        })
                                    }, 50)
                                })
                            })
                        })
                    })
                })
            }, 50)
        },
        paper_h: function(a) {
            a.e.threeD._paper(a, {
                cols: 1,
                rows: 6,
                type: "h"
            })
        },
        paper_v: function(a) {
            a.e.threeD._paper(a, {
                cols: 10,
                rows: 1,
                type: "v"
            })
        },
        galaxy: function(a) {
            var c = a.h.slice({
                index1: a.h.indexes().active,
                index2: a.newSlideIndex,
                square: !0,
                make3d: {
                    newFace: "back",
                    depth: 20
                }
            });
            a.l[0].innerHTML = c.html;
            a.l.csTransform({
                transform: "rotateY(0deg)",
                time: 0,
                delay: 0
            });
            a.prepare({
                l: 1,
                active: 0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        c = f(".cs3-back-face", b),
                        e = c.css("background-position").split(" ")[0],
                        h = c.css("background-position").split(" ")[1],
                        e = a.width - parseInt(e) + c.width();
                    c.css({
                        backgroundPosition: e + "px " + h
                    });
                    var g = b.index(),
                        c = 60 * Math.random() - 30,
                        e = 60 * Math.random() - 30,
                        h = 60 * Math.random() - 30,
                        k = 50 * Math.random(),
                        j = -60 * Math.random(),
                        l = 400 * Math.random() - 200,
                        m = 0.5 * Math.random() + 0.5;
                    b.csTransform({
                        transform: " rotateX(" + c + "deg) rotateY(" + e + "deg) rotateZ(" + h + "deg) scale(" + m + ") translate3d(" + k + "px," + j + "px," + l + "px)",
                        time: 400,
                        delay: 0,
                        ease: "linear"
                    }).csTransitionEnd(function() {
                        setTimeout(function() {
                            b.csTransform({
                                transform: " rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) translate3d(0px,0px,0px)",
                                time: 400,
                                delay: 1E3,
                                ease: "linear"
                            }).csTransitionEnd(function() {
                                0 == g && a.updateSlides()
                            })
                        }, 50)
                    })
                });
                a.l.csTransform({
                    transform: "rotateY(180deg)",
                    time: 1800,
                    delay: 0,
                    ease: "linear"
                })
            }, 50)
        },
        explosion: function(a) {
            var c = a.h.slice({
                    index1: a.h.indexes().active,
                    square: !0
                }),
                b = a.h.slice({
                    index1: a.newSlideIndex,
                    square: !0
                });
            a.l[0].innerHTML = '<div class="cs3-dummy">' + c.html + '</div><div class="cs3-dummy">' + b.html + "</div>";
            a.l.csTransform({
                transform: "rotateY(0deg)",
                time: 0,
                delay: 0
            });
            var d = a.l.children().eq(0),
                e = a.l.children().eq(1);
            e.children().each(function() {
                Math.random();
                Math.random();
                Math.random();
                f(this).csTransform({
                    transform: "rotateX(180deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) translate3d(0,0px, 0px)"
                })
            });
            a.prepare({
                l: 1,
                active: 0,
                p: !0,
                "new": 0
            });
            setTimeout(function() {
                d.children().each(function() {
                    var a = f(this);
                    a.index();
                    var b = 20 * Math.random() - 10,
                        c = 60 * Math.random() - 30,
                        d = 60 * Math.random() - 30;
                    a.csTransform({
                        time: 1E3,
                        delay: 500 * Math.random(),
                        transform: "rotateX(" + b + "deg) rotateY(" + c + "deg) rotateZ(" + d + "deg) scale3d(0.5, 0.5, 0.5) translate3d(0,-50px, 300px)",
                        ease: "cubic-bezier(1, -0.5 , 0, 1)"
                    }).css({
                        opacity: 0
                    })
                })
            }, 50);
            setTimeout(function() {
                e.children().each(function() {
                    f(this).csTransform({
                        delay: 500 * Math.random(),
                        time: 1500,
                        transform: "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1,1,1) translate3d(0,0px,0px)",
                        ease: "cubic-bezier(1, 1 , 0, 1.2)"
                    })
                });
                setTimeout(function() {
                    a.updateSlides()
                }, 2E3)
            }, 1E3)
        },
        polaroid: function(a) {
            a.l.html('<div><div class="cs3pl-image"></div><div class="cs3pl-left"></div><div class="cs3pl-top"></div><div class="cs3pl-right"></div><div class="cs3pl-bottom"></div></div><div class="cs3pl-light"></div>');
            a.l.find("div").css({
                position: "absolute"
            });
            a.l.children().eq(0).css({
                left: 0,
                top: 0,
                width: a.width - 2,
                height: a.height - 2,
                border: "1px solid #333",
                display: "none"
            }).find(".cs3pl-left").css({
                width: 20,
                height: a.height - 2,
                left: 0,
                top: 0,
                background: "#fff"
            }).end().find(".cs3pl-right").css({
                width: 20,
                height: a.height - 2,
                right: 0,
                top: 0,
                background: "#fff"
            }).end().find(".cs3pl-top").css({
                width: a.width - 2,
                height: 20,
                left: 0,
                top: 0,
                background: "#fff"
            }).end().find(".cs3pl-bottom").css({
                width: a.width - 2,
                height: 50,
                left: 0,
                bottom: 0,
                background: "#fff"
            }).end().find(".cs3pl-image").css({
                width: a.width - 2,
                height: a.height - 2,
                left: 0,
                top: 0,
                backgroundImage: "url(" + a.images[a.h.indexes().active] + ")",
                boxShadow: "0px 0px 0px 21px #000 inset"
            }).csTransform({
                transform: "translate3d(0,0,-1px)"
            }).end();
            var c = a.l.find(".cs3pl-light").css({
                left: 0,
                top: 0,
                opacity: 0,
                width: a.width,
                height: a.height,
                background: "#fff"
            });
            a.prepare({
                active: 1,
                "new": 1,
                l: 1,
                p: !0
            });
            c.fadeTo(200, 1, function() {
                a.prepare({
                    active: 0
                });
                a.l.children().eq(0).show().csTransform({
                    transform: "rotateZ(30deg) rotateX(50deg) rotateY(-90deg) scale(0) translate3d(500px,0,800px)",
                    time: 1800,
                    ease: "ease-in"
                }).csTransitionEnd(function() {
                    a.updateSlides()
                })
            }).fadeTo(200, 0)
        },
        bricks3d: function(a) {
            var c = a.h.slice({
                index1: a.h.indexes().active,
                index2: a.newSlideIndex,
                square: !0,
                wrap: !0,
                make3d: {
                    newFace: "back",
                    newFaceRotate: "rotateX(180deg)",
                    depth: 30
                }
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        d = b.index(),
                        e = a.h.getDelay({
                            type: "progressive",
                            grid: {
                                cols: c.cols,
                                rows: c.rows
                            },
                            index: d,
                            delay: 300
                        });
                    b.csTransform({
                        transform: "rotateX(0deg) translate3d(0,-50px,-100px)",
                        time: 300,
                        delay: e,
                        ease: "ease-in"
                    }).csTransitionEnd(function() {
                        b.csTransform({
                            transform: "rotateX(180deg) translate3d(0,0,30px)",
                            time: 600,
                            delay: 0,
                            ease: "ease-out"
                        }).csTransitionEnd(function() {
                            d == a.h.triggerIndex && a.updateSlides()
                        })
                    })
                })
            }, 50)
        },
        tiles3d: function(a) {
            var c = a.h.slice({
                index1: a.h.indexes().active,
                index2: a.newSlideIndex,
                square: !0,
                squareSize: 50,
                wrap: !0,
                make3d: {
                    newFace: "back",
                    newFaceRotate: "rotateY(180deg)",
                    depth: 5
                }
            });
            a.l[0].innerHTML = c.html;
            a.prepare({
                l: 1,
                active: 0,
                p: !0
            });
            setTimeout(function() {
                a.l.children().each(function() {
                    var b = f(this),
                        d = b.index(),
                        e = a.h.getDelay({
                            type: "progressive",
                            grid: {
                                cols: c.cols,
                                rows: c.rows
                            },
                            index: d,
                            delay: 100,
                            startIndex: 0
                        });
                    b.csTransform({
                        transform: "rotateY(540deg) translate3d(-" + b.width() + "px,0px,5px)",
                        time: 1500,
                        delay: e,
                        ease: "ease",
                        origin: "0px 0"
                    }).csTransitionEnd(function() {
                        d == a.h.triggerIndex && a.updateSlides()
                    })
                })
            }, 50)
        },
        panels_h: function(a) {
            var c;
            c = "" + ('<div class="cs3-slice" style="width:' + a.width + "px; height:" + a.height + "px; background-image:url(" + a.images[a.h.indexes().active] + '); left:0; top:0"></div>');
            c += '<div class="cs3-slice" style="z-index:30; width:' + a.width + "px; height:" + a.height + "px; background-image:url(" + a.images[a.newSlideIndex] + '); left:0; top:0"></div>';
            a.h.setPerspective({
                value: 1200,
                origin: "50% 50%"
            }, a.l);
            a.l.css({
                overflow: "hidden"
            });
            a.l[0].innerHTML = c;
            var b = "translate3d(" + a.width + "px,0,-" + a.width / 2 + "px) rotateY(-90deg)",
                d = "translate3d(-" + a.width + "px,0,-" + a.width / 2 + "px) rotateY(90deg)",
                e = a.l.children().eq(0),
                h = a.l.children().eq(1).csTransform({
                    time: 0,
                    transform: 1 == a.direction ? b : d
                });
            a.prepare({
                l: 1,
                active: 0,
                p: !1
            });
            setTimeout(function() {
                h.csTransform({
                    time: 1200,
                    ease: "cubic-bezier(1, 0 , 0, 1)",
                    transform: "translate3d(0,0,0) rotateY(0deg)"
                });
                e.csTransform({
                    time: 1200,
                    ease: "cubic-bezier(1, 0 , 0, 1)",
                    transform: 1 == a.direction ? d : b
                }).csTransitionEnd(function() {
                    a.updateSlides()
                })
            }, 50)
        },
        panels_v: function(a) {
            var c;
            c = "" + ('<div class="cs3-slice" style="width:' + a.width + "px; height:" + a.height + "px; background-image:url(" + a.images[a.h.indexes().active] + '); left:0; top:0"></div>');
            c += '<div class="cs3-slice" style="z-index:30; width:' + a.width + "px; height:" + a.height + "px; background-image:url(" + a.images[a.newSlideIndex] + '); left:0; top:0"></div>';
            a.h.setPerspective({
                value: 1200,
                origin: "50% 50%"
            }, a.l);
            a.l.css({
                overflow: "hidden"
            });
            a.l[0].innerHTML = c;
            var b = "translate3d(0px," + a.height + "px,-" + a.height / 2 + "px) rotateX(90deg)",
                d = "translate3d(0px,-" + a.height + "px,-" + a.height / 2 + "px) rotateX(-90deg)",
                e = a.l.children().eq(0),
                h = a.l.children().eq(1).csTransform({
                    time: 0,
                    transform: 1 == a.direction ? b : d
                });
            a.prepare({
                l: 1,
                active: 0,
                p: !1
            });
            setTimeout(function() {
                h.csTransform({
                    time: 1200,
                    ease: "cubic-bezier(1, 0 , 0, 1)",
                    transform: "translate3d(0,0,0) rotateX(0deg)"
                });
                e.csTransform({
                    time: 1200,
                    ease: "cubic-bezier(1, 0 , 0, 1)",
                    transform: 1 == a.direction ? d : b
                }).csTransitionEnd(function() {
                    a.updateSlides()
                })
            }, 50)
        }
    };
    ChopSlider3.prototype.e.canvas = {
        burn: function(a) {
            function c() {
                h -= 0.05;
                e.globalAlpha = h;
                var d;
                for (d = -10; 10 >= d; d += 5) e.drawImage(b, d, 0);
                var j = e.getImageData(0, 0, b.width, b.height),
                    l = j.data;
                d = 0;
                for (var m = l.length; d < m; d += 4) l[d] = 255 < l[d] + g * l[d] ? 255 : l[d] + g * l[d], l[d + 1] = 255 < l[d + 1] + g * l[d + 1] ? 255 : l[d + 1] + g * l[d + 1], l[d + 2] = 255 < l[d + 2] + g * l[d + 2] ? 255 : l[d + 2] + g * l[d + 2];
                g += 0.005;
                e.putImageData(j, 0, 0);
                0.25 > g ? a.h.animFrame(c) : f(b).fadeOut(1500, function() {
                    a.updateSlides()
                })
            }
            a.l.html("<canvas></canvas>");
            var b = a.l.children()[0],
                d = new Image;
            d.src = a.images[a.h.indexes().active];
            b.width = a.width;
            b.height = a.height;
            var e = b.getContext("2d");
            e.drawImage(d, 0, 0, a.width, a.height);
            var h = 1,
                g = 0;
            a.h.animFrame(c);
            e.globalAlpha = 1;
            a.prepare({
                l: 1,
                active: 0,
                "new": 1
            })
        },
        melt: function(a) {
            function c() {
                j += 3;
                for (var f = 0; f < l; f++) e.drawImage(d, 370 * f, j - 50 * f);
                for (var g = e.getImageData(0, 0, b.width, b.height), q = g.data, s = k.getImageData(0, 0, h.width, h.height).data, f = 0, n = q.length; f < n; f += 4) q[f] = s[f], q[f + 1] = s[f + 1], q[f + 2] = s[f + 2];
                e.putImageData(g, 0, 0);
                j < a.height + 50 * (l - 1) ? a.h.animFrame(c) : a.updateSlides()
            }
            a.l.html('<canvas></canvas><canvas style="display:none"></canvas>');
            var b = a.l.children()[0],
                d = new Image;
            d.src = a.path + "assets/melt.png";
            b.width = a.width;
            b.height = a.height;
            var e = b.getContext("2d"),
                h = a.l.children()[1],
                f = new Image;
            f.src = a.images[a.newSlideIndex];
            h.width = a.width;
            h.height = a.height;
            var k = h.getContext("2d");
            k.drawImage(f, 0, 0, a.width, a.height);
            var j = -200,
                l = Math.ceil(a.width / 370);
            a.h.animFrame(c);
            a.prepare({
                l: 1,
                active: 1,
                "new": 0
            })
        },
        roll: function(a) {
            function c() {
                m = 1 == b ? m - 20 : m + 20;
                for (var k = 0; k < l; k++) f.drawImage(e, m, 30 * k);
                for (var q = f.getImageData(0, 0, d.width, d.height), s = q.data, n = j.getImageData(0, 0, g.width, g.height).data, k = 0, p = s.length; k < p; k += 4) s[k] = n[k], s[k + 1] = n[k + 1], s[k + 2] = n[k + 2];
                f.putImageData(q, 0, 0); - 140 > m && 1 == b ? a.updateSlides() : m > a.width + 140 && 1 != b ? a.updateSlides() : a.h.animFrame(c)
            }
            var b = a.direction;
            a.l.html('<canvas></canvas><canvas style="display:none"></canvas>');
            var d = a.l.children()[0],
                e = new Image;
            e.src = a.path + "assets/scanner.png";
            d.width = a.width;
            d.height = a.height;
            var f = d.getContext("2d"),
                g = a.l.children()[1],
                k = new Image;
            k.src = a.images[a.newSlideIndex];
            g.width = a.width;
            g.height = a.height;
            var j = g.getContext("2d");
            j.drawImage(k, 0, 0, a.width, a.height);
            var l = Math.ceil(a.height / 30),
                m = 1 === b ? a.width : -140;
            a.h.animFrame(c);
            a.prepare({
                l: 1,
                active: 1,
                "new": 0
            })
        },
        puzzles: function(a) {
            function c() {
                a.l.delay(400).fadeOut(400, function() {
                    a.updateSlides()
                });
                a.slides.eq(a.h.indexes().active).fadeOut(400)
            }
            var b = new Image;
            b.src = a.images[a.newSlideIndex];
            var d = Math.ceil(a.width / 64),
                e = Math.ceil(a.height / 64),
                h = new Image;
            h.onload = function() {
                var g = document.createElement("canvas");
                g.width = 108;
                g.height = 108;
                g = g.getContext("2d");
                g.drawImage(h, 0, 0);
                for (var k = 0; k < e * d; k++) {
                    var j = document.createElement("canvas");
                    j.width = 108;
                    j.height = 108;
                    var l = j.getContext("2d"),
                        m = Math.floor(k / d),
                        r = k - m * d;
                    l.drawImage(b, 64 * -r + 22, 64 * -m + 22, a.width, a.height);
                    for (var q = g.getImageData(0, 0, 108, 108), s = q.data, n = l.getImageData(0, 0, 108, 108).data, p = 0; p < n.length; p += 4) {
                        var t = p / 4,
                            A = Math.floor(t / 108),
                            t = t - 108 * A,
                            C = !1;
                        22 > t && 0 == r && (C = !0);
                        r == d - 1 && 64 * r + t >= a.width + 22 && (C = !0);
                        m == e - 1 && 64 * m + A >= a.height + 22 && (C = !0);
                        m == e - 2 && 64 * m + A >= a.height + 22 && (C = !0);
                        0 == m && 22 > A && (C = !0);
                        C ? s[p + 3] = 0 : (s[p] = n[p], s[p + 1] = n[p + 1], s[p + 2] = n[p + 2])
                    }
                    l.putImageData(q, 0, 0);
                    l.shadowColor = "rgb(0,0,0)";
                    l.shadowOffsetX = 0;
                    l.shadowOffsetY = 0;
                    l.shadowBlur = 1;
                    l.drawImage(j, 0, 0);
                    j.style.left = 64 * r - 22 + "px";
                    j.style.top = 64 * m - 22 + "px";
                    a.l.append(j)
                }
                a.prepare({
                    l: 1,
                    active: 1,
                    "new": 1
                });
                a.l.children().csTransform({
                    transform: "scale(" + (a.support.css3 ? 1.8 : 1) + ")  translate3d(0px," + (a.support.css3 ? -100 : 0) + "px,0)"
                }).css({
                    opacity: 0,
                    marginTop: a.support.css3 ? 0 : -100
                });
                setTimeout(function() {
                    for (var b = [], h = 0, g = 0; g < d * e; g++) {
                        var j = Math.round(1500 * Math.random());
                        b.push(j);
                        h = Math.max(h, j)
                    }
                    a.l.find("canvas").each(function() {
                        var d = f(this),
                            e = d.index();
                        a.support.css3 ? d.csTransform({
                            transform: "scale(1) translate3d(0,0,0)",
                            time: 500,
                            delay: b[e],
                            ease: "cubic-bezier(1, 0 , 0.8, 1.2)"
                        }).css({
                            opacity: 1
                        }).csTransitionEnd(function() {
                            b[e] == h && c()
                        }) : d.delay(b[e]).animate({
                            marginTop: 0,
                            opacity: 1
                        }, 500, function() {
                            b[e] == h && c()
                        })
                    })
                }, 50)
            };
            h.src = a.path + "assets/puzzle.png"
        },
        diamonds: function(a) {
            function c() {
                e.clearRect(0, 0, b.width, b.height);
                r--;
                q--;
                m += 2;
                for (var g = (100 - m) / 2, n = 0; n < j - r; n++)
                    for (var p = 0; p < l - q; p++) e.drawImage(d, g + 50 * n - 25, g + 50 * p - 25, m, m);
                for (var g = e.getImageData(0, 0, b.width, b.height), n = g.data, p = k.getImageData(0, 0, f.width, f.height).data, t = 0, A = n.length; t < A; t += 4) n[t] = p[t], n[t + 1] = p[t + 1], n[t + 2] = p[t + 2];
                e.putImageData(g, 0, 0);
                100 > m ? a.h.animFrame(c) : a.updateSlides()
            }
            a.l.html('<canvas></canvas><canvas style="display:none"></canvas>');
            var b = a.l.children()[0],
                d = new Image;
            d.src = a.path + "assets/diamond.png";
            b.width = a.width;
            b.height = a.height;
            var e = b.getContext("2d"),
                f = a.l.children()[1],
                g = new Image;
            g.src = a.images[a.newSlideIndex];
            f.width = a.width;
            f.height = a.height;
            var k = f.getContext("2d");
            k.drawImage(g, 0, 0, a.width, a.height);
            var j = Math.floor(a.width / 50),
                l = Math.floor(a.height / 50),
                m = 0,
                r = j,
                q = l;
            a.h.animFrame(c);
            a.prepare({
                l: 1,
                active: 1,
                "new": 0
            })
        },
        circles: function(a) {
            function c() {
                e.clearRect(0, 0, b.width, b.height);
                m += 2;
                for (var g = (108 - m) / 2, q = 0; q < j; q++)
                    for (var s = 0; s < l; s++) e.drawImage(d, g + 50 * q - 25, g + 50 * s - 25, m, m);
                for (var g = e.getImageData(0, 0, b.width, b.height), q = g.data, s = k.getImageData(0, 0, f.width, f.height).data, n = 0, p = q.length; n < p; n += 4) q[n] = s[n], q[n + 1] = s[n + 1], q[n + 2] = s[n + 2];
                e.putImageData(g, 0, 0);
                100 > m ? a.h.animFrame(c) : a.updateSlides()
            }
            a.l.html('<canvas></canvas><canvas style="display:none"></canvas>');
            var b = a.l.children()[0],
                d = new Image;
            d.src = a.path + "assets/circle.png";
            b.width = a.width;
            b.height = a.height;
            var e = b.getContext("2d"),
                f = a.l.children()[1],
                g = new Image;
            g.src = a.images[a.newSlideIndex];
            f.width = a.width;
            f.height = a.height;
            var k = f.getContext("2d");
            k.drawImage(g, 0, 0, a.width, a.height);
            var j = Math.floor(a.width / 50),
                l = Math.floor(a.height / 50),
                m = 0;
            a.h.animFrame(c);
            a.prepare({
                l: 1,
                active: 1,
                "new": 0
            })
        },
        brush: function(a) {
            function c() {
                e.drawImage(d, j, l);
                for (var g = e.getImageData(0, 0, b.width, b.height), s = g.data, n = k.getImageData(0, 0, h.width, h.height).data, p = 0, t = s.length; p < t; p += 4) s[p] = n[p], s[p + 1] = n[p + 1], s[p + 2] = n[p + 2];
                e.putImageData(g, 0, 0);
                1 === m && j >= a.width - 190 && (m = -1, r = !0); - 1 === m && -10 > j && (m = 1, r = !0);
                j = 1 === m ? j + 40 : j - 40;
                !0 === r && (l += 50, r = !1);
                l < b.height - 50 ? a.h.animFrame(c) : f(h).fadeIn(500, function() {
                    a.updateSlides()
                })
            }
            a.l.html('<canvas></canvas><canvas style="display:none"></canvas>');
            var b = a.l.children()[0],
                d = new Image;
            d.src = a.path + "assets/brush.png";
            b.width = a.width;
            b.height = a.height;
            var e = b.getContext("2d"),
                h = a.l.children()[1],
                g = new Image;
            g.src = a.images[a.newSlideIndex];
            h.width = a.width;
            h.height = a.height;
            var k = h.getContext("2d");
            k.drawImage(g, 0, 0, a.width, a.height);
            var j = 0,
                l = -15,
                m = 1,
                r = !1;
            a.h.animFrame(c);
            a.prepare({
                l: 1,
                active: 1,
                "new": 0
            })
        },
        typewriter: function(a) {
            function c() {
                var c = document.createElement("canvas");
                c.width = a.width;
                c.height = a.height;
                c = c.getContext("2d");
                c.drawImage(l, 0, 0, a.width, a.height);
                var e = c.getImageData(0, 0, a.width, a.height).data,
                    c = document.createElement("canvas");
                c.width = a.width;
                c.height = a.height;
                c = c.getContext("2d");
                c.drawImage(m, 0, 0, a.width, a.height);
                var g = c.getImageData(0, 0, a.width, a.height).data;
                a.l.children().each(function() {
                    var c = f(this),
                        h = c.children("canvas").eq(0)[0],
                        j = c.children("canvas").eq(1)[0];
                    h.style.display = "none";
                    j.style.opacity = "0";
                    j.style.zIndex = "10";
                    var k = b[Math.floor(Math.random() * b.length)];
                    h.width = d;
                    h.height = d;
                    h = h.getContext("2d");
                    h.fillStyle = "#000";
                    h.font = "bold " + d + 'px "Arial"';
                    h.textBaseline = "top";
                    h.fillText(k, 0, 0);
                    var l = h.getImageData(0, 0, d, d),
                        m = l.data;
                    j.width = d;
                    j.height = d;
                    j = j.getContext("2d");
                    j.fillStyle = "#000";
                    j.font = "bold " + d + 'px "Arial"';
                    j.textBaseline = "top";
                    j.fillText(k, 0, 0);
                    for (var k = j.getImageData(0, 0, d, d), r = k.data, n = parseInt(c.attr("data-col"), 10) * d, c = parseInt(c.attr("data-row"), 10) * d, p = 0, E = m.length; p < E; p += 4) {
                        var v = p / 4,
                            z = Math.floor(v / d),
                            v = 4 * ((z + c) * a.width + (v - z * d + n));
                        0 === m[p] && (m[p] = e[v] / 1.2, m[p + 1] = e[v + 1] / 1.2, m[p + 2] = e[v + 2] / 1.2, r[p] = g[v], r[p + 1] = g[v + 1], r[p + 2] = g[v + 2])
                    }
                    h.putImageData(l, 0, 0);
                    j.putImageData(k, 0, 0)
                });
                var h = a.slides.eq(a.h.indexes().active);
                a.slides.eq(a.newSlideIndex);
                a.prepare({
                    l: 1,
                    active: 1,
                    "new": 1
                });
                a.l.find("canvas:first-child");
                var c = a.l.find("canvas:last-child"),
                    j = a.l.children().length - 1;
                c.each(function() {
                    var b = f(this),
                        c = b.parent().index();
                    a.support.css3 ? (f(this).csTransform({
                        transform: "scale(2)",
                        time: 40,
                        delay: 40 * c,
                        ease: "ease-in"
                    }), setTimeout(function() {
                        b.css({
                            opacity: 1
                        }).csTransform({
                            transform: "scale(1)"
                        }).csTransitionEnd(function() {
                            b.prev().css({
                                display: "block"
                            });
                            setTimeout(function() {
                                b.prev().csTransform({
                                    transform: "scale(1.5)",
                                    time: 200
                                }).css({
                                    opacity: 0
                                }).csTransitionEnd(function() {
                                    c == j && h.fadeOut(500, function() {
                                        a.updateSlides()
                                    })
                                })
                            }, 50)
                        })
                    }, 50)) : b.delay(40 * c).fadeTo(40, 1, function() {
                        c == j && h.fadeOut(500, function() {
                            a.updateSlides()
                        })
                    })
                })
            }
            a.l.html('<canvas style="font-family:Georgia"></canvas>');
            a.l.css({
                overflow: "hidden"
            });
            var b = a.user.typewriterLetters ? a.user.typewriterLetters.split(" ") : "123456789?!ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
                d = 60,
                e = Math.ceil(a.width / d),
                h = Math.ceil(a.height / d);
            html = "";
            for (var g = 0; g < h; g++)
                for (var k = 0; k < e; k++) html += '<div data-col="' + k + '" data-row="' + g + '" style="width:50px; height:50px; position:absolute; left:' + d * k + "px; top:" + d * g + 'px;"><canvas></canvas><canvas></canvas></div>';
            var j = 0,
                l = new Image,
                m = new Image;
            l.onload = function() {
                j++;
                2 == j && c()
            };
            m.onload = function() {
                j++;
                2 == j && c()
            };
            l.src = a.images[a.h.indexes().active];
            m.src = a.images[a.newSlideIndex];
            a.l[0].innerHTML = html
        },
        lines: function(a) {
            function c() {
                k.style.opacity = 10 * ((10 * a.height - j) / a.height) / 100;
                d.fillStyle = "#000";
                d.beginPath();
                d.moveTo(0, 0);
                d.bezierCurveTo(0 + j, j, a.width, a.height - j, a.width - j / 2, a.height);
                d.moveTo(a.width, 0);
                d.bezierCurveTo(a.width - j, 0 + j, 0, a.height - j, 0 + j / 2, a.height);
                d.lineWidth = 0.5;
                d.stroke();
                for (var f = d.getImageData(0, 0, b.width, b.height), g = f.data, r = h.getImageData(0, 0, e.width, e.height).data, q = 0, s = g.length; q < s; q += 4) g[q] = r[q], g[q + 1] = r[q + 1], g[q + 2] = r[q + 2];
                d.putImageData(f, 0, 0);
                j += 15;
                j < 10 * a.height ? a.h.animFrame(c) : (a.updateSlides(), k.style.opacity = 1)
            }
            a.l.html("<canvas></canvas>");
            var b = a.l.children()[0];
            b.width = a.width;
            b.height = a.height;
            var d = b.getContext("2d");
            f(b).csTransform({
                transform: "translate3d(0,0,0)"
            });
            var e = document.createElement("canvas");
            e.width = a.width;
            e.height = a.height;
            var h = e.getContext("2d"),
                g = new Image;
            g.src = a.images[a.newSlideIndex];
            h.drawImage(g, 0, 0, a.width, a.height);
            var k = a.slides.eq(a.h.indexes().active)[0];
            a.prepare({
                l: 1,
                active: 1,
                "new": 1
            });
            var j = 0;
            a.h.animFrame(c)
        },
        aquarium: function(a) {
            function c() {
                d.clearRect(0, 0, a.width, a.height);
                d.beginPath();
                d.moveTo(0, j);
                for (var f = 0; f < a.width; f++) {
                    var g = 20 * Math.sin((f + j) * Math.PI / 180);
                    d.lineTo(f, g + j)
                }
                d.lineTo(a.width, a.height);
                d.lineTo(0, a.height);
                d.lineTo(0, j);
                d.fill();
                for (var g = d.getImageData(0, 0, b.width, b.height), q = g.data, s = h.getImageData(0, 0, e.width, e.height).data, f = 0, n = q.length; f < n; f += 4) q[f] = s[f], q[f + 1] = s[f + 1], q[f + 2] = s[f + 2];
                d.putImageData(g, 0, 0);
                0 == j && 1 === l && a.prepare({
                    l: 1,
                    active: 0,
                    "new": 0
                });
                j = 1 === l ? j + 5 : j - 5;
                j >= a.height && (l = -1, h.drawImage(k, 0, 0, a.width, a.height));
                0 < j && a.h.animFrame(c);
                0 == j && a.updateSlides()
            }
            a.l.html("<canvas></canvas>");
            var b = a.l.children()[0];
            b.width = a.width;
            b.height = a.height;
            var d = b.getContext("2d");
            f(b).csTransform({
                transform: "translate3d(0,0,0)"
            });
            var e = document.createElement("canvas");
            e.width = a.width;
            e.height = a.height;
            var h = e.getContext("2d"),
                g = new Image;
            g.src = a.images[a.h.indexes().active];
            var k = new Image;
            k.src = a.images[a.newSlideIndex];
            h.drawImage(g, 0, 0, a.width, a.height);
            a.slides.eq(a.h.indexes().active);
            var j = 0,
                l = 1;
            a.h.animFrame(c)
        },
        razor: function(a) {
            a.l.html("<div><canvas></canvas><canvas></canvas></div>");
            var c = a.l.find("canvas")[0];
            c.width = a.width;
            c.height = a.height;
            var b = c.getContext("2d"),
                d = a.l.find("canvas")[1];
            d.width = a.width;
            d.height = a.height;
            var e = d.getContext("2d"),
                h = new Image;
            h.src = a.images[a.h.indexes().active];
            var g = document.createElement("canvas");
            g.width = a.width;
            g.height = a.height;
            var k = g.getContext("2d");
            k.drawImage(h, 0, 0, a.width, a.height);
            h = k.getImageData(0, 0, g.width, g.height).data;
            b.fillStyle = "#000";
            b.beginPath();
            b.moveTo(0, 0);
            b.lineTo(a.width / 2 + 100, 0);
            b.lineTo(a.width / 2 - 100, a.height);
            b.lineTo(0, a.height);
            b.fill();
            for (var j = b.getImageData(0, 0, c.width, c.height), l = j.data, g = 0, k = l.length; g < k; g += 4) l[g] = h[g], l[g + 1] = h[g + 1], l[g + 2] = h[g + 2];
            b.putImageData(j, 0, 0);
            e.fillStyle = "#000";
            e.beginPath();
            e.moveTo(a.width / 2 + 100, 0);
            e.lineTo(a.width, 0);
            e.lineTo(a.width, a.height);
            e.lineTo(a.width / 2 - 100, a.height);
            e.fill();
            j = e.getImageData(0, 0, d.width, d.height);
            l = j.data;
            g = 0;
            for (k = l.length; g < k; g += 4) l[g] = h[g], l[g + 1] = h[g + 1], l[g + 2] = h[g + 2];
            e.putImageData(j, 0, 0);
            b.shadowColor = "rgba(0,0,0,0.5)";
            b.shadowBlur = 10;
            b.shadowOffsetX = 5;
            b.shadowOffsetY = -5;
            b.drawImage(c, 0, 0);
            e.shadowColor = "rgba(0,0,0,0.5)";
            e.shadowBlur = 10;
            e.shadowOffsetX = -5;
            e.shadowOffsetY = -5;
            e.drawImage(d, 0, 0);
            a.l.children().css({
                width: a.width,
                height: a.height,
                position: "relative",
                overflow: "hidden"
            });
            a.prepare({
                l: 1,
                active: 0,
                "new": 1
            });
            f(c).animate({
                left: -a.width / 2 - 110
            }, 800);
            f(d).animate({
                left: a.width / 2 + 110
            }, 800, function() {
                a.updateSlides()
            })
        },
        circle_reveal: function(a) {
            function c() {
                q += s;
                b.style.opacity = 2 * q / r;
                g.clearRect(0, 0, a.width, a.height);
                g.beginPath();
                g.arc(a.width / 2, a.height / 2, q, 0, 2 * Math.PI, !1);
                g.fillStyle = "#000";
                g.fill();
                for (var d = g.getImageData(0, 0, b.width, b.height), f = d.data, e = 0, h = j.length; e < h; e += 4) 0 == f[e] && (f[e] = j[e], f[e + 1] = j[e + 1], f[e + 2] = j[e + 2]);
                g.putImageData(d, 0, 0);
                q < r ? a.h.animFrame(c) : a.updateSlides()
            }
            a.l.html("<canvas></canvas><canvas></canvas>");
            var b = a.l.children().eq(0).hide()[0],
                d = new Image;
            d.src = a.images[a.h.indexes().active];
            b.width = a.width;
            b.height = a.height;
            var e = b.getContext("2d");
            e.drawImage(d, 0, 0, a.width, a.height);
            var h = document.createElement("canvas"),
                d = new Image;
            d.src = a.images[a.newSlideIndex];
            h.width = a.width;
            h.height = a.height;
            h = h.getContext("2d");
            h.drawImage(d, 0, 0, a.width, a.height);
            d = a.l.children()[1];
            d.width = a.width;
            d.height = a.height;
            var g = d.getContext("2d");
            a.l.css({
                overflow: "hidden"
            });
            for (var d = e.getImageData(0, 0, b.width, b.height), k = h.getImageData(0, 0, b.width, b.height), h = d.data, j = k.data, k = 0, l = h.length; k < l; k += 4) {
                var m = 0.3 * h[k] + 0.59 * h[k + 1] + 0.11 * h[k + 2];
                h[k] = m;
                h[k + 1] = m;
                h[k + 2] = m
            }
            e.putImageData(d, 0, 0);
            f(b).show().css({
                opacity: 0
            });
            a.prepare({
                l: 1,
                active: 1,
                "new": 0
            });
            var r = Math.max(a.width / 2, a.height / 2) + Math.min(a.width / 2, a.height / 2),
                q = 0,
                s = r / 100;
            a.h.animFrame(c)
        }
    };


    ChopSlider3.prototype.plugins.navigation = {
        init: function(a) {
            var c = a.params.navigation,
                b = !0;
            !1 === a.params.autoplay.disableOnInteraction && (b = !1);
            if (c) {
                var d = f(c.next),
                    e = f(c.prev);
                0 < d.length && d.click(function(c) {
                    c.preventDefault();
                    a.slideNext();
                    a.params.autoplay.enabled && b && a.autoplayStop()
                });
                0 < e.length && e.click(function(c) {
                    c.preventDefault();
                    a.slidePrev();
                    a.params.autoplay.enabled && b && a.autoplayStop()
                });
                c.showOnlyOnHover && (d.hide(), e.hide(), a.c.hover(function() {
                    if (a.isAnimating) return !1;
                    d.fadeIn(300);
                    e.fadeIn(300)
                }, function() {
                    if (a.isAnimating) return !1;
                    d.fadeOut(300);
                    e.fadeOut(300)
                }))
            }
        },
        onStart: function(a) {
            if ((a = a.params.navigation) && (a.hideOnStart || a.showOnlyOnHover)) f(a.next).fadeOut(200), f(a.prev).fadeOut(200)
        },
        onEnd: function(a) {
            if ((a = a.params.navigation) && a.hideOnStart && !a.showOnlyOnHover) f(a.next).fadeIn(200), f(a.prev).fadeIn(200)
        }
    };
    ChopSlider3.prototype.plugins.pagination = {
        init: function(a) {
            if (a.params.pagination && a.params.pagination.container) {
                var c = a.params.pagination,
                    b = c.container;
                if (0 == f(b).length) return !1;
                for (var d = "", e = 0; e < a.slides.length; e++) d += '<div class="cs3-pagination-switch' + (0 == e ? " cs3-active-switch" : "") + '"></div>';
                f(b)[0].innerHTML = d;
                f(b).find(".cs3-pagination-switch").click(function() {
                    var b = f(this);
                    if (b.hasClass("cs3-active-switch")) return !1;
                    a.params.autoplay.enabled && a.autoplayStop();
                    a.slideTo(b.index())
                });
                c.showOnlyOnHover && (f(b).css({
                    display: "none"
                }), a.c.hover(function() {
                    if (a.isAnimating) return !1;
                    f(b).fadeIn(300)
                }, function() {
                    if (a.isAnimating) return !1;
                    f(b).fadeOut(300)
                }))
            }
        },
        onStart: function(a) {
            var c = a.params.pagination;
            if (c && c.container) {
                var b = c.container;
                if (0 == f(b).length) return !1;
                f(b).find(".cs3-active-switch").removeClass("cs3-active-switch");
                f(b).find(".cs3-pagination-switch:eq(" + a.newSlideIndex + ")").addClass("cs3-active-switch");
                (c.hideOnStart || c.showOnlyOnHover) && f(b).fadeOut(200)
            }
        },
        onEnd: function(a) {
            var c = a.params.pagination;
            if (c && c.container) {
                var b = c.container;
                if (0 == f(b).length) return !1;
                f(b).find(".cs3-active-switch").removeClass("cs3-active-switch");
                f(b).find(".cs3-pagination-switch:eq(" + a.h.indexes().active + ")").addClass("cs3-active-switch");
                c.hideOnStart && !c.showOnlyOnHover && f(b).fadeIn(200)
            }
        }
    };
    f.fn.cs3 = function(a) {
        return new ChopSlider3(f(this), a)
    }
})(jQuery);
