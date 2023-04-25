const { readFileSync } = require('fs');
const { dealStringToArr } = require('./util.js');
const { queryLabels, createLabel } = require('./octokit');

async function run() {
  try {
    const json = JSON.parse(readFileSync('./create.json'));
    const jsonTarget = JSON.parse(readFileSync('./delete.json'));

    const getOwner = json['get-owner'];
    const getRepo = json['get-repo'];
    const targetOwner = jsonTarget['target-owner'];
    const targetRepo = jsonTarget['target-repo'];
    const ignore = json['ignore'];

    const getLabels = await queryLabels(getOwner, getRepo);

    if (getLabels.length) {
      for (let i = 0; i < getLabels.length; i++) {
        let lable = getLabels[i];
        if (dealStringToArr(ignore).includes(lable.name)) {
          console.log(`[${lable.name}] is ignore!`);
          continue;
        }
        await createLabel(targetOwner, targetRepo, lable.name, lable.color, lable.description);
      }
    } else {
      console.log(`[提醒] 查询 ${getOwner}/${getRepo} labels 为空！`);
    }
    console.log(`Done!`);
  } catch (_e) {
    console.log(_e.message);
  }
}

run();
