//browser compatibility 
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        var s = this;
        while (s.charAt(0) === ' ') {
            s = s.substr(1, s.length);
        }
        while (s.charAt(s.length - 1) === ' ') {
            s = s.substr(0, s.length - 1);
        }
        return s;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(subString) {
        var s = this;
        if (s.indexOf(subString) === 0) {
            return true;
        } else {
            return false;
        }
    };
}

var basicUtil = {};
basicUtil.version = '201304261156';

basicUtil.string = {
    /**
     * Get formated string of a int. e.g. 10,000(string) for 10000(int)
     * @param {String/int} num num to be formated
     * @returns {string} string of num in comma fomat
     */
    getNumStringWithComma: function(num) {
        var numS = num + '';
        var formatedString = '';
        for (var i = 0; i < numS.length; i = i + 3) {
            formatedString = numS.substring(numS.length - i - 3, numS.length - i) + ',' + formatedString;
        }
        formatedString = formatedString.substring(0, formatedString.length - 1);
        return formatedString;
    }
};

basicUtil.cookie = {
    /**
     * Set a cookie with specified value and properties.
     * @param {string} name name of cookie
     * @param {string} value value of cookie
     * @param {int} expires number of seconds from now on
     * @param {string} path path of cookie
     * @param {string} domain domain of cookie
     * @param {boolean} secure secure of cookie
     * @returns {string}
     */
    setCookie: function(name, value, expires, path, domain, secure)
    {
        // set time, it's in milliseconds
        var today = new Date();
        today.setTime(today.getTime());
        var expires_date = new Date(today.getTime() + (expires * 1000));
        var cookieVal = name + "=" + encodeURIComponent(value) +
                ((expires) ? "; expires=" + expires_date.toGMTString() : "") +
                ((path) ? "; path=" + path : "; path=/") +
                ((domain) ? "; domain=" + domain : "") +
                ((secure) ? "; secure" : "");
        document.cookie = cookieVal;
        return cookieVal;
    },
    /**
     * Get value of a cookie. If there are cookies with the same name in different path, value of early set cookie is returned.
     * @param {string} name name of cookie
     * @returns {string} value of cookie, if cookie does not exist, null is returned
     */
    getCookie: function(name) {
        // first we'll split this cookie up into name/value pairs
        // note: document.cookie only returns name=value, not the other components
        var a_all_cookies = document.cookie.split(';');
        var a_temp_cookie = '';
        var cookie_name = '';
        var cookie_value = '';
        var b_cookie_found = false; // set boolean t/f default f

        for (i = 0; i < a_all_cookies.length; i++)
        {
            // now we'll split apart each name=value pair
            a_temp_cookie = a_all_cookies[i].split('=');


            // and trim left/right whitespace while we're at it
            cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

            // if the extracted name matches passed check_name
            if (cookie_name === name)
            {
                b_cookie_found = true;
                // we need to handle case where cookie has no value but exists (no = sign, that is):
                if (a_temp_cookie.length > 1)
                {
                    cookie_value = decodeURIComponent(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                }
                // note that in cases where cookie is initialized but no value, null is returned
                return cookie_value;
                break;
            }
            a_temp_cookie = null;
            cookie_name = '';
        }
        if (!b_cookie_found)
        {
            return null;
        }
    },
    /**
     * Get value of cookie and parse it to json object.
     * @param {string} name name of cookie
     * @returns {object} if value can not be parsed to object, null is returned
     */
    getCookieInJson: function(name) {
        var cookieVal = this.getCookie(name);
        try {
            var obj = eval('(' + cookieVal + ')');
            return obj;
        } catch (e) {
            return null;
        }

    },
    /**
     * Del a cookie value
     * @param {string} name
     * @param {string} path
     * @param {string} domain
     * @returns {string}
     */
    delCookie: function(name, path, domain)
    {
        var cookieVal = name + "=" + ((path) ? ";path=" + path : ";path=/") + ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        document.cookie = cookieVal;
        return cookieVal;
    }
};

basicUtil.url = {
    /**
     * Get protocol of query.
     * @returns {string}  http/https
     */
    getProtocol: function() {
        return window.location.href.split('://', 1)[0];
    },
    /**
     * Get domain of host
     * @returns {string}
     */
    getDomain: function() {
        return window.location.href.split('://')[1].split(/[/]+/, 1)[0];
    },
    /**
     * Get dir of query
     * @returns {string} with start slash, with no end slash(/)
     */
    getQueryDir: function() {
        return window.location.href.split('://')[1].split('?', 1)[0].replace(this.getDomain(), '').split(/\/$/, 1)[0];
    },
    /**
     * Get value of query key
     * @param {string} key
     * @returns {string}
     */
    getQueryKey: function(key) {
        var splitByKey = window.location.href.split('#', 1)[0].replace(window.location.href.split('?', 1) + '?', '').split(key + '=');
        if (splitByKey.length === 1) {
            return null;
        } else {
            return splitByKey[1].split('&', 1)[0];
        }
    },
    /**
     * Get fragment id
     * @returns {string}
     */
    getFragment: function() {
        var fragment = window.location.href.replace(window.location.href.split('#', 1)[0] + '#', '');
        return fragment;
    }
};

basicUtil.toolkit = {
    /**
     * Open new window after tracing.
     * @param {string} traceUrl
     * @param {string} newWindowUrl
     * @returns {string} traceUrl
     */
    traceBeforeOpenNewWindow: function(traceUrl, newWindowUrl) {
        var traceImg123423453456 = new Image();
        traceImg123423453456.onload = function() {
            window.open(newWindowUrl);
        };
//        traceImg123423453456.onabort = function() {
//            window.open(newWindowUrl);
//        };
        traceImg123423453456.onerror = function() {
            window.open(newWindowUrl);
        };
        traceImg123423453456.src = traceUrl;
        return traceUrl;
    },
    /**
     * Open new window after tracing.***does not work in ie (ie10)***
     * @param {string} traceUrl
     * @param {string} newWindowUrl
     * @returns {string} traceUrl
     */
    _traceAfterOpenNewWindow: function(traceUrl, newWindowUrl) {
        var w = window.open(newWindowUrl);
        w.onload = function() {
            var traceImg123423453456 = new Image();
            traceImg123423453456.src = traceUrl;
        };
        w.onerror = function() {
            var traceImg123423453456 = new Image();
            traceImg123423453456.src = traceUrl;
        };
        return traceUrl;
    },
    /**
     * Load new url after tracing
     * @param {string} traceUrl
     * @param {string} newPageUrl
     * @returns {string} traceUrl
     */
    traceLoadNewUrl: function(traceUrl, newPageUrl) {
        var traceImg123423453456 = new Image();
        traceImg123423453456.onload = function() {
            window.location.href = newPageUrl;
        };
//        traceImg123423453456.onabort = function() {
//            window.location.href = newPageUrl;
//        };
        traceImg123423453456.onerror = function() {
            window.location.href = newPageUrl;
        };
        traceImg123423453456.src = traceUrl;
        return traceUrl;
    },
    trace: function(traceUrl) {
        var traceImg123423453456 = new Image();
        traceImg123423453456.onload = function() {
        };
//        traceImg123423453456.onabort = function() {
//            window.location.href = newPageUrl;
//        };
        traceImg123423453456.onerror = function() {
        };
        traceImg123423453456.src = traceUrl;
        return traceUrl;
    }
};

basicUtil.browser = {
    getBrowserInfo: function() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        var info = {};
        var os = ua.match('windows nt') ? 'windows nt' :
                (ua.match('android') ? 'android' :
                        (ua.match('ipod') ? 'ios' :
                                (ua.match('ipad') ? 'ios' :
                                        (ua.match('iphone') ? 'ios' : 'unknown'))));
        info.os = os;
        //以下进行测试  
        if (Sys.ie) {
            info.app = 'ie';
            info.version = Sys.ie;
        }
        else if (Sys.firefox) {
            info.app = 'ff';
            info.version = Sys.firefox;
        }
        else if (Sys.chrome) {
            info.app = 'chrome';
            info.version = Sys.chrome;
        }
        else if (Sys.opera) {
            info.app = 'opera';
            info.version = Sys.opera;
        }
        else if (Sys.safari) {
            info.app = 'safari';
            info.version = Sys.safari;
        }
        return info;
    }
};