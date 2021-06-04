/**
 * Splits new lines of text into separate divs
 *
 * ### Options:
 * - `width` string The width of the box. By default, it tries to use the
 *	 element's width. If you don't define a width, there's no way to split it
 *	 by lines!
 *	- `tag` string The tag to wrap the lines in
 *	- `keepHtml` boolean Whether or not to try and preserve the html within
 *	 the element. Default is true
 *
 *	@param options object The options object
 *	@license MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

 (function($){

    /**
     * Creates a temporary clone
     *
     * @param element element The element to clone
     */
        function _createTemp(element) {
            return element.clone().css({position: 'absolute'});
        };
        
    /**
     * Splits contents into words, keeping their original Html tag. Note that this
     * tags *each* word with the tag it was found in, so when the wrapping begins
     * the tags stay intact. This may have an effect on your styles (say, if you have
     * margin, each word will inherit those styles).
     *
     * @param node contents The contents
     */
        function _splitHtmlWords(contents) {
            var words = [];
            var splitContent;
            for (var c=0; c<contents.length; c++) {
                if (contents[c].nodeName === 'BR') {
                    words.push('<br>');
                    continue;
                }
                if (contents[c].nodeType == 3) {
                    splitContent = _splitWords(contents[c].textContent || contents[c].toString());
                } else {
                    var tag = $(contents[c]).clone();
                    splitContent = _splitHtmlWords(tag.contents());
                    for (var t=0; t<splitContent.length; t++) {
                        tag.empty();
                        splitContent[t] = tag.html(splitContent[t]).wrap('<p></p>').parent().html();
                    }
                }
                for (var w=0; w<splitContent.length; w++) {
                    if (splitContent[w] === '') {
                        continue;
                    }
                    words.push(splitContent[w]);
                }
            }
            return words;
        };
    
    /**
     * Splits words by spaces
     *
     * @param string text The text to split
     */
        function _splitWords(text) {
            return text.split(/\s+/);
        }
    
    /**
     * Formats html with tags and wrappers.
     *
     * @param tag
     * @param html content wrapped by the tag
     * @param index Current line index
     */
        function _markupContent(tag, html, index) {
            // wrap in a temp div so .html() gives us the tags we specify
            tag = '<div class="stop">' + tag;
            // find the deepest child, add html, then find the parent
            var $outer = $(tag)
                .find('*:not(:has("*"))')
                .html(html)
                .closest('.stop')
                .slice(-1);
    
            // jQuery does not support setting CSS vars until 3.2, so manually set them
            $outer.children().each(function (i, element) {
                element.style.setProperty('--line-index', index);
            });
    
            return $outer.html();
        }
    
    /**
     * The jQuery plugin function. See the top of this file for information on the
     * options
     */
        $.fn.splitLines = function(options) {
            var settings = {
                width: 'auto',
                tag: '<div>',
                wrap: '',
                keepHtml: true,
                nextline: "/div/"
            };
            if (options) {
                $.extend(settings, options);
            }
            var newHtml = _createTemp(this);
            var contents = this.contents();
            var text = this.text();
            this.append(newHtml);
            newHtml.text('42');
            var maxHeight = newHtml.height()+2;
            newHtml.empty();
    
            var tempLine = _createTemp(newHtml);
            var width = settings.width;
            if (settings.width === 'auto') {
                width = this[0].offsetWidth;
            }
            tempLine.width(width);
            this.append(tempLine);
            var words = settings.keepHtml ? _splitHtmlWords(contents) : _splitWords(text);
            var prev;
            var lineCount = 0;
            for (var w=0; w<words.length; w++) {
                var html = tempLine.html();
                if(words[w]==settings.nextline){
                    tempLine.html(html);
                    newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));
                    tempLine.html('');
                    lineCount++;
                    console.log(newHtml.html());
                    continue;
                }
                tempLine.html(html+words[w]+' ');
                //console.log("Outside",tempLine.html());
                if (tempLine.html() == prev) {
                    // repeating word, it will never fit so just use it instead of failing
                    prev = '';
                    newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));
                    

                    tempLine.html('');
                    continue;
                }
                if (tempLine.height() > maxHeight) {
                    prev = tempLine.html();
                    tempLine.html(html);
                    newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));
                    tempLine.html('');
                    w--;
                    lineCount++;
                }
            }
            newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));
    
            this.html(newHtml.html());
    
        };

        function randommer(lval){
            var val=((Math.random()*2-1)*(lval));
            return val;
        }

        $.fn.getText = function(){
            var tots = document.getElementById("note").childNodes;
            var newHtml="";
            console.log(tots.length);
            for(let i=0;i<tots.length;i++){
                if(tots[i].tagName=="BR"){
                    newHtml+="<br>";
                    alert();
                }else{
                    newHtml+=tots[i].textContent;
                }
            }
            
            var tots = document.getElementById("note").textContent;
            document.getElementById("note").innerHTML=newHtml;
        };
        $.fn.increasewidth =function(val){
            $(this.selector).css({"width":String(400+val)+"px"});
            console.log($(this.selector).css("width"));
        };

        $.fn.decreasewidth =function(val){
            let currwidth=$(this.selector).css("width");
            
            $(this.selector).css({"width":String(400)+"px"});
            console.log($(this.selector).css("width"));
        };

        $.fn.remdev= function(){
            var noter = String(document.getElementById("note").innerHTML);
            console.log(noter);
            while(noter.search("<div>")!=-1){
            noter=noter.replace("<div>"," /div/ ");
            }
            while(noter.search("</div>")!=-1){
            noter=noter.replace("</div>","");
            }
            console.log(noter);
            document.getElementById("note").innerHTML=noter;
        };

        $.fn.randomizelinemargin = function(number){
            let children = $(this.selector).children();
            for(let i=0;i<children.length;i++){
                children[i].style["margin-left"]= (Math.random()*2-1)*number+"px";
            }
        };

        $.fn.randomizelinespacing = function(number){
            let children = $(this.selector).children();
            for(let i=0;i<children.length;i++){
                children[i].style["line-height"]= ((Math.random())*number+20)+"px";
            }
        };
        $.fn.randomizeletterspacing = function(number){
            let children = $(this.selector).children();
            for(let i=0;i<children.length;i++){
                let words= children[i].children;
                for(let j=0;j<words.length;j++){
                    if(words[j].getAttribute("class")!="tabber"){
                        words[j].style["letter-spacing"]= (Math.random())*number+"px";
                    }
                }
            }
        };

        $.fn.randomizeletterrotation = function(lval){
            let children = $(this.selector).children();
            for(let i=0;i<children.length;i++){
                let words= children[i].children;
                for(let j=0;j<words.length;j++){
                    if(words[j].getAttribute("class")!="tabber"){
                        let letters= words[j].children;
                        for(let k=0;k<letters.length;k++){
                            letters[k].style["display"]="inline-block";
                            letters[k].style["transform"] ="rotate(" + randommer(lval) + "deg) ";
                        }
                }
            }
            }
        };

        $.fn.randomizelinerotation = function(lval){
            let children = $(this.selector).children();
            for(let i=0;i<children.length;i++){
                children[i].style["display"]="inline-block";
                children[i].style["transform"] ="rotate(" + randommer(lval) + "deg) ";
            }
        };

        $.fn.randomizewordrotation = function(lval){
            let children = $(this.selector).children();
            for(let i=0;i<children.length;i++){
                let words= children[i].children;
                for(let j=0;j<words.length;j++){
                    words[j].style["display"]="inline-block";
                    words[j].style["transform"] ="rotate(" + randommer(lval) + "deg) ";
                }
            }
        };

        $.fn.inactive = function(options){
            let elements= document.getElementsByClassName(options["class"]);
            for(let i=0;i<elements.length;i++){
                elements[i].style["pointer-events"]="none";
                elements[i].style["opacity"]="0.8";
            }
        };

        $.fn.active = function(options){
            let elements= document.getElementsByClassName(options["class"]);
            for(let i=0;i<elements.length;i++){
                elements[i].style["pointer-events"]="unset";
                elements[i].style["opacity"]="1";
            }
        };

        $.fn.callall = function(){
            let inputs=$(".full-random-class").find(".qtyValue");
            for(let i=0;i<inputs.length;i++){
                inputs[i].dispatchEvent(new Event("change"));
                console.log(inputs[i]);
                
            }
            
        };

        $.fn.wordsegmentation = function(){
            let spans = $("#note").find("span");
            let text="";
            for(let i=0;i<spans.length;i++){

                spans[i].setAttribute("id","linesplit"+String(i));
                spans[i].setAttribute("class","lines");
            }
            for(let i=0;i<spans.length;i++){
                let val=$("#linesplit"+String(i));
                text=splitWords(val);
                spans[i].innerHTML=text;
            }
        };

        var splitWords = function(val){
            let list=_splitHtmlWords( val.contents());
            let text=""
            let intext=""
            for(let i=0;i<list.length;i++){
                intext=""
                for(let j=0;j<list[i].length;j++){
                    intext+="<span  class='lettersplit"+String(j)+"'>"+list[i][j]+"</span>";
                }
                text+="<span  class='wordsplit"+String(i)+"'>"+intext+" <span class='tabber'></span>"+"</span>";
            }
            return text;
        };


    })(jQuery);
    