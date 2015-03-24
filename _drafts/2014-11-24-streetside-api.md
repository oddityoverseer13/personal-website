---
layout: post
title:  "Bing Streetside API"
date:   2014-11-24 15:30:00
tags: bing streetside api
---

Through the development of my senior project, I got the chance to explore Bing's Streetside API. Although it's a relatively straightforward API, they haven't developed any libraries for accessing it, nor have they released any good documentation on how it's structured. So, I thought I'd share what I've learned.

*NOTE: From what I understand, the Streetside API was built to be a public API, but there might be some usage restrictions that I'm not aware of.*

Before I get to the details, there's a few terms I want to make clear.

**Cube** - This is a set of images making up the front, back, left, right, top, and bottom of a cube. At each spot that the streetside vehicle takes a "picture", it's actually taking a set of pictures that make up this cube.
**Zoom level** - This is an indicator of what level of detail the images are at. The lowest level is 0, and the highest is 4. As an example, you can think of a storefront. At level 0, the entire storefront (and perhaps neighboring storefronts) could be captured in one 256x256 image. At level 4, one image might only include the top half of the front doorway.

GetBubbles
----------
The first step in accessing the Streetside imagery is getting a list of what cubes are available for a given area. To access that, you can use the GetBubbles API. The basic URL structure for GetBubbles is:

`http://dev.virtualearth.net/mapcontrol/HumanScaleServices/GetBubbles.ashx?c=1&n=NORTH&s=SOUTH&e=EAST&w=WEST&jsCallback=CALLBACK`

The main parameters here are **NORTH**, **SOUTH**, **EAST**, and **WEST**. Those make up a bounding box for an geographical area. The final parameter is **CALLBACK**, which indicates a [JSONP](http://en.wikipedia.org/wiki/JSONP) callback function.

So, a finished URL, with the params filled in, looks like:

`http://dev.virtualearth.net/mapcontrol/HumanScaleServices/GetBubbles.ashx?c=1&n=37.80301&s=37.80101&e=-122.41822&w=-122.42022&jsCallback=myCallbackfunction`

Given those paramenters, when you call send a GET request to the URL, your callback function will recieve a JSON object, structured like this:

````json
[
    {
        elapsed: 0.1620492
    },
    {
        id: 502302905,
        la: 37.802008,
        lo: -122.419212,
        al: 48.565,
        ro: -2.825,
        pi: -8.535,
        he: 97.598,
        bl: "",
        ml: 4,
        ne: 513938862,
        pr: 517820258,
        nbn: [ ],
        pbn: [ ],
        ad: "1070",
        rn: [
            {
                cs: "DEFAULT",
                nms: [
                "Lombard St"
                ]
            },
            {
                cs: "",
                nms: [
                "Lombard St"
                ]
            },
            {
                cs: "en",
                nms: [
                "Lombard St"
                ]
            }
        ],
        cd: "3/7/2014 8:11:59 PM"
    },
    ...
]
````

In the first object in the array, you get the elapsed time it took to return the data. The remaining objects are meta data about the cubes in the given bounding box. In each object, there are several useful key/value pairs. The most useful key/value pair obtained from here is the **id**, which indicates the id of that Streetside cube, which we'll be using in the next part of the API.

The only other data I am using is **la** and **lo**, which indicate the latitude and longitude of the cube.

Streetside Images
-----------------
Once you have an cube **id**, you're ready to start getting the images for that cube. The Streetside image URL structure is:

`http://ak.t1.tiles.virtualearth.net/tiles/hs**NUMBER**.jpg?g=2981&n=z`

An couple example URLs would be:

````
http://ecn.t1.tiles.virtualearth.net/tiles/hs013133002020232102.jpg?g=2981&n=z
http://ecn.t1.tiles.virtualearth.net/tiles/hs0131330020202321023.jpg?g=2981&n=z
http://ecn.t1.tiles.virtualearth.net/tiles/hs01313300202023210230.jpg?g=2981&n=z
http://ecn.t1.tiles.virtualearth.net/tiles/hs013133002020232102302.jpg?g=2981&n=z
http://ecn.t1.tiles.virtualearth.net/tiles/hs0131330020202321023023.jpg?g=2981&n=z
````

The corresponding Streetside images are:

<style>
img.streetside {
	height: 150px;
	width: 150px;
}
</style>
<img class="streetside" src="http://ecn.t1.tiles.virtualearth.net/tiles/hs013133002020232102.jpg?g=2981&n=z" />
<img class="streetside" src="http://ecn.t1.tiles.virtualearth.net/tiles/hs0131330020202321023.jpg?g=2981&n=z" />
<img class="streetside" src="http://ecn.t1.tiles.virtualearth.net/tiles/hs01313300202023210230.jpg?g=2981&n=z" />
<img class="streetside" src="http://ecn.t1.tiles.virtualearth.net/tiles/hs013133002020232102302.jpg?g=2981&n=z" />
<img class="streetside" src="http://ecn.t1.tiles.virtualearth.net/tiles/hs0131330020202321023023.jpg?g=2981&n=z" />



Now, this is where the API get's a little complex. The **NUMBER** param can be broken up into a few parts. 

The first 16 digits are a base4 version of the cube **id**. So, from the data we got from GetBubbles above, we have an id of 502302905. In base4 (front padded with zeros to a length of 16), that's 0131330020202321. 

The next two digits indicate the direction of the image. 01 is the front facing image, 02: right, 03: back, 10: left, 11: up, 12: down. Yes, you read that right: at each position, the car takes an image facing down, and another facing up. Those are only really used to get the full effect of being there; otherwise, you wouldn't be able to look up in the image.

Finally, comes the most confusing part of the number. This is the part that indicates how much detail (how high of resolution) you want. As you can see, in the example images above, each "zoom level" gives more detail. To be precise, it gives 4x as much detail.

Now, the way this part of the number is formated is [[[[zoom4]zoom3]zoom2]zoom1]. By that, I mean that each digit is optional, and they build up right-to-left. So, if you want the level detail at zoom 1, you'd only include one digit. For zoom level 2, you'd include a second digit, to the left of the first, and so on.

A picture is worth 1000 words, so here it is:

