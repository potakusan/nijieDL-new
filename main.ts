//import * as $ from "jquery";

$(async ()=>{

  const commonFunc = class {

    /**
    * formatDate - returns formatted date
    *
    * @param {any} date : specific time
    * @param {string} format : time format
    * @return {string} : formatted date
    */
    public formatDate(date:any, format:string):string{
      if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      if (format.match(/S/g)) {
        const milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        const length = format.match(/S/g).length;
        for (let i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
      }
      return format;
    }

    /**
    * wait - async function to wait for specific millisecs
    *
    * @param msec {number} millisecs to wait
    * @return {Promise<{}>}
    */
    public async wait(msec:number):Promise<{}>{
      return new Promise ( (resolve) =>{
        setTimeout( ()=>{
          resolve()
        }, msec)
      })
    }

    /**
    * getUrlVars - get the parameters of the current page
    *
    * @return vars {string[]}  an array of the parameters of the current page
    */
    public getUrlVars():{ [key:string]: number|string}{
      let vars:{ [key:string]: number|string} = {};
      let array:string[] = [];
      const url:string = window.location.search;
      const hash:string[] = url.slice(1).split("&");
      const max:number = hash.length;
      for (let i = 0; i < max; i++) {
        array = hash[i].split("=");
        vars[array[0]] = array[1];
      }
      return vars;
    }

    /**
     * public showBg - show loading screen while scraping documents
     *
     * @return {void}
     */
    public showBg():void{
      $("html").append("<div id='_wrapper'><div class='throbber throbber_large'></div><p>Now Loading...<br><span id='details'></span></p><p><span id='error'></span></p></div><style>#_wrapper{text-align:center;position:fixed;z-index:9999; top:0; opacity:1; color:#aaa;background:rgba(65,65,65,0.85);width:100%;height:100%;display:flex; flex-direction:column; justify-content:center;align-items:center;} .throbber {  width: 50px;  height: 50px; padding-bottom:15px; display: -webkit-box;  display: -webkit-flex;  display: -moz-box;  display: -ms-flexbox;  display: flex;  -webkit-box-align: center;  -webkit-align-items: center;  -moz-box-align: center;  -ms-flex-align: center;  align-items: center;  -webkit-box-pack: center;  -webkit-justify-content: center;  -moz-box-pack: center;  -ms-flex-pack: center;  justify-content: center;} .throbber:after {  display: block;  position: relative;  width: 20px;  height: 20px;  -webkit-animation: rotate 0.6s linear infinite;  -moz-animation: rotate 0.6s linear infinite;  -ms-animation: rotate 0.6s linear infinite;  -o-animation: rotate 0.6s linear infinite;  animation: rotate 0.6s linear infinite;  -webkit-border-radius: 100%;  -moz-border-radius: 100%;  border-radius: 100%;  border-top: 1px solid #545a6a;  border-bottom: 1px solid #d4d4db;  border-left: 1px solid #545a6a;  border-right: 1px solid #d4d4db;  content: '';  opacity: .5;} .throbber.throbber_large:after {  width: 40px;  height: 40px;}@keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}@-webkit-keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}@-moz-keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}@-o-keyframes rotate {  0% {    transform: rotateZ(-360deg);    -webkit-transform: rotateZ(-360deg);    -moz-transform: rotateZ(-360deg);    -o-transform: rotateZ(-360deg);  }  100% {    transform: rotateZ(0deg);    -webkit-transform: rotateZ(0deg);    -moz-transform: rotateZ(0deg);    -o-transform: rotateZ(0deg);  }}</style>")
      $("#details").html("");
      return;
    }

    /**
     * public removeBg - remove loading screen after finishing all processes or when occuring error
     *
     * @return {void}
     */
    public removeBg():void{
      $("#_wrapper").fadeOut("slow",()=>$("#_wrapper").remove());
    }

    /**
     * public noImg - change information texts when there're nothing to save.
     *
     * @return {void}
     */
    public noImg():void{
      $("#details").html("<p>表示する画像が見つかりませんでした</p><p><a href='#' class='close'>× 閉じる</a></p><script>$('.close').on('click',function(){$('#_wrapper').fadeOut('slow',function(){$('#_wrapper').remove();});return false;});</script>");
      return;
    }

  }

  const mainFunc = class {
    private str:string[];
    private array:(string|number)[];
    private geturiv:string = $("html").html().match(/\/\/localhost:8080\/nijieNew\/nijieDL-new\/main\.js.*?"/)[0];
    private defaultExps:{[key:string]:RegExp} = {
      "mozamoza" : new RegExp(/<img class="mozamoza ngtag" illust_id=.*? user_id=/g),
      "mainContainer" : new RegExp(/<div class="clear-left clearfix">.*?<div class="kabu">/g),
      "mainContainerNotLeft" : new RegExp(/<div class="clearfix">.*?<div class="kabu">/g),
      "memIndex" : new RegExp(/<div class="mem-index clearboth">.*?<div class="kabu">/g),
      "membersMainContainer" : new RegExp(/<div id="members_dlsite_left" class="clearboth">.*?<div id="members_right">/g),
      "memIndexToApplication" : new RegExp(/<div class=("|')mem-index clearboth("|')>(.|\n)*?<script type=("|')application\/ld\+json("|')>/g),
      "formMethod" : new RegExp(/<form method="post" name="content_delete".*?<div class="delete_footer_button">/g),
    }
    private promptText:string ="DLするページ範囲を選択してください。\n書式:XX-YY(XXページからYYページまで) または ZZ(ZZページのみ)";
    private commonErrorMes:string = "エラーが発生しました。コンソールを参照してください。";
    /**
     * startPoint?:number - cursor
     * endPoint?:number - cursor
     */
    private startPoint?:number;
    private endPoint?:number;

    constructor(){
      this.str = [];
      this.array = [];
    }

    public destructor():void{
      this.str = [];
      this.array = [];
      this.startPoint = null;
      this.endPoint = null;
      console.log("destructor method called - all processes has been perished");
    }

    /**
    * private ajax - main method to obtain the html source of the specific content
    *
    * @param  {string} url - specific
    * @return {Promise<string>}
    */
    private async ajax(url:string):Promise<{data:string;error:boolean}>{
      try{
        await common.wait(300);
        const res:string = await $.ajax(url,{
          type:"GET",
          dataType:"html"
        });
        return {"data":res,"error":false};
      }catch(e){
        if(e.status === 404){
          return {"data":null,"error":false};
        }
        console.log(e, "at private method ajax()");
        return {"data":e.message,"error":true};
      }
    }

    public async view():Promise<number>{
      const queries = common.getUrlVars();
      this.array = [queries["id"]];
      await this.getImg();
      return 0;
    }

    public async likeduser():Promise<number>{
      const range = this.showRangePrompt();
      if (!range){return 1;}
      common.showBg();
      if(~range.indexOf("-")){
        const ranges = range.split("-");
        this.startPoint = Number(ranges[0]);
        this.endPoint = Number(ranges[1]);
        for (let i = this.startPoint; i < this.endPoint + 1; ++i){
          const {res,error} = await this.scraper("like_user_view.php","?p=" + i);
          if(error){return 1;}
          Array.prototype.push.apply(this.array,res);
        }
      }else{
        const {res,error} = await this.scraper("like_user_view.php","?p=" + range);
        if(error){return 1;}
        Array.prototype.push.apply(this.array,res);
      }
      if(this.array){
        await this.getImg();
        return 0;
      }
      return 1;
    }

    public async userpage():Promise<number>{
      const queries = common.getUrlVars();
      const range = this.showRangePrompt();
      const fileName = window.location.href.match(".+/(.+?)([\?#;].*)?$")[1];
      const matcher = fileName === "members_illust.php" ? "membersMainContainer" : "memIndexToApplication";
      if(!range){return 1;}
      common.showBg();
      if(~range.indexOf("-")){
        const ranges = range.split("-");
        this.startPoint = Number(ranges[0]);
        this.endPoint = Number(ranges[1]);
        for(let i = this.startPoint; i < this.endPoint + 1; ++i){
          const {res,error} = await this.scraper(fileName,"?id=" + queries["id"] + "&p=" + i,matcher);
          if(error){return 1;}
          Array.prototype.push.apply(this.array,res);
        }
      }else{
        const {res,error} = await this.scraper(fileName,"?id=" + queries["id"] + "&p=" + range,matcher);
        if(error){return 1;}
        Array.prototype.push.apply(this.array,res);
      }
      if(this.array){
        await this.getImg();
        return 0;
      }
      return 1;
    }

    public async likeview():Promise<number>{
      const queries = common.getUrlVars();
      const range = this.showRangePrompt();
      if(!range){return 1;}
      common.showBg();
      if(~range.indexOf("-")){
        const ranges = range.split("-");
        this.startPoint = Number(ranges[0]);
        this.endPoint = Number(ranges[1]);
        for(let i = this.startPoint; i < this.endPoint + 1; ++i){
          const {res,error} = await this.scraper("user_like_illust_view.php","?id=" + queries["id"] + "&p=" + i,"memIndex");
          if(error){return 1;}
          Array.prototype.push.apply(this.array,res);
        }
      }else{
        const {res,error} = await this.scraper("user_like_illust_view.php","?id=" + queries["id"] + "&p=" + range,"memIndex");
        if(error){return 1;}
        Array.prototype.push.apply(this.array,res);
      }
      if(this.array){
        await this.getImg();
        return 0;
      }
      return 1;
    }

    public async favorite():Promise<number>{
      let queries = common.getUrlVars();
      if(!queries["sort"]){
        queries["sort"] = 0;
      }
      queries["sort"] = Number(queries["sort"]);
      const range = this.showRangePrompt();
      if(!range){return 1;}
      common.showBg();
      if(~range.indexOf("-")){
        const ranges = range.split("-");
        this.startPoint = Number(ranges[0]);
        this.endPoint = Number(ranges[1]);
        for(let i = this.startPoint; i < this.endPoint + 1; ++i){
          const {res,error} = await this.scraper("okiniiri.php","?sort=" + queries["sort"] + "&p=" + i,"formMethod");
          if(error){return 1;}
          Array.prototype.push.apply(this.array,res);
        }
      }else{
        const {res,error} = await this.scraper("okiniiri.php","?sort=" + queries["sort"] + "&p=" + range,"formMethod");
        if(error){return 1;}
        Array.prototype.push.apply(this.array,res);
      }
      if(this.array){
        await this.getImg();
        return 0;
      }
      return 1;
    }

    private showRangePrompt():string{
      return window.prompt(this.promptText, "")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s=>{return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);})
      .replace(/(ー|－|―)/g,"-");
    }

    /**
     * private scraper
     * @param  {string} uri - target url to scrape
     * @param  {string} params - parameters for target url
     * @param  {string} container - from defaultExps, the start point of RegExp
     * @param  {string} box - from defaultExps, the target container of of scraping
     * @return  {Promise<{res?:string[],error:boolean}>}
     */
    private async scraper(uri:string,params:string,container:string = "mainContainer", box: string = "mozamoza"):Promise<{res?:string[],error:boolean}>{
      let array = [];
      const {data,error} = await this.ajax("//nijie.info/" + uri + params);
      try{
        if(error){
          throw new Error("thrownError");
        }
        let scrap = data.match(this.defaultExps[container]);
        if(!scrap){
          throw new Error("noimg");
        }
        scrap = scrap[0].match(this.defaultExps[box]);
        if(!scrap){
          throw new Error("noimg");
        }
        for(let s = 0; s < scrap.length; ++s){
          const targetId = scrap[s].match(/\d{1,7}/g)[0];
          array.push(targetId);
          const current = params.match(/(?<=\&p\=)\d+/)[0];
          $("#details").html(`<p>Getting illust summary /  (${current} of ${this.startPoint ? this.endPoint - this.startPoint + 1 : current})</p>`);
        }
        return {res:array,error:false};
      }catch(e){
        console.log(e,e.message);
        switch(e.message){
          case "noimg":
            common.noImg();
          break;
          case "thrownError":
            alert(this.commonErrorMes);
          break;
        }
        return {error:true,res:[]};
      }
    }

    /**
    * private getImg - get image lists
    *
    * @return {Promise<any>}
    */
    private async getImg():Promise<any> {
      let urlarr:string[] = [];
      let count:number = 0;
      let stimes:number = 0;
      let processtimes:number = 0;
      const timer:number = this.array.length;
      for (let i = 0; i < timer; i++) {
        const {data,error} = await this.ajax("//nijie.info/view_popup.php?id=" + this.array[i]);
        if(error){
          console.log(data);
          alert(this.commonErrorMes);
          return false;
        }
        if(data === null){ // when server responded with error response code
          continue;
        }
        count++;
        let j = data.match(/<div id=('|")img_window('|").*?<div id=('|")view-center('|")/g)[0].match(/('|")\/\/pic(|\d+).*?('|")/g);
        let title = data.match(/<title>.*?<\/title>/);
        let ogp = data.match(/<meta name="twitter:url".*?<meta name="twitter:title"/);
        ogp = ogp[0].match(/\d{1,15}/);
        for (let s = 0; s < j.length; s++) {
          processtimes++;
          if(this.geturiv.match(/storage=(2|3)/)){
            let datalist:Object = new Object();
            if (!j[s].match(/(sp| \/|small)/)){
              j[s] = j[s].replace(/"/g,"");
              let existence:boolean = false;
              datalist["id"] = ogp[0];
              datalist["illustrator"] = title[0].replace(/(ニジエ|<title>|<\/title>)/g, "").replace(/\//g, "／").match(/ \| .*? \|/g)[0].replace(/ \| | \|/g,"").replace(/%/g,"％");
              datalist["title"] =  title[0].match(/<title>.*? \| /g)[0].replace(/(<title>| \| )/g,"").replace(/%/g,"％");
              datalist["url"] = j[s];
              this.str.push(JSON.stringify(datalist));
              for (let i = 0; i < localStorage.length; i++) {
                let getItem = $.parseJSON(localStorage.getItem("illust-" + ("0000" + Number(i+1)).slice(-5)));
                if(getItem && getItem["url"].match(j[s].replace(/__rs_l120x120\//g, ""))){
                  stimes++;
                  existence = true;
                  break;
                }
              }
              if (!existence){
                this.setItemToStorage(datalist);
              }
            }
          }else{
            if (!j[s].match(/(sp| \/|small)/)){
              j[s] = j[s].replace(/"/g,"");
              urlarr.push("&url=" + j[s] + "&title=" + title[0].replace(/%/g,"％") + "&id=" + ogp);
            }
            $("#details").html(`<p>PROGRESS : ${count} of ${timer} completed. (${Math.round(count / timer * 100)} %)<br>${j[s]}<br>${title}</p>`);
            if (count === timer) {
              this.post(urlarr.toString());
            }
          }
        }
        if(this.geturiv.match(/storage=2/) && count == timer){
          this.sendSt2(stimes,processtimes);
        }else if(this.geturiv.match(/storage=3/) && count == timer){
          this.download(processtimes);
        }
      }
    }

    /**
    * private sendSt2 - description
    *
    * @param  {number} stimes
    * @param  {number} ptimes
    * @param  {string} data
    * @return {boolean} success or fail
    */
    private sendSt2(stimes:number,ptimes:number):boolean{
      const messages = {
        def : ptimes + "個の画像を追加しました。\n",
        dup : stimes + "個の重複ファイルは追加されませんでした。",
        conf : "\n現在追加されているファイル一覧をニジエダウンローダに送信しますか？\n(現在" + localStorage.length + "枚追加済み)"
      }
      const conftxt = stimes !== 0 ? messages.def + messages.dup + messages.conf : messages.def + messages.conf;
      const noconftxt = stimes !== 0 ? messages.def + messages.dup : messages.def;
      if(!this.geturiv.match("noconf=1")){
      if (confirm(conftxt)) {
          if (confirm("送信後、localStorageに蓄積されたファイル一覧をクリアしますか？")) {
            localStorage.clear();
          }
          $("#details").html("取得に成功しました.ページを移動しています");
          this.post(JSON.stringify(localStorage),"lang=jp&storage=2")
        }
      }else{
          alert(noconftxt);
      }
      common.removeBg();
      return true;
    }

    /**
    * private download - description
    *
    * @param  {number} ptimes
    * @param  {string} data
    * @return {boolean} success or fail
    */
    private download(ptimes:number):boolean{
      let fname:string = this.geturiv.match(/&quot;.*?&quot;/)[0].replace(/&quot;/g,"");
      if (!fname){fname = "$o";}
      if(!this.geturiv.match("noconf=1")){
        if (!confirm(ptimes + "個の画像をダウンロードしますか？")) {
          $("#_wrapper").fadeOut("slow",function() {
            $("#_wrapper").remove();
          });
          return false;
        }
      }
      let i:number = 0;
      let arr:string[] = new Array();
      for (let key of this.str){
        key = $.parseJSON(key);
        const oname = key["url"].match(".+/(.+?)([\?#;].*)?$")[1];
        const oid = oname.match(/.*?_/) ? oname.match(/.*?_/)[0].replace("_","") : "unknown";
        const fileext = oname.split(".") ? oname.split(".")[1] : "jpg";
        const ffname = oname.split(".") ? oname.split(".")[0] : "unknown";
        const filename = fname.replace(/\$o/g, ffname)
        .replace(/\$r/g, common.formatDate(new Date(), "YYYYMMDD"))
        .replace(/\$d/g, common.formatDate(new Date(), "hhmmssSSS"))
        .replace(/\$n/, ("000"+Number(i+1)).slice(-4))
        .replace(/\$u/g, key["illustrator"])
        .replace(/\$l/g, oid)
        .replace(/\$i/g, key["id"])
        .replace(/\$t/g, key["title"]);
        arr.push('{"filename":"'+filename+"."+fileext + '","href":"'+key["url"]+'"}');
        i++;
      }
      const iframe:HTMLIFrameElement = document.createElement("iframe");
      document.body.appendChild(iframe);
      iframe.contentWindow.name = "iflr";
      const form:HTMLFormElement = document.createElement("form");
      form.target = "iflr";
      form.action = "https://nijie.poyashi.me/download_get.php";
      form.method = "POST";
      const input:HTMLInputElement = document.createElement("input");
      input.type = "hidden";
      input.name = "q";
      input.value = JSON.stringify(arr);
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      this.str = [];
      common.removeBg();
      return true;
    }

    /**
    * private post - description
    *
    * @param  {string} query url query parameter to send
    * @param  {string} params url parameters to set up
    * @return {boolean}       success or fail
    */
    private post(query:string,params:string = "?lang=jp"):boolean {
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

    private setItemToStorage(datalist:Object){
      let num:number = 0;
      let id:string;
      do{
        ++num;
        id = "illust-" + ("0000" +num).slice(-5);
        if(!localStorage.getItem(id)){
          break;
        }
      }while(true);
      localStorage.setItem(id, JSON.stringify(datalist));
    }
  }

  const common = new commonFunc();

  async function init():Promise<any>{
    const _destruct = ()=>{
      common.removeBg();
      main.destructor();
    }
    if (!window.location.href.match("nijie.info")) {
      return alert("対応サイト上でのみ本ブックマークレットをお使いいただけます。");
    }
    var currentPage:string = window.location.href.match(".+/(.+?)([\?#;].*)?$")[1];
    const main = new mainFunc();
    try{
      const res = async ():Promise<number>=>{
        switch(currentPage){
          case "view_popup.php":
          case "view.php": return await main.view();
          case "like_user_view.php": return await main.likeduser();
          case "members_illust.php":
          case "members_dojin.php": return await main.userpage();
          case "okiniiri.php": return await main.favorite();
          case "user_like_illust_view.php" : return await main.likeview();
          default: return 2;
        }
      }
      res().then(res=>{
        if(res === 2){
          alert("このページには対応していません。");
        }
        _destruct();
      });
    }catch(e){
      alert("エラーが発生したため処理を続行できません。\nコマンドログを確認してください。");
      console.log(e);
      _destruct();
    }
    return 0;
  }

  init();

});
