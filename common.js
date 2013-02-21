ROOT_FAVORITES_FOLDER = 'Яндекс.Музыка Избранное';
FAVORITE_ARTISTS_FOLDER = 'Исполнители';
FAVORITE_ALBUMS_FOLDER = 'Альбомы';
FAVORITE_TRACKS_FOLDER = 'Треки';

function findNodeChildByName(node, name)
{
    res = null;
    for (i = 0; i < node.children.length; ++i) 
    {
        child = node.children[i]
        if (child.title == name)
        {
            res = child;
            break;
        }
    }

    return res;
}

function getChildFolder(parentNode, title, callback)
{
    childNode = findNodeChildByName(parentNode, title);

    if (childNode)
        callback(childNode);
    else
        chrome.bookmarks.create({'parentId': parentNode.id, 'title': title},  function (newFolder)
        {
            callback(newFolder);
        } );
}

function getFavoritesFolder(callback)
{
    chrome.bookmarks.getTree( function (tree) 
    {
        otherBookmarksNode = tree[0].children[1];
        getChildFolder(otherBookmarksNode, ROOT_FAVORITES_FOLDER, callback);
    });
}

function getCurrentTab(callback)
{
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabArray)
    {
        tab = tabArray[0];
        callback(tab);
    });
}

function checkGrandparent(node, callback)
{
    chrome.bookmarks.get(node.parentId, function(parentArray)
    {
        chrome.bookmarks.get(parentArray[0].parentId, function(grandparentArray)
        {
            callback(grandparentArray[0].title == ROOT_FAVORITES_FOLDER);
        });
    });
}

function checkThatBookmarkExistsInFavorites(url, callback)
{
    chrome.bookmarks.search(url, function (nodes)
    {
        for (i = 0; i < nodes.length; ++i) 
        {
            if (nodes[i].url == url)
            {
                checkGrandparent(nodes[i], callback);
                // TODO don't return but check for grandparent all items with equal rule
                // TODO since in general case there may be e.g. one bookmark inside our favorites and the other outside with the same url
                return;
            }
        }
        callback(false);
    });
}

function findBookmarkByUrl(url, callback)
{
    chrome.bookmarks.search(url, function (nodes)
    {
        for (i = 0; i < nodes.length; ++i) 
        {
            if (nodes[i].url == url)
            {
                callback(nodes[i]);
                return;
            }
        }
        callback(null);
    });
}