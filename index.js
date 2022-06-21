const { Client, Intents } = require('discord.js');
const DiscordJS = require('discord.js');
const dotenv = require('dotenv');
const { PythonShell } = require('python-shell');
// const pd = require('node-pandas');
// const scipy = require('scipy');
const svgToImg = require("svg-to-img");
const canvas = require("canvas");
const image = canvas.Image;
const { agnes } = require('ml-hclust');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const d3 = require('d3');
const fs = require('fs');
const xmlserializer = require('xmlserializer');

global.document = new JSDOM().window.document;
const body = d3.select(document.querySelector("body"));

// import * as d3 from 'd3';
// const d3 = await import("d3");
// import * as d3 from "https://cdn.skypack.dev/d3@7";
// const div = d3.selectAll("div");
const { MessageEmbed } = require('discord.js');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
var admin = require("firebase-admin");

var serviceAccount = require("/app/discord-valorant-matching-firebase-adminsdk-9gsja-02db5924bd.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://discord-valorant-matching-default-rtdb.firebaseio.com"
});

const db = getFirestore();

var optionsPy = {
    mode: 'text',
    pythonPath: '/usr/bin/python3.8',
    pythonOptions: ['-u'],
    scriptPath: '/app/',
    args: ['test']
}

dotenv.config();

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function runpyshell(id) {
    optionsPy = {
        mode: 'text',
        pythonPath: '/usr/bin/python3.8',
        pythonOptions: ['-u'],
        scriptPath: '/app/',
        args: [id]
    }

    const { success, err = '', results } = await new Promise(
        (resolve, reject) =>
        {
            PythonShell.run('search.py', optionsPy,
                function (err, results)
                {
                    if (err)
                    {
                        reject({ success: false, err });
                        return;
                    }

                    console.log('PythonShell results: %j', results);

                    resolve({ success: true, results });
                }
            );
        }
    );
    return results;
}

function dendrogram(data, options = {}) {
    const {
        width: width = 420,
        height: height = 320,
        hideLabels: hideLabels = false,
        paddingBottom: paddingBottom = hideLabels ? 20 : 80,
        innerHeight = height - paddingBottom,
        innerWidth = width - 10,
        paddingLeft = 30,
        h: cutHeight = undefined,
        yLabel: yLabel = "↑ Height",
        colors: colors = d3.schemeTableau10,
        fontFamily: fontFamily = "Inter, sans-serif",
        linkColor: linkColor = "grey",
        fontSize: fontSize = 10,
        strokeWidth: strokeWidth = 1
    } = options;
  
    const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, innerHeight])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    
    var clusterLayout = d3.cluster().size([width - paddingLeft * 2, innerHeight]);
  
    const root = d3.hierarchy(data);
    const maxHeight = root.data.height;
  
    const yScaleLinear = d3
        .scaleLinear()
        .domain([0, maxHeight])
        .range([hideLabels ? innerHeight - 35 : innerHeight, 0]);
  
    const yAxisLinear = d3.axisLeft(yScaleLinear).tickSize(5);
  
    function transformY(data) {
        const height = hideLabels ? innerHeight - 15 : innerHeight;
        return height - (data.data.height / maxHeight) * height;
    }
  
    // traverse through first order children and assign colors
    if (cutHeight) {
        let curIndex = -1;
        root.each((child) => {
            if (
                child.data.height <= cutHeight &&
                child.data.height > 0 &&
                child.parent &&
                !child.parent.color
            ) {
                curIndex++;
                child.color = colors[curIndex];
            } else if (child.parent && child.parent.color) {
                child.color = child.parent.color;
            }
        });
    }
  
    clusterLayout(root);
  
    // y-axis
    svg
        .append("g")
        .attr("transform", `translate(0, ${hideLabels ? 20 : 0})`)
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${paddingLeft},${hideLabels ? 20 : 0})`)
        .call(yAxisLinear)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
            g
            .append("text")
            .attr("x", -paddingLeft)
            .attr("y", -20)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .style("font-family", fontFamily)
            .text(yLabel)
        )
        .selectAll(".tick")
        .classed("baseline", (d) => d == 0)
        .style("font-size", `${fontSize}px`)
        .style("font-family", fontFamily);
  
    // Links
    root.links().forEach((link) => {
        svg
            .append("path")
            .attr("class", "link")
            .attr("stroke", link.source.color || linkColor)
            .attr("stroke-width", `${strokeWidth}px`)
            .attr("fill", "none")
            .attr("transform", `translate(${paddingLeft}, ${hideLabels ? 20 : 0})`)
            .attr("d", elbow(link));
    });
  
    // Nodes
    root.descendants().forEach((desc) => {
      /*
      svg
        .append("circle")
        .classed("node", true)
        .attr("fill", desc.color)
        .attr("cx", desc.x)
        .attr("cy", transformY(desc))
        .attr("transform", `translate(${paddingLeft})`);
        .attr("r", 4);
      */
        if (desc.data.isLeaf && !hideLabels) {
            svg
            .append("text")
            //.attr("x", desc.x)
            .attr("dx", -5)
            .attr("dy", 3)
            .attr("text-anchor", "end")
            .style("font-size", `${fontSize}px`)
            .style("font-family", fontFamily)
            .attr(
                "transform",
                `translate(${desc.x + paddingLeft},${transformY(desc)}) rotate(270)`
            )
            .text(desc.name || desc.data.index);
        }
    });
  
    // Custom path generator
    function elbow(d) {
        return (
            "M" +
            d.source.x +
            "," +
            transformY(d.source) +
            "H" +
            d.target.x +
            "V" +
            transformY(d.target)
        );
    }
  
    console.log(svg);
    return svg.node();
}

function svg2jpeg(svgElement, sucessCallback, errorCallback) {
    var canvas = global.document.createElement('canvas');
    // canvas.width = svgElement.width.baseVal.value;
    // canvas.height = svgElement.height.baseVal.value;
    canvas.width = 200;
    canvas.height = 200;
    var ctx = canvas.getContext('2d');
    // var image = new Image;
    const image = global.document.createElement("img");
    image.onload = () => {
      // SVGデータをPNG形式に変換する
      ctx.drawImage(image, 0, 0, image.width, image.height);
      sucessCallback(canvas.toDataURL());
    };
    image.onerror = (e) => {
      errorCallback(e);
    };
    // SVGデータを取り出す
    var svgData = new xmlserializer.serializeToString(svgElement);
    // this.damageMap.nativeElement
    image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svgData);
    return image.src;
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
    const data = [{
        name: "search",
        description: "TRN上でvalorantの統計情報を検索します。",
        options: [
            {
                name: "name",
                description: "Valorantのゲーム内プレイヤ名を入力してください。",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: "tag",
                description: "Valorantのゲーム内TAG(#の後ろだけ)を入力してください。",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    }];
    await client.application.commands.set(data);
    console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
    console.log(interaction);

    if (!interaction.isCommand()) {
        return;
    }

    const { commandName, options } = interaction;

    if (interaction.commandName === 'search') {
        const name = options.getString('name');
        const tag = options.getString('tag');
        const id = name + '#' + tag;
        // const stats = await runpyshell(id);
        // const agents = stats[0];
        // const time = stats[1];
        const agents = ["a", "b", "c"];
        const time = [3, 2, 5];
        
        //#region for debug python
        /*
        let stats;
        
        optionsPy = {
            mode: 'text',
            pythonPath: '/usr/bin/python3.8',
            pythonOptions: ['-u'],
            scriptPath: '/app/',
            args: [id]
        }
        // optionsPy[args] = id;
        
        PythonShell.run('search.py', optionsPy, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
            stats = results;
        });
        await sleep(1200);
        */
       //#endregion

        
        let data = {};
        for (let i = 0; i < agents.length; i++) {
            data[agents[i]] = time[i];
        }
        const res = await db.collection('users').doc(id).set(data);
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
        // df = pd.DataFrame([data]);
        // console.log(df);

        const tree = agnes(data, {
            method: 'ward',
        })

        const testdata = [
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0.7, 0.79, 0.94, 1, 0.25, 0.57],
            [1, 1, 0, 1, 1, 1, 1, 0.96, 1, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0.7, 1, 1, 0, 0.21, 0.95, 1, 0.79, 0.7],
            [1, 0.79, 1, 1, 0.21, 0, 0.95, 1, 0.67, 0.79],
            [1, 0.94, 1, 1, 0.95, 0.95, 0, 1, 0.94, 0.94],
            [1, 1, 0.96, 1, 1, 1, 1, 0, 1, 1],
            [1, 0.25, 1, 1, 0.79, 0.67, 0.94, 1, 0, 0.69],
            [1, 0.57, 1, 1, 0.7, 0.79, 0.94, 1, 0.69, 0],
        ];
        
        
        const svgElement = dendrogram(testdata, { h: 0.5 });
        // const urldend = URL.createObjectURL(dend);
        // const image = await svgToImg.from(svg).toPng();
        console.log(svgElement); // object
        console.log(global.document);

        const jpeg = svg2jpeg(svgElement, function(data) {
            // data: JPEGのbase64形式データ（文字列）
            console.log(data);
        }, function(error) {
            // error: 何らかのエラーオブジェクト
            console.log(error);  
        })

        console.log(jpeg);

        

        
        /*
        fs.writeFileSync('out.svg', body.html(), (err) => {
            if (err) throw err;
            console.log('writing work correctly');
        });
        */

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        interaction.channel.send({ embeds: [exampleEmbed] });
        
        await interaction.reply({
            content: 'stats:' + agents + time,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);