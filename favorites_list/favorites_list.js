function compareBookmarks(bookmark1, bookmark2)
{
    if (bookmark1.title < bookmark2.title)
        return -1;
    else if (bookmark1.title > bookmark2.title)
        return 1;
    return 0;
}

function constructLinkHtml(idPrefix, index, url, title)
{
    return '<a id="'+ idPrefix + index + '" href="' + url + '" class="item-link">' + title + '</a>';
}

function initLiquidSlider()
{
    $('#slider-id').liquidSlider({
        responsive:false,
        slideEaseDuration: 400,
        continuous: false
    });
}

function fillPageFromBookmarkArray(bookmarkArray, destElementId)
{
    // make copy of children array
    var bookmarks = bookmarkArray.slice(0);
    bookmarks.sort(compareBookmarks);

    var linksHtml = '';
    var prevStartingLetter = '';
    for (var i = 0; i < bookmarks.length; ++i) 
    {
        // additional line between first letter groups
        if (prevStartingLetter != bookmarks[i].title[0])
            linksHtml += '<br>';

        linksHtml += constructLinkHtml(destElementId, i, bookmarks[i].url, bookmarks[i].title) + '<br>';

        prevStartingLetter = bookmarks[i].title[0];
    }
    document.getElementById(destElementId).innerHTML = linksHtml;

    for (var i = 0; i < bookmarks.length; ++i) 
    {
        document.getElementById(destElementId + i).addEventListener('click', function(event)
        {
            getCurrentTab(function (tab)
            {
                chrome.tabs.update(tab.id, {'url': event.target.getAttribute('href')});
            });
        });
    }
}

function fillPage(favoritesNode, subfolderName, destElementId, callback)
{
    getChildFolder(favoritesNode, subfolderName, function (subfolderNode) 
    {
        if (!subfolderNode.children || subfolderNode.children.length == 0)
            document.getElementById(destElementId).innerHTML = "<br>Здесь пока ничего нет :(";
        else
            fillPageFromBookmarkArray(subfolderNode.children, destElementId);

        if (callback)
            callback();
    });
}


$(function()
{
    getFavoritesFolder(function (favoritesNode)
    {
        fillPage(favoritesNode, FAVORITE_ARTISTS_FOLDER, 'artists');
        fillPage(favoritesNode, FAVORITE_ALBUMS_FOLDER, 'albums');
        fillPage(favoritesNode, FAVORITE_TRACKS_FOLDER, 'tracks', initLiquidSlider);
    });

});
