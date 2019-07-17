var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import * as $ from "jquery";
$(() => __awaiter(this, void 0, void 0, function* () {
    const commonFunc = class {
        /**
        * formatDate - returns formatted date
        *
        * @param {any} date : specific time
        * @param {string} format : time format
        * @return {string} : formatted date
        */
        formatDate(date, format) {
            if (!format)
                format = 'YYYY-MM-DD hh:mm:ss.SSS';
            format = format.replace(/YYYY/g, date.getFullYear());
            format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
            format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
            format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
            format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
            format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
            if (format.match(/S/g)) {
                const milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
                const length = format.match(/S/g).length;
                for (var i = 0; i < length; i++)
                    format = format.replace(/S/, milliSeconds.substring(i, i + 1));
            }
            return format;
        }
        /**
        * wait - async function to wait for specific millisecs
        *
        * @param msec {number} millisecs to wait
        * @return {Promise<{}>}
        */
        wait(msec) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, msec);
                });
            });
        }
        /**
        * getUrlVars - get the parameters of the current page
        *
        * @return vars {string[]}  an array of the parameters of the current page
        */
        getUrlVars() {
            let vars = [];
            let array = [];
            const url = window.location.search;
            const hash = url.slice(1).split("&");
            const max = hash.length;
            for (let i = 0; i < max; i++) {
                array = hash[i].split("=");
                vars.push(array[0]);
                vars[array[0]] = array[1];
            }
            return vars;
        }
        /**
         * public showBg - show loading screen while scraping documents
         *
         * @return {void}
         */
        showBg() {
            $("html").append("<div id='wrapper'><div class='throbber throbber_large'></div><p>Now Loading...<br><span id='details'></span></p><p><span id='error'></span></p></div><style>#wrapper{text-align:center;position:fixed;z-index:9999; top:0; opacity:1; color:#aaa;background:rgba(65,65,65,0.85);width:100%;height:100%;display:flex; flex-direction:column; justify-content:center;align-items:center;} .throbber {  width: 50px;  height: 50px; padding-bottom:15px; display: -webkit-box;  display: -webkit-flex;  display: -moz-box;  display: -ms-flexbox;  display: flex;  -webkit-box-align: center;  -webkit-align-items: center;  -moz-box-align: center;  -ms-flex-align: center;  align-items: center;  -webkit-box-pack: center;  -webkit-justify-content: center;  -moz-box-pack: center;  -ms-flex-pack: center;  justify-content: center;} .throbber:after {  display: block;  position: relative;  width: 20px;  height: 20px;  -webkit-animation: rotate 0.6s linear infinite;  -moz-animation: rotate 0.6s linear infinite;  -ms-animation: rotate 0.6s linear infinite;  -o-animation: rotate 0.6s linear infinite;  animation: rotate 0.6s linear infinite;  -webkit-border-radius: 100%;  -moz-border-radius: 100%;  border-radius: 100%;  border-top: 1px solid #545a6a;  border-bottom: 1px solid #d4d4db;  border-left: 1px solid #545a6a;  border-right: 1px solid #d4d4db;  content: '';  opacity: .5;} .throbber.throbber_large:after {  width: 40px;  height: 40px;}@keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}@-webkit-keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}@-moz-keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}@-o-keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}</style>");
            $("#details").html("");
            return;
        }
        /**
         * public noImg - change information texts when there're nothing to save.
         *
         * @return {void}
         */
        noImg() {
            $("#details").html("<p>表示する画像が見つかりませんでした</p><p><a href='#' class='close'>× 閉じる</a></p><script>$('.close').on('click',function(){$('#wrapper').fadeOut('slow',function(){$('#wrapper').remove();});return false;});</script>");
            return;
        }
    };
    const mainFunc = class {
        constructor() {
            this.geturiv = $("html").html().match(/\/\/localhost:8080\/nijieNew\/nijieDL-new\/main\.js.*?"/)[0];
            this.defaultExps = {
                "mozamoza": new RegExp(/<img class="mozamoza ngtag" illust_id=.*? user_id=/g),
                "mainContainer": new RegExp(/<div class="clear-left clearfix">.*?<div class="kabu">/g),
                "mainContainerNotLeft": new RegExp(/<div class="clearfix">.*?<div class="kabu">/g),
                "memIndex": new RegExp(/<div class="mem-index clearboth">.*?<div class="kabu">/g),
                "membersMainContainer": new RegExp(/<div id="members_dlsite_left" class="clearboth">.*?<div id="members_right">/g),
                "memIndexToApplication": new RegExp(/<div class=("|')mem-index clearboth("|')>(.|\n)*?<script type=("|')application\/ld\+json("|')>/g)
            };
            this.promptText = "フォローしているユーザーの新着2次絵を一括DLします。DLするページ範囲を選択してください。\n書式:XX-YY(XXページからYYページまで) または ZZ(ZZページのみ)";
            this.commonErrorMes = "エラーが発生しました。コンソールを参照してください。";
            this.str = [];
        }
        /**
        * private ajax - main function to obtain the html source of specific content
        *
        * @param  {string} url - specific
        * @return {Promise<string>}
        */
        ajax(url) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield $.ajax(url, {
                        type: "GET",
                        dataType: "html"
                    });
                    return { "data": res, "error": false };
                }
                catch (e) {
                    return { "data": e.message, "error": true };
                }
            });
        }
        view() {
            return __awaiter(this, void 0, void 0, function* () {
                const queries = common.getUrlVars();
                this.array = [queries["id"]];
                this.getImg();
                return true;
            });
        }
        likeduser() {
            return __awaiter(this, void 0, void 0, function* () {
                const range = this.showRangePrompt();
                if (!range) {
                    return false;
                }
                common.showBg();
                if (~range.indexOf("-")) {
                    const ranges = range.split("-");
                    const startPoint = Number(ranges[0]);
                    const endPoint = Number(ranges[1]);
                    for (let i = startPoint; i < endPoint + 1; ++i) {
                        const { res, error } = yield this.scraper("like_user_view.php", "?p=" + i);
                        if (error) {
                            return false;
                        }
                        Array.prototype.push.apply(this.array, res);
                    }
                }
                else {
                    const { res, error } = yield this.scraper("like_user_view.php", "?p=" + Number(range));
                    if (error) {
                        return false;
                    }
                    Array.prototype.push.apply(this.array, res);
                }
                if (this.array) {
                    this.getImg();
                    return true;
                }
                return false;
            });
        }
        userpage() {
            return __awaiter(this, void 0, void 0, function* () {
                const queries = common.getUrlVars();
                const range = this.showRangePrompt();
                const fileName = window.location.href.match(".+/(.+?)([\?#;].*)?$")[1];
                const matcher = fileName === "members_illust.php" ? "membersMainContainer" : "memIndexToApplication";
                if (!range) {
                    return false;
                }
                common.showBg();
                if (~range.indexOf("-")) {
                    const ranges = range.split("-");
                    const startPoint = Number(ranges[0]);
                    const endPoint = Number(ranges[1]);
                    for (let i = startPoint; i < endPoint + 1; ++i) {
                        const { res, error } = yield this.scraper(fileName, "?id=" + queries["id"] + "&p=" + i, matcher);
                        if (error) {
                            return false;
                        }
                        Array.prototype.push.apply(this.array, res);
                    }
                }
                else {
                    const { res, error } = yield this.scraper(fileName, "?id=" + queries["id"] + "&p=" + Number(range), matcher);
                    if (error) {
                        return false;
                    }
                    Array.prototype.push.apply(this.array, res);
                }
                if (this.array) {
                    this.getImg();
                    return true;
                }
                return false;
            });
        }
        showRangePrompt() {
            return window.prompt(this.promptText, "")
                .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); })
                .replace(/(ー|－|―)/g, "-");
        }
        scraper(uri, params, container = "mainContainer", box = "mozamoza") {
            return __awaiter(this, void 0, void 0, function* () {
                let array = [];
                const { data, error } = yield this.ajax("//nijie.info/" + uri + params);
                try {
                    if (error) {
                        throw new Error("thrownError");
                    }
                    let scrap = data.match(this.defaultExps[container]);
                    if (!scrap) {
                        throw new Error("noimg");
                    }
                    scrap = scrap[0].match(this.defaultExps[box]);
                    if (!scrap) {
                        throw new Error("noimg");
                    }
                    for (let s = 0; s < scrap.length; ++s) {
                        const targetId = scrap[s].match(/\d{1,7}/g)[0];
                        array.push(targetId);
                        $("#details").html(`<p>Getting : ${targetId}</p>`);
                    }
                    return { res: array, error: false };
                }
                catch (e) {
                    console.log(e, e.message);
                    switch (e.message) {
                        case "noimg":
                            common.noImg();
                            break;
                        case "thrownError":
                            alert(this.commonErrorMes);
                            break;
                    }
                    return { error: true, res: null };
                }
            });
        }
        /**
        * private getImg - get image lists
        *
        * @return {Promise<any>}
        */
        getImg() {
            return __awaiter(this, void 0, void 0, function* () {
                let urlarr = [];
                let count = 0;
                let stimes = 0;
                let processtimes = 0;
                const timer = this.array.length;
                for (let i = 0; i < timer; i++) {
                    const { data, error } = yield this.ajax("//nijie.info/view_popup.php?id=" + this.array[i]);
                    if (error) {
                        console.log(data);
                        alert(this.commonErrorMes);
                        return false;
                    }
                    count++;
                    let j = data.match(/<div id=('|")img_window('|").*?<div id=('|")view-center('|")/g)[0].match(/('|")\/\/pic(|\d+).*?('|")/g);
                    let title = data.match(/<title>.*?<\/title>/);
                    let ogp = data.match(/<meta name="twitter:url".*?<meta name="twitter:title"/);
                    ogp = ogp[0].match(/\d{1,15}/);
                    for (let s = 0; s < j.length; s++) {
                        processtimes++;
                        if (this.geturiv.match(/storage=(2|3)/)) {
                            let datalist = new Object();
                            if (!j[s].match(/(sp| \/|small)/)) {
                                j[s] = j[s].replace(/"/g, "");
                                let existence = false;
                                datalist["id"] = ogp[0];
                                datalist["illustrator"] = title[0].replace(/(ニジエ|<title>|<\/title>)/g, "").replace(/\//g, "／").match(/ \| .*? \|/g)[0].replace(/ \| | \|/g, "").replace(/%/g, "％");
                                datalist["title"] = title[0].match(/<title>.*? \| /g)[0].replace(/(<title>| \| )/g, "").replace(/%/g, "％");
                                datalist["url"] = j[s];
                                this.str.push(JSON.stringify(datalist));
                                for (let i = 0; i < localStorage.length; i++) {
                                    let getItem = $.parseJSON(localStorage.getItem("illust-" + ("0000" + Number(i + 1)).slice(-5)));
                                    if (getItem && getItem["url"].match(j[s].replace(/__rs_l120x120\//g, ""))) {
                                        stimes++;
                                        existence = true;
                                        break;
                                    }
                                }
                                if (!existence) {
                                    this.setItemToStorage(datalist);
                                }
                            }
                        }
                        else {
                            if (!j[s].match(/(sp| \/|small)/)) {
                                j[s] = j[s].replace(/"/g, "");
                                urlarr.push("&url=" + j[s] + "&title=" + title[0].replace(/%/g, "％") + "&id=" + ogp);
                            }
                            $("#details").html("<p>" + Math.round((s / j.length) * 100) + "% completed. added:" + j[s] + "<br>" + title + "</p>");
                            if (count === timer) {
                                this.post(urlarr.toString());
                            }
                        }
                    }
                    if (this.geturiv.match(/storage=2/) && count == timer) {
                        this.sendSt2(stimes, processtimes);
                    }
                    else if (this.geturiv.match(/storage=3/) && count == timer) {
                        this.download(processtimes);
                    }
                }
            });
        }
        /**
        * private sendSt2 - description
        *
        * @param  {number} stimes
        * @param  {number} ptimes
        * @param  {string} data
        * @return {boolean} success or fail
        */
        sendSt2(stimes, ptimes) {
            const messages = {
                def: ptimes + "個の画像を追加しました。\n",
                dup: stimes + "個の重複ファイルは追加されませんでした。",
                conf: "\n現在追加されているファイル一覧をニジエダウンローダに送信しますか？\n(現在" + localStorage.length + "枚追加済み)"
            };
            const conftxt = stimes !== 0 ? messages.def + messages.dup + messages.conf : messages.def + messages.conf;
            const noconftxt = stimes !== 0 ? messages.def + messages.dup : messages.def;
            if (!this.geturiv.match("noconf=1")) {
                if (confirm(conftxt)) {
                    if (confirm("送信後、localStorageに蓄積されたファイル一覧をクリアしますか？")) {
                        localStorage.clear();
                    }
                    $("#details").html("取得に成功しました.ページを移動しています");
                    this.post(JSON.stringify(localStorage), "lang=jp&storage=2");
                }
            }
            else {
                alert(noconftxt);
            }
            $("#wrapper").fadeOut("slow", function () { $("#wrapper").remove(); });
            return true;
        }
        /**
        * private download - description
        *
        * @param  {number} ptimes
        * @param  {string} data
        * @return {boolean} success or fail
        */
        download(ptimes) {
            let fname = this.geturiv.match(/&quot;.*?&quot;/)[0].replace(/&quot;/g, "");
            if (!fname) {
                fname = "$o";
            }
            if (!this.geturiv.match("noconf=1")) {
                if (!confirm(ptimes + "個の画像をダウンロードしますか？")) {
                    $("#wrapper").fadeOut("slow", function () {
                        $("#wrapper").remove();
                    });
                    return false;
                }
            }
            let i = 0;
            let arr = new Array();
            for (let key of this.str) {
                key = $.parseJSON(key);
                const oname = key["url"].match(".+/(.+?)([\?#;].*)?$")[1];
                const oid = oname.match(/.*?_/) ? oname.match(/.*?_/)[0].replace("_", "") : "unknown";
                const fileext = oname.split(".") ? oname.split(".")[1] : "jpg";
                const ffname = oname.split(".") ? oname.split(".")[0] : "unknown";
                const filename = fname.replace(/\$o/g, ffname)
                    .replace(/\$r/g, common.formatDate(new Date(), "YYYYMMDD"))
                    .replace(/\$d/g, common.formatDate(new Date(), "hhmmssSSS"))
                    .replace(/\$n/, ("000" + Number(i + 1)).slice(-4))
                    .replace(/\$u/g, key["illustrator"])
                    .replace(/\$l/g, oid)
                    .replace(/\$i/g, key["id"])
                    .replace(/\$t/g, key["title"]);
                arr.push('{"filename":"' + filename + "." + fileext + '","href":"' + key["url"] + '"}');
                i++;
            }
            const iframe = document.createElement("iframe");
            document.body.appendChild(iframe);
            iframe.contentWindow.name = "iflr";
            const form = document.createElement("form");
            form.target = "iflr";
            form.action = "https://nijie.poyashi.me/download_get.php";
            form.method = "POST";
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "q";
            input.value = JSON.stringify(arr);
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            this.str = [];
            $("#wrapper").fadeOut("slow", function () {
                $("#wrapper").remove();
            });
            return true;
        }
        /**
        * private post - description
        *
        * @param  {string} query url query parameter to send
        * @param  {string} params url parameters to set up
        * @return {boolean}       success or fail
        */
        post(query, params = "?lang=jp") {
            $('<form/>', {
                action: 'https://nijie.poyashi.me/dl.php' + params,
                method: 'post'
            })
                .append($('<input/>', {
                type: 'hidden',
                name: 'q',
                value: query
            }))
                .appendTo(document.body)
                .submit();
            return true;
        }
        setItemToStorage(datalist) {
            let num = 0;
            let id;
            do {
                ++num;
                id = "illust-" + ("0000" + num).slice(-5);
                if (!localStorage.getItem(id)) {
                    break;
                }
            } while (true);
            localStorage.setItem(id, JSON.stringify(datalist));
        }
    };
    const common = new commonFunc();
    init();
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.location.href.match("nijie.info")) {
                return alert("対応サイト上でのみ本ブックマークレットをお使いいただけます。");
            }
            var currentPage = window.location.href.match(".+/(.+?)([\?#;].*)?$")[1];
            const main = new mainFunc();
            switch (currentPage) {
                case "view.php": return yield main.view();
                case "like_user_view.php": return yield main.likeduser();
                case "members_illust.php":
                case "members_dojin.php": return yield main.userpage();
            }
        });
    }
}));
