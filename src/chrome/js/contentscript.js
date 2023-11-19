


var mouseGesture = {
    mouse_info: {
        cmd: "",
        last: "",
        url: "",
        x: 0,
        y: 0
    },
    
    init: function ()
    {
        var that = this;
        var root = document.documentElement;
      
        document.documentElement.addEventListener("contextmenu", function (e)
        {  
            DBG_MSG("mouseGesture::contextmenu=" + e.button + ", target=" + e.target.href);
            
            if (mouseGesture.mouse_info.cmd != "")
            {
                e.preventDefault();
                e.stopPropagation();
                
                root.setAttribute("data-cancelmenu", "on");
                
                setTimeout(function ()
                {
                    root.removeAttribute("data-cancelmenu");
                }, that.dbclicktime);
            }
        }, false); 
        
        window.addEventListener("mousedown", function (e)
        {
            //DBG_MSG("mouseGesture::mousedown=" + e.button + ", x=" + e.screenX + ", y=" + e.screenY);
            DBG_MSG("mouseGesture::mousedown=target=" + e.target.href + ", tagName=" + e.target.tagName);
            DBG_MSG("mouseGesture::mousedown=URL=" + e.target.parentNode.href + ", tagName=" + e.target.parentNode.tagName + ", e.srcElement=" + e.srcElement.baseURI);
          
            if (e.button !== 2) return;
            
            chrome.runtime.sendMessage({ msg: "wakeup" }, function(resp) { });
            
            mouseGesture.mouse_info.cmd = "";
            mouseGesture.mouse_info.last = "";
            if (e.target.tagName.toLowerCase() === 'a')
            {
                mouseGesture.mouse_info.url = e.target.href;
            }
            else if (e.target.parentNode.tagName.toLowerCase() === 'a')
            {
                mouseGesture.mouse_info.url = e.target.parentNode.href;
            }
            else
            {
                mouseGesture.mouse_info.url = "chrome://newtab";
            }
            mouseGesture.mouse_info.x = e.screenX;
            mouseGesture.mouse_info.y = e.screenY;
            
        }, false);
        
        window.addEventListener("mousemove", function (e)
        {
            DBG_MSG("mouseGesture::mousemove=" + e.button + ", x=" + e.screenX + ", y=" + e.screenY + ", target=" + e.target.href + ", tagName=" + e.target.tagName + ", URL=" + e.target.parentNode.href + ", tagName=" + e.target.parentNode.tagName + ", e.srcElement=" + e.srcElement.baseURI + ", tagName=" + e.srcElement.baseURI.tagName);

 //           if (e.button !== 2) {
 //               DBG_MSG("mouseGesture::mousemove=e.button !== 2");
 //               return;
 //           }
            
            if ((mouseGesture.mouse_info.x - e.screenX) > 16)
            {
                if (mouseGesture.mouse_info.last != "L")
                {
                    DBG_MSG("mouseGesture::mousemove=L");
                    mouseGesture.mouse_info.cmd += "L";
                    mouseGesture.mouse_info.last = "L";
                }
                mouseGesture.mouse_info.x = e.screenX;
                mouseGesture.mouse_info.y = e.screenY;
            }
            
            if ((mouseGesture.mouse_info.x - e.screenX) < -16)
            {
                if (mouseGesture.mouse_info.last != "R")
                {
                    DBG_MSG("mouseGesture::mousemove=R");
                    mouseGesture.mouse_info.cmd += "R";
                    mouseGesture.mouse_info.last = "R";
                }
                mouseGesture.mouse_info.x = e.screenX;
                mouseGesture.mouse_info.y = e.screenY;
            }
            
            if ((mouseGesture.mouse_info.y - e.screenY) > 16)
            {
                if (mouseGesture.mouse_info.last != "U")
                {
                    DBG_MSG("mouseGesture::mousemove=U");
                    mouseGesture.mouse_info.cmd += "U";
                    mouseGesture.mouse_info.last = "U";
                }
                mouseGesture.mouse_info.x = e.screenX;
                mouseGesture.mouse_info.y = e.screenY;
            }
            
            if ((mouseGesture.mouse_info.y - e.screenY) < -16)
            {
                if (mouseGesture.mouse_info.last != "D")
                {
                    DBG_MSG("mouseGesture::mousemove=D");
                    mouseGesture.mouse_info.cmd += "D";
                    mouseGesture.mouse_info.last = "D";
                }
                mouseGesture.mouse_info.x = e.screenX;
                mouseGesture.mouse_info.y = e.screenY;
            }
        }, false);

        window.addEventListener("mouseup", function (e)
        {
            
            //DBG_MSG("mouseGesture::mouseup=" + e.button + ", target=" + e.target.href);
            DBG_MSG("mouseGesture::mouseup=" + e.button + ", url=" + mouseGesture.mouse_info.url);
            DBG_MSG("mouseGesture::mouseup=" + e.button + ", baseURI=" + e.srcElement.baseURI);
            DBG_MSG("cmd=" + mouseGesture.mouse_info.cmd);
            
            if (e.button !== 2) return;

            switch (mouseGesture.mouse_info.cmd)
            {
            
                case "UD":
                {
                    reloadCurrentTab ();
                }
                break;
                
                case "UDU":
                {
                    superReloadCurrentTab ();
                }
                break;
                
                case "DR":
                {
                    closeCurrentTab ();
                }
                break;
                
                case "L":
                {
                    backHistory ();
                }
                break;
                
                case "R":
                {
                    forwardHistory ();
                }
                break;

                case "D":
                {
                    createNewTab(mouseGesture.mouse_info.url);
                }
                break;

                case "DU":
                {
                    createNewTabBG(e.srcElement.baseURI);
                }
                break;
            }
            
        }, false);

        chrome.runtime.sendMessage({ msg: "wakeup" }, function(resp) { });
    }
};

function reloadCurrentTab()
{
	location.reload();
}
function superReloadCurrentTab()
{
	location.reload(true);
}

function backHistory()
{
    var wnd = window;

    if (parent != window)
    {
		wnd = parent.window;
	}
	wnd.history.back();
}

function forwardHistory()
{
    var wnd = window;

    if (parent != window)
    {
		wnd = parent.window;
    }

	wnd.history.forward();
}

function createNewTab(url)
{
    chrome.runtime.sendMessage({ tab: "newtab", url: url });
}

function createNewTabBG(url)
{
    chrome.runtime.sendMessage({ tab: "newtabbg", url: url });
}

function closeCurrentTab()
{
    chrome.runtime.sendMessage({tab:"closectab"});
}
function DBG_MSG(msgs)
{
    chrome.runtime.sendMessage({ dbg: "console", msg: msgs });
}
mouseGesture.init();
