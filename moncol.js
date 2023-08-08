var mobCount = 0;
var maxCount = 48;
var mobList = new Array();
var mobImageList = new Array();
var ui = new Array();

function init() {
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    var ui_src = ["resources/ui_none.png", //0
                "resources/ui_1star.png", //1
                "resources/ui_2star.png", //2
                "resources/ui_3star.png", //3
                "resources/ui_4star.png", //4
                "resources/ui_5star.png", //5
                "resources/ui_special.png", //6
                "resources/ui_event.png", //7
                "resources/ui_bg.png"]; //8

    var loadedCount = 0;

    function uiLoaded()
    {
        loadedCount++;
        if (loadedCount === ui_src.length)
        {
            redraw();
        }
    }

    for (var i = 0; i < ui_src.length; i++)
    {
        ui[i] = new Image();
        ui[i].src = ui_src[i];
        ui[i].onload = uiLoaded;
        if (ui[i].complete)
        {
            ui[i].onload();
        }
        else
        {
            ui[i].onload = uiLoaded;
        }
    }
}

function redraw()
{
    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    var count = mobCount * 1;
    var index = 0;

    canvas.width = ui[8].width;
    canvas.height = ui[8].height;
    ctx.drawImage(ui[8], 0, 0);

    for (let i = 0; i < 6; i++)
    {
        for (let j = 0; j < 8; j++)
        {
            if (count-- > 0)
            {
                drawMob(index++, j, i);
                continue;
            }
            ctx.drawImage(ui[0], 32 + j * 74, 52 + i * 74);
        }
    }
}

function drawMob(index, j, i)
{
    var target = mobList[index];

    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    var w, h;
    w = mobImageList[index].width;
    h = mobImageList[index].height;
    canvas.setAttribute("image-rendering", "pixelated");
    ctx.drawImage(mobImageList[index], 71 - Math.ceil(w/2) + j * 74, 91 - Math.ceil(h/2) + i * 74, w, h);
    ctx.drawImage(ui[target.star], 34 + j * 74, 54 + i * 74);
}

function drawMemo(memo)
{
    redraw();

    const canvas = document.getElementById("preview");
    const ctx = canvas.getContext("2d");

    ctx.font = "17px SeoulNamsan"; //https://www.seoul.go.kr/seoul/font.do
    ctx.fillStyle = "#eeff00";
    ctx.textAlign = "right";
    ctx.letterSpacing = "1px";
    //ctx.lineWidth = 0.1;
    ctx.strokeStyle = "#eeff00";

    ctx.fillText(memo, 635, 34, 525);
    ctx.fillText(memo, 635, 33, 525);
    //ctx.strokeText(memo, 640, 35, 525);
}

function addMobToList(mob)
{
    if (mobCount === maxCount) return;
    if (mob)
    {
        mobName = mob;
    }
    else
    {
        const text = document.getElementById("search");
        var mobName = text ? text.value : null
    }
    var target = db.find(e => e.name == mobName)
    if (target)
    {
        mobList.push(target);
        mobCount++;
    }
    else return;
    
    document.querySelector("#search").value = "";
    mob = new Image();
    mob.src = target.src.replace(".png", "_fix.png").replace("mob", "mob\\fix");

    var loadedCount = 0;

    function mobLoaded()
    {
        loadedCount++;
        if (loadedCount === 1)
        {
            mob.imageSmoothingEnabled = mob.oImageSmoothingEnabled = mob.mozImageSmoothingEnabled = mob.webkitImageSmoothingEnabled = false;
            mob.setAttribute("image-rendering", "pixelated");
            mobImageList.push(mob);
            redraw();
        }
    }

    mob.onload = mobLoaded;
    if (mob.complete)
    {
        mob.onload();
    }
    else
    {
        mob.onload = mobLoaded;
    }
}

function delMobToList()
{
    if (mobCount === 0) return;

    mobList.pop();
    mobImageList.pop();
    mobCount--;
    init();
}

function save()
{
    const canvas = document.getElementById("preview");
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.setAttribute("download", "monster_collection");
    link.click();
}

function reset()
{
    if (mobCount === 0) return;
    
    mobList.length = 0;
    mobImageList.length = 0;
    mobCount = 0;
    redraw();
}