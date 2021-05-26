var splitText = (function(){
  
    // some global Variables
    // Setup some config items that can be overwritten later
    var config = {
      selector: '[data-js="split-me"]',
    };
    
    // create an array of the original text content
    // so we can send it back in on _resize();
    var origTextArray = [];
    
    
    /**
     * Media queries function:
     * Because our caption container is a fluid width... we will need to recalculate the content that gets injected into the each new line span when the browser is resized
     * this is because the span content won't have enough space anymore, and will break onto 2 lines INSIDE the span
     * So here we set up some breakpoints that enable us to re-run the _splitMe function when it moves through them
     * the easiest way to control this and make sure the merged spans don't break onto 2 lines would be to make the caption actually a fixed width... that way you know the span content is always going to fit it... and then just duplicate the breakpoints where you change the caption size and use them here to run _resize() when we move through them.
     */
    var _storedMQ = 0;
    var mediaQueries = {
      mq320: 320,
      mq340: 340,
      mq360: 360,
      mq400: 400,
      mq480: 480,
      mq600: 600,
      mq720: 720,
      mq960: 960,
      mq1440: 1440,
    }
    // select every [data-js="split-me"] element (slider caption)
    var resizeable_elements = document.querySelectorAll(config.selector);
    console.log('resizeable_elements =', resizeable_elements)
  
    // Check if the media query has changed
    function _checkIfMQChanged(){
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var _currentMq = 0;
  
      if (_storedMQ == 0) _storedMQ = width;
  
      if (width >= mediaQueries.mq340 && width <= mediaQueries.mq360) {
        _currentMq = mediaQueries.mq340;
      } else if (width >= mediaQueries.mq360 && width <= mediaQueries.mq400) {
        _currentMq = mediaQueries.mq360;
      } else if (width >= mediaQueries.mq400 && width <= mediaQueries.mq480) {
        _currentMq = mediaQueries.mq400;
      } else if (width >= mediaQueries.mq480 && width <= mediaQueries.mq600) {
        _currentMq = mediaQueries.mq480;
      } else if (width >= mediaQueries.mq600 && width <= mediaQueries.mq720) {
        _currentMq = mediaQueries.mq600;
      } else if (width >= mediaQueries.mq720 && width <= mediaQueries.mq960) {
        _currentMq = mediaQueries.mq720;
      } else if (width >= mediaQueries.mq960 && width <= mediaQueries.mq1440) {
        _currentMq = mediaQueries.mq960;
      } else if (width >= mediaQueries.mq1440) {
        _currentMq = mediaQueries.mq1440;
      } else {
        _currentMq = mediaQueries.mq320;
      }
  
  
      if (_currentMq != _storedMQ){
        _storedMQ = _currentMq;
        console.log(_currentMq, _storedMQ);
        return true;
      }
      return false;
    }
    
    
    
    /**
     * Split the element's textContent
     *
     * @private
     * @param {string} element - The element being split.. in this case all [data-js="split-me"]
     * @returns {function}
     */
    
    var _splitMe = function(element) {
      console.log("_splitMe()");
      
      // Store the original text and empty the element
      var originalText = element.textContent;
      element.textContent = '';
      
      // push the original text to an array so we can access it later
      origTextArray.push(originalText);
      
      // Set up the new spans (an empty array)
      var spanSections = [];
      
      // console.log("element outerHTML = ", element.outerHTML);
      console.log("*** NEW CAPTION *** : originalText =", originalText);
      
      // For each caption, split each word inside the H1 into an array
      // use a 'blank space' to define where the word breaks are
      // this will break each word up, seperating each one out into it's own span, then append that span into the H1
      // Watch out for the HTML formatting of your H1 text content, if we aren't careful we can end up with a whole bunch of empty spans if introduce extra whitespace inside the tag
      
      Array.prototype.forEach.call(originalText.split(' '), function(el) {
        
        var newSpan = document.createElement('span');
        
        // add the current split word into a new span with a space at the end
        newSpan.textContent = el + " ";
        // console.log("newSpan = ", newSpan);
        
        // append the span inside the H1
        element.appendChild(newSpan);
   
        // TODO: 
        // at this point before checking which lines each piece of text are on i need to add whatever left/right padding or margin will eventually be added to the spans
        // otherwise we will potentially mis-calculate how many spans can fit on one line
        // especially in a situation where we have quite a lot of left / right padding
        // this could be an issue to calculate especially if we have different spacing at different breakpoints
        
        // I would ideally like to send in the padding value dynamically ... but for now:
        // Add the maximum padding value the spans could have (20px + 20px = 40px) as padding on the H1 parent first, then remove it later after we've done all the position calculations. 
        
        element.style.paddingLeft = "20px";
        element.style.paddingRight = "20px";
        
        // Create an Index value, which stores the current element's distance from the top of the parent 
        // elements with the same Index value notify us that they are on the same line of text
        // offsetTop = the number of pixels from the top of the closest relatively positioned parent element
        // scrollTop = gets the number of pixels that an element's content is scrolled vertically.  
        var index = newSpan.offsetTop - newSpan.scrollTop;
        
        // log each span's distance from the top  
        // console.log("index value - distance of current span from top of nearest relative positioned parent after added inside H1 (inc padding/margin etc.) =", index);
  
        // log what spanSections[index] value is at this point
        // It should return all the words that are now on the current line of text
        // console.log("spanSections[index] before newSpan textcontent added =", spanSections[index]);
        
        // if the spanSections index value is equal to 'undefined' make it an empty value instead
        if (spanSections[index] === undefined){
          spanSections[index] = '';
        };
        
        // use the Index value to decide which spans to merge together (ones with the same value get merged)
         spanSections[index] += newSpan.textContent;
        
        // log what spanSections[index] is at this point
        // console.log("spanSections[index] after newSpan textcontent added =", spanSections[index]);
        
        // At this point each seperate word is in it's own span with a trailing whitespace
        // Clear the original elements text content
        element.textContent = '';
        
        // TO DO: running a loop inside a loop???
        // Should i use Array.prototype.forEach.call instead then?
        
        // now re-populate the element with the newly merged spans
        for (var i = 0; i < spanSections.length; i++){
          if( spanSections[i] !== undefined ){
            // .trim removes the whitespace at the start / end of each span
            var spanText = spanSections[i].trim();
            var newNewSpan = document.createElement('span');
            // add the text content and send the newly merged spans into the H1
            newNewSpan.textContent = spanText;
            element.appendChild(newNewSpan);
          }
        }
        
      });
      
      // remove padding added to the parent in the loop above (it was added to aid from-top calculations)
      // so that the spans all have the correct space again
      if (element.style.removeProperty) {
        element.style.removeProperty('padding-left');
        element.style.removeProperty('padding-right');
      } else {
        element.style.removeAttribute('padding-left');
        element.style.removeAttribute('padding-right');
      };
      // grab all the injected spans
      var injectedSpan = element.getElementsByTagName('span');
      // loop through each span and add our CSS class  
      Array.prototype.forEach.call(injectedSpan, function(el) {
        el.classList.add('split-item');
      });     
    };
    
    
    /**
     * The window.onresize function
     * This will only ever be run after we have already done _splitMe on all the captions
     * So at this point they all already have spans inside
     * Here we need to select all captions then remove their inner spans
     * and re-insert the original content
     * To be left with just the H1 and the original text inside it
     * Then we can run _splitMe() again;
     * TODO: Could I just save the original textContent in a var and re-insert it here instead?
     *
     * @private
     * @returns {function}
     */
    
    // TODO: add a deboucing function in here to make this more performnt and make sure it runs eveytime we move through a breakpoint
    
    var _resize = function() {
  
      console.log("/// RESIZE RAN ///") 
      
      // if the media query hasnt changed, do nothing
      if (!_checkIfMQChanged()){ return; }
  
      // Otherwise for each [data-js="split-me"] element
      for (var i = 0; i < resizeable_elements.length; i++) {
        var el = resizeable_elements[i];
        console.log('Value of "el" in _resize() =', el);
    
        // empty the element
        el.innerHTML = "";
        // send in the original text stored in the array
        var orig = origTextArray[i];
        el.textContent = orig;
  
        _splitMe(el);
      }
      
    };
    
    
    /**
     * Initialise the SplitMe script
     *
     * @public
     * @returns {function}
     */
    var init = function(options) {  
      // override the default config
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          config[prop] = options[prop];
        }
      };
      // Do a setTimeout on the split-me function to make sure all the necessary DOM elements have loaded first
      setTimeout(function () {
        // run _splitme immediately on every [data-js="split-me"] element
       Array.prototype.forEach.call(document.querySelectorAll(config.selector), function (el, i) {
          console.log('split me run immediately');
          _splitMe(el);
        });
      }, 1500);
      
     //  _resize via a debouncing function on resize of the window
      window.onresize = function() {
        _debouncer()
      }
     // window.addEventListener('resize', _resize); 
    };
    
    // Efficient function using debouncing
    ////////////////////////////////////////////////
    var _debouncer = debounce(function() {
      // The functions to fire at window.onresize
      _resize(); 
    }, 200);
    
    
    // Debouncing helper function
    ////////////////////////////////////////////
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };
    
    return {
      init: init
    }
  })();
  
  // init the function, and send in some options
  splitText.init({
      selector: '[data-js="split-me"]'
  });
  