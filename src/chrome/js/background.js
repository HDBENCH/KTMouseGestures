
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse)
{
    if (msg.msg === "wakeup")
    {
        sendResponse({ tabid: sender.tab.id });
        return;
    }

    sendResponse({});

    if (msg.dbg === "console")
    {
        var msg = msg.msg;
        console.log(msg);
    }
    else if (msg.tab == "closectab")
    {
        chrome.tabs.remove(sender.tab.id);
    }
    else if (msg.tab == "newtab")
    {
        var url = msg.url;
        openNewTab(url, true);
    }
    else if (msg.tab == "newtabbg")
    {
        var url = msg.url;
        openNewTab(url, false);
    }
    else
    {
    }

});    

function openNewTab(url, flg)
{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
    {
        var tab = tabs[0];
        if (url == "")
        {
            url = "chrome://newtab";
        }

        chrome.tabs.create({windowId: tab.windowId,active: flg,url: url });
    });
}





