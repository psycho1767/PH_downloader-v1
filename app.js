// const puppeteer = require("puppeteer");
// const axios = require("axios");
// const fs = require("fs");
// const fluentFFmpeg = require("fluent-ffmpeg");

// const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

// (async () => {
//   const ListOfLinks = [];
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   const url = "https://www.pornhub.com/view_video.php?viewkey=ph63922c2f04b29";

//   const regex = /viewkey=([a-zA-Z0-9]+)/;
//   const match = url.match(regex);

//   const viewkey = match[1];

//   console.log("start of code");
//   await page.goto(`https://www.pornhub.com/embed/${viewkey}`);

//   async function downloadSegment(link, segmentNumber) {
//     try {
//       const filePath = `./segment-${segmentNumber}.ts`;
//       const writer = fs.createWriteStream(filePath);

//       const downloadPromise = axios.get(link, { responseType: "stream" }).then((response) => {
//         return new Promise((resolve, reject) => {
//           response.data.pipe(writer);
//           writer.on("finish", resolve);
//           writer.on("error", reject);
//         });
//       });

//       await downloadPromise;

//       console.log(`download ${segmentNumber} done.`);
//       return true;
//     } catch (error) {
//       console.log(`Error downloading segment ${segmentNumber}: ${error.message}`);
//       try {
//         console.log(`try to download ${segmentNumber} `);
//         await downloadPromise;
//         console.log(`download ${segmentNumber} done.`);
//       } catch (error) {
//         return false;
//       }
//       return false;
//     }
//   }

//   async function AllLinks(first) {
//     const mytog = async () => {
//       let number = 1;
//       while (true) {
//         let headurl = String(first).replace(`seg-2`, `seg-${number}`);
//         try {
//           await axios.head(headurl);
//           ListOfLinks.push(headurl);
//           number++;
//         } catch (error) {
//           if (error.response && error.response.status === 404) {
//             break;
//           } else {
//             break;
//           }
//         }
//       }
//     };

//     await mytog();

//     if (!ListOfLinks.length) {
//       await mytog();
//     }

//     console.log("len list : " + ListOfLinks.length);

//     for (let i = 0; i < ListOfLinks.length; i++) {
//       const link = ListOfLinks[i];
//       try {
//         await downloadSegment(link, i);
//       } catch (error) {
//         console.log(`Failed to download segment ${i}: ${error.message}`);
//       }
//     }

//     await mergeSegments();
//   }

//   async function mergeSegments() {
//     const segments = ListOfLinks.map((_, index) => `./segment-${index}.ts`);

//     const fileListContent = segments.map((segment) => `file '${segment}'`).join("\n");
//     fs.writeFileSync("fileList.txt", fileListContent);

//     fluentFFmpeg()
//       .input("fileList.txt")
//       .inputOptions("-f", "concat", "-safe", "0")
//       .output("./output_video.mp4")
//       .on("end", () => {
//         console.log("Merging finished!");
//         cleanUp();
//       })
//       .run();
//   }

//   async function cleanUp() {
//     for (let i = 0; i < ListOfLinks.length; i++) {
//       fs.unlinkSync(`./segment-${i}.ts`);
//     }
//     fs.unlinkSync("fileList.txt");
//     process.exit();
//   }

//   async function getFirstApi(response) {
//     const url = await response.url();
//     if (String(url).includes("seg-2")) {
//       page.off("response", getFirstApi);
//       await browser.close();
//       console.log("get link");
//       AllLinks(url);
//     }
//   }

//   sleep(8000);

//   try {
//     const start = await page.$$(".mgp_playbackBtn.mgp_playIconOnReady.mgp_playPauseIconOnBuffer.mgp_playOnAutoplayFailed");
//     await start[0].click();
//     console.log("click of code");
//   } catch (error) {
//     console.log("error start");
//   }

//   page.on("response", getFirstApi);
//   await sleep(500000);
// })();

//  https://go2keep.com/media?m=64cd1ddd502f6

// const puppeteer = require("puppeteer");
// const fs = require("fs");
// const axios = require("axios");
// const path = require("path");

// async function downloadVideo(url, filename) {
//   const filePath = path.resolve(__dirname, filename);
//   const writer = fs.createWriteStream(filePath);

//   const response = await axios({
//     url,
//     method: "GET",
//     responseType: "stream",
//   });

//   response.data.pipe(writer);

//   return new Promise((resolve, reject) => {
//     writer.on("finish", resolve);
//     writer.on("error", reject);
//   });
// }

// const puppeteer = require("puppeteer");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
const port = 3000;

app.post("/api/getph", async (req, res) => {
  try {
    const { link } = req.body;

    const headers = {
      "access-control-allow-credentials": "true",
      "access-control-allow-methods": "*",
      "access-control-allow-origin": "*",
      "alt-svc": 'h3=":443"; ma=86400',
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: "https://downporn.net",
      referer: "https://downporn.net/",
      "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    };
    const formData = new FormData();
    formData.append("url", link);
    formData.append("info", "support");

    const request = await axios.post(
      "https://hubweb15.p2mate.com/analyze",
      formData,
      {
        headers,
      }
    );

    res.json({ formats: request.data.format });

    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // const url = link;

    // console.log("getting link : ", link);

    // const regex = /viewkey=([a-zA-Z0-9]+)/;
    // const match = url.match(regex);
    // await page.goto(`https://go2keep.com/media?m=${match}`);

    // console.log("go to page...");

    // const selector = ".dlbtn";
    // await page.waitForSelector(selector, { timeout: 120000 });

    // console.log("find for downlaod...");

    // const hrefs = await page.$$eval(selector, (elements) =>
    //   elements.map((el) => el.getAttribute("href"))
    // );

    // // for (const [index, href] of hrefs.entries()) {
    // //   console.log(`Downloading video ${index + 1}...`);
    // //   await downloadVideo(href, `video_${index + 1}.mp4`);
    // // }
    // res.json({ link: hrefs });

    // await downloadVideo(hrefs[0], `video_1.mp4`);
  } catch (error) {
    res.status(500).json({ message: error });
    console.error("Error:", error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
