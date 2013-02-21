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

function fillPage(favoritesNode, subfolderName, destElementId)
{
    getChildFolder(favoritesNode, subfolderName, function (subfolderNode) 
    {
        // make copy of children array
        bookmarks = subfolderNode.children.slice(0);
        bookmarks.sort(compareBookmarks);

        linksHtml = '';
        prevStartingLetter = '';
        for (i = 0; i < bookmarks.length; ++i) 
        {
            // additional line between first letter groups
            if (prevStartingLetter != bookmarks[i].title[0])
                linksHtml += '<br>';

            linksHtml += constructLinkHtml(destElementId, i, bookmarks[i].url, bookmarks[i].title) + '<br>';

            prevStartingLetter = bookmarks[i].title[0];
        }
        document.getElementById(destElementId).innerHTML = linksHtml;

        for (i = 0; i < bookmarks.length; ++i) 
        {
            document.getElementById(destElementId + i).addEventListener('click', function(event)
            {
                getCurrentTab(function (tab)
                {
                    chrome.tabs.update(tab.id, {'url': event.target.getAttribute('href')});
                });
            });
        }
    });
}


getFavoritesFolder(function (favoritesNode)
{
    fillPage(favoritesNode, FAVORITE_ARTISTS_FOLDER, 'artists');
    fillPage(favoritesNode, FAVORITE_ALBUMS_FOLDER, 'albums');
    fillPage(favoritesNode, FAVORITE_TRACKS_FOLDER, 'tracks');
});

$(function()
{

    $('#slider-id').liquidSlider({
        responsive:false,
        slideEaseDuration: 400,
        continuous: false
    });

});
