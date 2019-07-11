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
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
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
    public getUrlVars():string[]{
      let vars:string[] = [];
      let array:string[] = [];
      const url:string = window.location.search;
      const hash:string[] = url.slice(1).split("&");
      const max:number = hash.length;
      for (let i = 0; i < max; i++) {
        array = hash[i].split("=");
        vars.push(array[0]);
        vars[array[0]] = array[1];
      }
      return vars;
    }

  }

  const mainFunc = class {
    private initialUrl:string;
    private str:string[];
    private geturiv:string = $("html").html().match(/\/\/localhost:8080\/nijieNew\/nijieDL-new\/main\.js.*?"/)[0];
    private defaultExps:{[key:string]:RegExp} = {
      "mozamoza" : new RegExp(/<img class="mozamoza ngtag" illust_id=.*? user_id=/g),
      "mainContainer" : new RegExp(/<div class="clear-left clearfix">.*?<div class="kabu">/g),
      "mainContainerNotLeft" : new RegExp(/<div class="clearfix">.*?<div class="kabu">/g),
      "memIndex" : new RegExp(/<div class="mem-index clearboth">.*?<div class="kabu">/g),
      "membersMainContainer" : new RegExp(/<div id="members_dlsite_left" class="clearboth">.*?<div id="members_right">/g),
    }

    constructor(url:string){
      this.initialUrl = url;
    }

    /**
    * private ajax - main function to obtain the html source of specific content
    *
    * @param  {string} url - specific
    * @return {Promise<string>}
    */
    private async ajax(url:string):Promise<string>{
      try{
        const res:string = await $.ajax(url,{
          type:"GET",
          dataType:"html"
        });
        return res;
      }catch(e){
        return e.message;
      }
    }

    public async view():Promise<boolean>{
      const queries = common.getUrlVars();
      this.getimg([queries["id"]]);
      return true;
    }

    /**
    * private getimg - get image lists
    *
    * @param  {string[]} array image ids
    * @return {Promise<any>}
    */
    private async getimg(array: string[]):Promise<any> {
      let urlarr:string[] = [];
      let count:number = 0;
      let stimes:number = 0;
      let processtimes:number = 0;
      const timer:number = array.length;
      for (let i = 0; i < timer; i++) {
        const data = await this.ajax("//nijie.info/view_popup.php?id=" + array[i]);
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
              datalist["illustrator"] = title[0].replace(/(ニジエ|<title>|<\/title>| \| | \|)/g, "").replace(/\//g, "／").match(/ \| .*? \|/g)[0].replace(/%/g,"％");
              datalist["title"] =  title[0].match(/<title>.*? \| /g)[0].replace(/(<title>| \| )/g,"").replace(/%/g,"％");
              datalist["url"] = j[s];
              this.str.push(JSON.stringify(datalist));
              for (let i = 0; i < localStorage.length; i++) {
                let getItem = $.parseJSON(localStorage.getItem("illust-" + ("000" + Number(i+1)).slice(-4)));
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
            $("#details").html("<p>" + Math.round((s / j.length) * 100 ) + "% completed. added:" + j[s] + "<br>" + title + "</p>");
            if (count === timer) {
              this.post(urlarr);
            }
          }
        }
        var datatmp = JSON.stringify(localStorage);
        if(this.geturiv.match(/storage=2/) && count == timer){
          this.sendSt2(stimes,processtimes,datatmp);
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
    private sendSt2(stimes:number,ptimes:number,data:string):boolean{
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
          $('<form/>', {
            action: 'https://nijie.poyashi.me/dl.php?lang=jp&storage=2',
            method: 'post'
          })
          .append($('<input/>', {
            type: 'hidden',
            name: 'q',
            value: data
          }))
          .appendTo(document.body)
          .submit();
        }
      }else{
          alert(noconftxt);
      }
      $("#wrapper").fadeOut("slow",function(){$("#wrapper").remove();});
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
          $("#wrapper").fadeOut("slow",function() {
            $("#wrapper").remove();
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
      $("#wrapper").fadeOut("slow",function(){
        $("#wrapper").remove();
      });
      return true;
    }

    /**
    * private post - description
    *
    * @param  {string[]} query url query parameter to send
    * @return {boolean}       success or fail
    */
    private post(query:string[]): boolean {
      $("#details").html("取得に成功しました.ページを移動しています");
      $('<form/>', {
        action: 'https://nijie.poyashi.me/dl.php?lang=jp',
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
        num++;
        let id = "illust-" + ("000" +num).slice(-4);
        if(!localStorage.getItem(id)){
          break;
        }
      }while(true);
      localStorage.setItem(id, JSON.stringify(datalist));
    }
  }

  const common = new commonFunc();
  init();

  async function init() :Promise<any>{
    if (!window.location.href.match("nijie.info")) {
      return alert("対応サイト上でのみ本ブックマークレットをお使いいただけます。");
    }
    var currentPage:string = window.location.href.match(".+/(.+?)([\?#;].*)?$")[1];
    const main = new mainFunc(currentPage);
    switch(currentPage){
      case "view.php": return await main.view();
    }
  }

});
