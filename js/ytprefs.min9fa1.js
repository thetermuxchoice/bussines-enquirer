(function(a, b) {
    a._EPYT_ = a._EPYT_ || {
        ajaxurl: "admin-ajax.php",
        security: "",
        gallery_scrolloffset: 100,
        eppathtoscripts: "/wp-content/plugins/youtube-embed-plus/scripts/",
        eppath: "/wp-content/plugins/youtube-embed-plus/",
        epresponsiveselector: ["iframe.__youtube_prefs_widget__"],
        epdovol: true,
        evselector: 'iframe.__youtube_prefs__[src], iframe[src*="youtube.com/embed/"], iframe[src*="youtube-nocookie.com/embed/"]',
        stopMobileBuffer: true,
        ajax_compat: false,
        usingdefault: true,
        ytapi_load: "light",
        pause_others: false,
        facade_mode: false,
        not_live_on_channel: false
    };
    a._EPYT_.touchmoved = false;
    a._EPYT_.apiVideos = a._EPYT_.apiVideos || {};
    if (a.location.toString().indexOf("https://") === 0) {
        a._EPYT_.ajaxurl = a._EPYT_.ajaxurl.replace("http://", "https://")
    }
    a._EPYT_.pageLoaded = false;
    b(a).on("load._EPYT_", function() {
        a._EPYT_.pageLoaded = true
    });
    if (!document.querySelectorAll) {
        document.querySelectorAll = function(d) {
            var f = document,
                e = f.documentElement.firstChild,
                c = f.createElement("STYLE");
            e.appendChild(c);
            f.__qsaels = [];
            c.styleSheet.cssText = d + "{x:expression(document.__qsaels.push(this))}";
            a.scrollBy(0, 0);
            return f.__qsaels
        }
    }
    if (typeof a._EPADashboard_ === "undefined") {
        a._EPADashboard_ = {
            initStarted: false,
            checkCount: 0,
            onPlayerReady: function(h) {
                try {
                    if (typeof _EPYT_.epdovol !== "undefined" && _EPYT_.epdovol) {
                        var e = parseInt(h.target.getIframe().getAttribute("data-vol"));
                        if (!isNaN(e)) {
                            if (e === 0) {
                                h.target.mute()
                            } else {
                                if (h.target.isMuted()) {
                                    h.target.unMute()
                                }
                                h.target.setVolume(e)
                            }
                        }
                    }
                    var d = parseInt(h.target.getIframe().getAttribute("data-epautoplay"));
                    if (!isNaN(d) && d === 1) {
                        h.target.playVideo()
                    }
                } catch (g) {}
                try {
                    var i = h.target.getIframe();
                    var c = i.getAttribute("id");
                    a._EPYT_.apiVideos[c] = h.target;
                    if (a._EPYT_.not_live_on_channel && h.target.getVideoUrl().indexOf("live_stream") > 0) {
                        a._EPADashboard_.doLiveFallback(i)
                    }
                } catch (f) {} finally {
                    b(h.target.getIframe()).css("opacity", 1)
                }
            },
            onPlayerStateChange: function(f) {
                var e = f.target.getIframe();
                if (a._EPYT_.pause_others && f.data === a.YT.PlayerState.PLAYING) {
                    a._EPADashboard_.pauseOthers(f.target)
                }
                if (f.data === a.YT.PlayerState.PLAYING && f.target.ponce !== true && e.src.indexOf("autoplay=1") === -1) {
                    f.target.ponce = true
                }
                if (f.data === a.YT.PlayerState.ENDED && b(e).data("relstop") == "1") {
                    if (typeof f.target.stopVideo === "function") {
                        f.target.stopVideo()
                    } else {
                        var g = b(e).clone(true).off();
                        g.attr("src", a._EPADashboard_.cleanSrc(g.attr("src").replace("autoplay=1", "autoplay=0")));
                        b(e).replaceWith(g);
                        a._EPADashboard_.setupevents(g.attr("id"));
                        e = g.get(0)
                    }
                }
                var c = b(e).closest(".epyt-gallery");
                if (!c.length) {
                    c = b("#" + b(e).data("epytgalleryid"))
                }
                if (c.length) {
                    var d = c.find(".epyt-pagebutton").first().data("autonext") == "1";
                    if (d && f.data === a.YT.PlayerState.ENDED) {
                        var h = c.find(".epyt-current-video");
                        if (!h.length) {
                            h = c.find(".epyt-gallery-thumb").first()
                        }
                        var i = h.find(" ~ .epyt-gallery-thumb").first();
                        if (i.length) {
                            i.trigger("click")
                        } else {
                            c.find('.epyt-pagebutton.epyt-next[data-pagetoken!=""][data-pagetoken]').first().trigger("click")
                        }
                    }
                }
            },
            isMobile: function() {
                return /Mobi|Android/i.test(navigator.userAgent)
            },
            base64DecodeUnicode: function(c) {
                c = c.replace(/\s/g, "");
                return decodeURIComponent(Array.prototype.map.call(atob(c), function(d) {
                    return "%" + ("00" + d.charCodeAt(0).toString(16)).slice(-2)
                }).join(""))
            },
            doLiveFallback: function(g) {
                var h = b(g).closest(".wp-block-embed");
                if (!h.length) {
                    h = b(g).closest(".epyt-live-chat-wrapper")
                }
                if (!h.length) {
                    h = b(g).closest(".epyt-video-wrapper")
                }
                if (h.length) {
                    var f = b("#epyt-live-fallback");
                    if (f.length) {
                        var c = "";
                        try {
                            c = a._EPADashboard_.base64DecodeUnicode(f.get(0).innerHTML)
                        } catch (e) {}
                        if (c) {
                            var d = h.parent();
                            a._EPADashboard_.loadYTAPI();
                            h.replaceWith(c);
                            a._EPADashboard_.apiInit();
                            a._EPADashboard_.pageReady();
                            setTimeout(function() {
                                b(d).fitVidsEP()
                            }, 1)
                        }
                    }
                }
            },
            videoEqual: function(d, c) {
                if (d.getIframe && c.getIframe && d.getIframe().id === c.getIframe().id) {
                    return true
                }
                return false
            },
            pauseOthers: function(e) {
                if (!e) {
                    return
                }
                for (var d in a._EPYT_.apiVideos) {
                    var c = a._EPYT_.apiVideos[d];
                    if (c && typeof c.pauseVideo === "function" && c != e && !_EPADashboard_.videoEqual(c, e) && typeof c.getPlayerState === "function" && [YT.PlayerState.BUFFERING, a.YT.PlayerState.PLAYING].indexOf(c.getPlayerState()) >= 0) {
                        c.pauseVideo()
                    }
                }
            },
            justid: function(c) {
                return new RegExp("[\\?&]v=([^&#]*)").exec(c)[1]
            },
            setupevents: function(e) {
                if (typeof(a.YT) !== "undefined" && a.YT !== null && a.YT.loaded) {
                    var c = document.getElementById(e);
                    if (!c.epytsetupdone) {
                        a._EPADashboard_.log("Setting up YT API events: " + e);
                        c.epytsetupdone = true;
                        var d = {
                            events: {
                                onReady: a._EPADashboard_.onPlayerReady,
                                onStateChange: a._EPADashboard_.onPlayerStateChange
                            },
                            host: (c.src || "").indexOf("nocookie") > 0 ? "https://www.youtube-nocookie.com" : "https://www.youtube.com"
                        };
                        return new a.YT.Player(e, d)
                    }
                }
            },
            apiInit: function() {
                if (typeof(a.YT) !== "undefined") {
                    a._EPADashboard_.initStarted = true;
                    var c = document.querySelectorAll(_EPYT_.evselector);
                    for (var d = 0; d < c.length; d++) {
                        if (!c[d].hasAttribute("id")) {
                            c[d].id = "_dytid_" + Math.round(Math.random() * 8999 + 1000)
                        }
                        a._EPADashboard_.setupevents(c[d].id)
                    }
                }
            },
            log: function(d) {
                try {
                    console.log(d)
                } catch (c) {}
            },
            doubleCheck: function() {
                a._EPADashboard_.checkInterval = setInterval(function() {
                    a._EPADashboard_.checkCount++;
                    if (a._EPADashboard_.checkCount >= 5 || a._EPADashboard_.initStarted) {
                        clearInterval(a._EPADashboard_.checkInterval)
                    } else {
                        a._EPADashboard_.apiInit();
                        a._EPADashboard_.log("YT API init check")
                    }
                }, 1000)
            },
            selectText: function(e) {
                if (document.selection) {
                    var c = document.body.createTextRange();
                    c.moveToElementText(e);
                    c.select()
                } else {
                    if (a.getSelection) {
                        var d = a.getSelection();
                        var c = document.createRange();
                        c.selectNode(e);
                        d.removeAllRanges();
                        d.addRange(c)
                    }
                }
            },
            setVidSrc: function(c, d) {
                if (c.is(".epyt-facade")) {
                    c.attr("data-facadesrc", a._EPADashboard_.cleanSrc(d));
                    c.trigger("click")
                } else {
                    c.attr("src", a._EPADashboard_.cleanSrc(d));
                    c.get(0).epytsetupdone = false;
                    a._EPADashboard_.setupevents(c.attr("id"))
                }
            },
            cleanSrc: function(d) {
                var c = d.replace("enablejsapi=1?enablejsapi=1", "enablejsapi=1");
                return c
            },
            loadYTAPI: function() {
                if (typeof a.YT === "undefined") {
                    if (a._EPYT_.ytapi_load !== "never" && (a._EPYT_.ytapi_load === "always" || b('iframe[src*="youtube.com/embed/"], iframe[data-src*="youtube.com/embed/"], .__youtube_prefs__').length)) {
                        var c = document.createElement("script");
                        c.src = "https://www.youtube.com/iframe_api";
                        c.type = "text/javascript";
                        document.getElementsByTagName("head")[0].appendChild(c)
                    }
                } else {
                    if (a.YT.loaded) {
                        if (a._EPYT_.pageLoaded) {
                            a._EPADashboard_.apiInit();
                            a._EPADashboard_.log("YT API available")
                        } else {
                            b(a).on("load._EPYT_", function() {
                                a._EPADashboard_.apiInit();
                                a._EPADashboard_.log("YT API available 2")
                            })
                        }
                    }
                }
            },
            pageReady: function() {
                if (a._EPYT_.not_live_on_channel && a._EPYT_.ytapi_load !== "never") {
                    b(".epyt-live-channel").css("opacity", 0);
                    setTimeout(function() {
                        b(".epyt-live-channel").css("opacity", 1)
                    }, 4000)
                }
                b(".epyt-gallery").each(function() {
                    var f = b(this);
                    if (!f.data("epytevents") || !b("body").hasClass("block-editor-page")) {
                        f.data("epytevents", "1");
                        var e = b(this).find("iframe, div.__youtube_prefs_gdpr__, div.epyt-facade").first();
                        var c = e.data("src") || e.data("facadesrc") || e.attr("src");
                        if (!c) {
                            c = e.data("ep-src")
                        }
                        var d = b(this).find(".epyt-gallery-list .epyt-gallery-thumb").first().data("videoid");
                        if (typeof(c) !== "undefined") {
                            c = c.replace(d, "GALLERYVIDEOID");
                            f.data("ep-gallerysrc", c)
                        } else {
                            if (e.hasClass("__youtube_prefs_gdpr__")) {
                                f.data("ep-gallerysrc", "")
                            }
                        }
                        f.on("click touchend", ".epyt-gallery-list .epyt-gallery-thumb", function(k) {
                            e = f.find("iframe, div.__youtube_prefs_gdpr__, div.epyt-facade").first();
                            if (a._EPYT_.touchmoved) {
                                return
                            }
                            if (!b(this).hasClass("epyt-current-video")) {
                                f.find(".epyt-gallery-list .epyt-gallery-thumb").removeClass("epyt-current-video");
                                b(this).addClass("epyt-current-video");
                                var g = b(this).data("videoid");
                                f.data("currvid", g);
                                var l = f.data("ep-gallerysrc").replace("GALLERYVIDEOID", g);
                                var j = f.find(".epyt-pagebutton").first().data("thumbplay");
                                if (j !== "0" && j !== 0) {
                                    if (l.indexOf("autoplay") > 0) {
                                        l = l.replace("autoplay=0", "autoplay=1")
                                    } else {
                                        l += "&autoplay=1"
                                    }
                                    e.addClass("epyt-thumbplay")
                                }
                                var h = Math.max(b("body").scrollTop(), b("html").scrollTop());
                                var i = e.offset().top - parseInt(_EPYT_.gallery_scrolloffset);
                                if (h > i) {
                                    b("html, body").animate({
                                        scrollTop: i
                                    }, 500, function() {
                                        a._EPADashboard_.setVidSrc(e, l)
                                    })
                                } else {
                                    a._EPADashboard_.setVidSrc(e, l)
                                }
                            }
                        }).on("touchmove", function(g) {
                            a._EPYT_.touchmoved = true
                        }).on("touchstart", function() {
                            a._EPYT_.touchmoved = false
                        }).on("keydown", ".epyt-gallery-list .epyt-gallery-thumb, .epyt-pagebutton", function(h) {
                            var g = h.which;
                            if ((g === 13) || (g === 32)) {
                                h.preventDefault();
                                b(this).trigger("click")
                            }
                        });
                        f.on("mouseenter", ".epyt-gallery-list .epyt-gallery-thumb", function() {
                            b(this).addClass("hover")
                        });
                        f.on("mouseleave", ".epyt-gallery-list .epyt-gallery-thumb", function() {
                            b(this).removeClass("hover")
                        });
                        f.on("click touchend", ".epyt-pagebutton", function(k) {
                            if (a._EPYT_.touchmoved) {
                                return
                            }
                            if (!f.find(".epyt-gallery-list").hasClass("epyt-loading")) {
                                f.find(".epyt-gallery-list").addClass("epyt-loading");
                                var g = typeof(k.originalEvent) !== "undefined";
                                var j = {
                                    action: "my_embedplus_gallery_page",
                                    security: _EPYT_.security,
                                    options: {
                                        playlistId: b(this).data("playlistid"),
                                        pageToken: b(this).data("pagetoken"),
                                        pageSize: b(this).data("pagesize"),
                                        columns: b(this).data("epcolumns"),
                                        showTitle: b(this).data("showtitle"),
                                        showPaging: b(this).data("showpaging"),
                                        autonext: b(this).data("autonext"),
                                        thumbplay: b(this).data("thumbplay")
                                    }
                                };
                                var h = b(this).hasClass("epyt-next");
                                var i = parseInt(f.data("currpage") + "");
                                i += h ? 1 : -1;
                                f.data("currpage", i);
                                console.log('holaaaaaaa2'+_EPYT_);
                                b.post(_EPYT_.ajaxurl, j, function(l) {
                                    f.find(".epyt-gallery-list").html(l);
                                    f.find(".epyt-current").each(function() {
                                        b(this).text(f.data("currpage"))
                                    });
                                    f.find('.epyt-gallery-thumb[data-videoid="' + f.data("currvid") + '"]').addClass("epyt-current-video");
                                    if (f.find(".epyt-pagebutton").first().data("autonext") == "1" && !g) {
                                        f.find(".epyt-gallery-thumb").first().trigger("click")
                                    }
                                
                                }).fail(function() {
                                    alert("Sorry, there was an error loading the next page.")
                                }).always(function() {
                                    f.find(".epyt-gallery-list").removeClass("epyt-loading");
                                    if (f.find(".epyt-pagebutton").first().data("autonext") != "1") {
                                        var l = Math.max(b("body").scrollTop(), b("html").scrollTop());
                                        var m = f.find(".epyt-gallery-list").offset().top - parseInt(_EPYT_.gallery_scrolloffset);
                                        if (l > m) {
                                            b("html, body").animate({
                                                scrollTop: m
                                            }, 500)
                                        }
                                    }
                                })
                            }
                        }).on("touchmove", function(g) {
                            a._EPYT_.touchmoved = true
                        }).on("touchstart", function() {
                            a._EPYT_.touchmoved = false
                        })
                    }
                });
                b(".__youtube_prefs_gdpr__.epyt-is-override").each(function() {
                    b(this).parent(".wp-block-embed__wrapper").addClass("epyt-is-override__wrapper")
                });
                b("button.__youtube_prefs_gdpr__").on("click", function(c) {
                    c.preventDefault();
                    if (b.cookie) {
                        b.cookie("ytprefs_gdpr_consent", "1", {
                            expires: 30,
                            path: "/"
                        });
                        a.top.location.reload()
                    }
                });
                b("img.epyt-facade-poster").one("load", function() {
                    if (this.naturalHeight < 200) {
                        var c = b(this).attr("src");
                        if (c) {
                            b(this).attr("src", c.replace("maxresdefault", "hqdefault"))
                        }
                    }
                }).on("error", function() {
                    var c = b(this).attr("src");
                    if (c) {
                        b(this).attr("src", c.replace("maxresdefault", "hqdefault"))
                    }
                }).each(function() {
                    if (this.complete) {
                        b(this).trigger("load")
                    }
                });
                b(".epyt-facade-play").each(function() {
                    if (!b(this).find("svg").length) {
                        b(this).append('<svg data-no-lazy="1" height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>')
                    }
                });
                b(".epyt-facade-poster[data-facadeoembed]").each(function() {
                    var c = b(this);
                    var d = "https://www.youtube.com/" + c.data("facadeoembed");
                    b.get("https://youtube.com/oembed", {
                        url: d,
                        format: "json"
                    }, function(e) {
                        c.attr("src", e.thumbnail_url.replace("hqdefault", "maxresdefault"))
                    }, "json").fail(function() {}).always(function() {})
                });
                b(document).on("click", ".epyt-facade", function(j) {
                    var h = b(this);
                    var d = h.attr("data-facadesrc");
                    d = a._EPADashboard_.cleanSrc(d);
                    var f = document.createElement("iframe");
                    for (var c = 0; c < this.attributes.length; c++) {
                        var g = this.attributes[c];
                        if (["allow", "class", "height", "id", "width"].indexOf(g.name.toLowerCase()) >= 0 || g.name.toLowerCase().indexOf("data-") == 0) {
                            b(f).attr(g.name, g.value)
                        }
                    }
                    b(f).removeClass("epyt-facade");
                    b(f).attr("allowfullscreen", "").attr("title", h.find("img").attr("alt")).attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
                    a._EPADashboard_.loadYTAPI();
                    h.replaceWith(f);
                    b(f).attr("src", d);
                    a._EPADashboard_.setupevents(b(f).attr("id"));
                    setTimeout(function() {
                        b(b(f).parent()).fitVidsEP()
                    }, 1)
                })
            }
        }
    }
    a.onYouTubeIframeAPIReady = typeof a.onYouTubeIframeAPIReady !== "undefined" ? a.onYouTubeIframeAPIReady : function() {
        if (a._EPYT_.pageLoaded) {
            a._EPADashboard_.apiInit();
            a._EPADashboard_.log("YT API ready")
        } else {
            b(a).on("load._EPYT_", function() {
                a._EPADashboard_.apiInit();
                a._EPADashboard_.log("YT API ready 2")
            })
        }
    };
    if (!a._EPYT_.facade_mode) {
        a._EPADashboard_.loadYTAPI()
    }
    if (a._EPYT_.pageLoaded) {
        a._EPADashboard_.doubleCheck()
    } else {
        b(a).on("load._EPYT_", function() {
            a._EPADashboard_.doubleCheck()
        })
    }
    b(document).ready(function() {
        a._EPADashboard_.pageReady();
        if (!a._EPYT_.facade_mode) {
            a._EPADashboard_.loadYTAPI()
        }
        if (a._EPYT_.ajax_compat) {
            b(a).on("load._EPYT_", function() {
                b(document).ajaxSuccess(function(d, f, c) {
                    if (f && f.responseText && (f.responseText.indexOf("<iframe ") !== -1 || f.responseText.indexOf("enablejsapi") !== -1)) {
                        a._EPADashboard_.loadYTAPI();
                        a._EPADashboard_.apiInit();
                        a._EPADashboard_.log("YT API AJAX");
                        a._EPADashboard_.pageReady()
                    }
                })
            })
        }
    })
})(window, jQuery);
