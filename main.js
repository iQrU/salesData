'use strict';

const div = document.getElementById("data");
const foot = document.getElementById("foot");
const selector = document.querySelectorAll('.criteria');
let dataTree;
let fruit;

// 매출자료 가져오기!!

const xlr = new XMLHttpRequest();
const thisMonth = new Date().getMonth();
const thisYear = new Date().getFullYear();
const theDate = new Date().getDate();
let year = thisYear, month = thisMonth + 1;
if (theDate < 20) {
  month = (thisMonth + 11) % 12 + 1;
  month == 12 ? year-- : null;
}
let monthData = `/data/CKD Prevenar Sales data(${year}.${month < 10 ? "0" + month : month}).xls`;
xlr.open("GET", monthData);
xlr.overrideMimeType("text/xml");
xlr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    dataDealer.processXML(this.responseXML);
    dataTree = dataDealer.summerizer("Territory", "일자", "지역", "거래처명");
    fruit = dataDealer.sumReport;

    selector[0].length = 1;
    for (let i in dataDealer.clan) {
      for (let j = 0; j < dataDealer.clan[i].length; j++) {
        let opt = document.createElement("option");
        opt.value = dataDealer.clan[i][j];
        opt.innerHTML = dataDealer.clan[i][j];
        selector[0].appendChild(opt);
      }
    }

    makeCover();

    selector[0].addEventListener("change", function () {
      let idx = selector[0].selectedIndex;
      let territory = selector[0][idx].value;
      selector[1].length = 1;
      if (territory != "GH") {
        for (let i = 0; i < dataDealer.terrOrg[territory].length; i++) {
          let opt = document.createElement("option");
          opt.value = dataDealer.terrOrg[territory][i];
          opt.innerHTML = dataDealer.terrOrg[territory][i];
          selector[1].appendChild(opt);
          selector[1].onchange = reportDaily;
        }
      }
      reportDaily();
    });
  }
};
xlr.send();

const calendar = document.querySelector('.fa-calendar-alt');
const menuBox = document.createElement("div");
menuBox.setAttribute("class", "bubble");
document.body.appendChild(menuBox);
const menuWrap = document.createElement("div");
menuWrap.setAttribute("class", "wrap");
menuBox.appendChild(menuWrap);

const monthArray = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
for (let i = 0; i < thisYear - 2018; i++) {
  const yearTag = document.createElement("p");
  const year = thisYear - i;
  yearTag.setAttribute("class", "belt");
  yearTag.innerHTML = year + "년";
  menuWrap.appendChild(yearTag);
  const monthTag = document.createElement("div");
  monthTag.style.display = "flex";
  monthTag.style.flexWrap = "wrap";
  menuWrap.appendChild(monthTag);
  const lastMonth = i == 0 ? thisMonth : 11;
  const firstMonth = i == thisYear - 2019 ? 8 : 0;
  for (let j = lastMonth; j >= firstMonth; j--) {
    const month = monthArray[j];
    const monthBall = document.createElement("div");
    monthBall.setAttribute("class", "ball");
    monthBall.innerHTML = `<text id=${year + month}>${month}</text>`;
    monthTag.insertBefore(monthBall, monthTag.firstChild);

    const menu = document.getElementById(year + month);
    menu.onclick = function () {
      div.innerHTML = "", foot.style.display = "none";
      let ring = document.createElement("div");
      ring.setAttribute("class", "ring");
      div.appendChild(ring);
      monthData = "/data/CKD Prevenar Sales data(" + year + "." + (j > 8 ? (j + 1) : "0" + (j + 1)) + ").xls"
      xlr.open("GET", monthData);
      xlr.overrideMimeType("text/xml");
      xlr.send();
      menuBox.style.display = "none";
    }
  }
}
menuBox.style.display = "none";

calendar.onclick = function () {
  if (menuBox.style.display == "none") {
    menuBox.style.display = "block";
  } else {
    menuBox.style.display = "none";
  }
};
div.onclick = function() {
  menuBox.style.display = "none";
};
foot.onclick = function() {
  menuBox.style.display = "none";
};

let clip = document.querySelector('.fa-redo');
clip.onclick = makeCover;

function makeCover() {
  selector[0].selectedIndex = 0, selector[1].length = 1;
  div.innerHTML = "", foot.style.display = "none";
  const svgPath = {
    plus: `<svg xmlns="http://www.w3.org/2000/svg" class="far fa-plus-square" width="1em" height="1em" viewBox="0 0 1408 1408"><path fill="currentColor" d="M1152 672v64q0 14-9 23t-23 9H768v352q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23V768H288q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h352V288q0-14 9-23t23-9h64q14 0 23 9t9 23v352h352q14 0 23 9t9 23zm128 448V288q0-66-47-113t-113-47H288q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5T1120 1408H288q-119 0-203.5-84.5T0 1120V288Q0 169 84.5 84.5T288 0h832q119 0 203.5 84.5T1408 288z"/></svg>`,
    minus: `<svg xmlns="http://www.w3.org/2000/svg" class="far fa-minus-square" width="1em" height="1em"  viewBox="0 0 1408 1408"><path fill="currentColor" d="M1152 672v64q0 14-9 23t-23 9H288q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h832q14 0 23 9t9 23zm128 448V288q0-66-47-113t-113-47H288q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5T1120 1408H288q-119 0-203.5-84.5T0 1120V288Q0 169 84.5 84.5T288 0h832q119 0 203.5 84.5T1408 288z"/></svg>`
  };
  let coverData = {}, gradeData = dataDealer.summerizer("Territory", "Grade");
  let coverPage = document.createElement("div");
  coverPage.style.width = "100%";
  div.appendChild(coverPage);

  let localSum = 0;
  for (let i = 0; i < dataDealer.clan.local.length; i++) {
    let terr = dataDealer.clan.local[i];
    localSum += fruit[terr] ? fruit[terr].total : 0;
    coverData[terr] = {};
    for (let date in fruit[terr]) {
      for (let area in fruit[terr][date]) {
        if (area != "total") {
          coverData[terr][area] ?
            coverData[terr][area] += fruit[terr][date][area] : coverData[terr][area] = fruit[terr][date][area];
        }
      }
    }
  }

  for (let i = 0; i < dataDealer.clan.local.length; i++) {
    let terr = dataDealer.clan.local[i];
    let terrBox = document.createElement("div");
    terrBox.setAttribute("class", "line");
    coverPage.appendChild(terrBox);

    let title = document.createElement("div");
    terrBox.appendChild(title);
    title.innerHTML = `<span class="narrow" id=${terr}>${svgPath.plus}</span>
      ${terr}: ${fruit[terr] ? fruit[terr].total.toLocaleString() : 0}
      (${(fruit[terr] ? fruit[terr].total / localSum * 100 : 0).toFixed(1)}%)<br>`;

    let content = document.createElement("div");
    content.setAttribute("class", "has");
    terrBox.appendChild(content);
    if (terr == "others") {
      for (let area in coverData[terr]) {
        content.innerHTML += `<li class="item" id="${area}">${area}: ${coverData[terr][area]}
          (${(coverData[terr][area] / localSum * 100).toFixed(1)}%)</li>`;
      }
      for (let area in coverData[terr]) {
        let areaSales = document.getElementById(area);
        areaSales.addEventListener("click", function () {
          selector[0].value = terr;
          for (let area in coverData.others) {
            let opt = document.createElement("option");
            opt.innerHTML = area;
            selector[1].appendChild(opt);  
          }
          selector[1].value = area;
          reportDaily();
        });
      }
    } else {
      const area = dataDealer.terrOrg[terr];
      const color = ["red", "orange", "yellowgreen", "green", "skyblue", "blue", "purple", "violet", "pink", "gray", "brown"];

      for (let i = 0; i < area.length; i++) {
        let areaSales = coverData[terr][area[i]];
        content.innerHTML += `<li class="item" id="${area[i]}">${area[i]}: ${areaSales ? areaSales : 0}
          (${((areaSales ? areaSales : 0) / localSum * 100).toFixed(1)}%)</li>`;
      }

      for (let i = 0; i < area.length; i++) {
        let areaSales = document.getElementById(area[i]);
        areaSales.onclick = function () {
          selector[0].value = terr;
          for (let j = 0; j < area.length; j++) {
            let opt = document.createElement("option");
            opt.setAttribute("value", area[j]);
            opt.innerHTML = area[j];
            selector[1].appendChild(opt);
          }
          selector[1].value = area[i];
          reportDaily();
        };
      }

      let title = "🌈 Territory 내 지역별 비중 🌏";
      bakeDonut(coverData[terr], area, 340, 250, content, color, title);

      if (terr == "2306") {
        let gradeTitle = "⛳ Territory 내 등급별 비중 🎳";
        let gradeColor = { A: "red", B: "blue", C: "yellowgreen", D: "lightgrey" };
        bakeDonut(gradeData[terr], dataDealer.target, 340, 250, content, gradeColor, gradeTitle);
      }

    }

    let anchor = document.getElementById(terr);
    anchor.onclick = function () {
      if (content.classList.value == "has active") {
        anchor.innerHTML = `${svgPath.plus}`;
        title.style.color = "black", title.style.fontStyle = "normal", title.style.fontWeight = "normal";
      } else {
        anchor.innerHTML = `${svgPath.minus}`;
        title.style.color = "darkolivegreen", title.style.fontStyle = "italic", title.style.fontWeight = "bold";
      }
      content.classList.toggle('active');
    }
  }
  selector[1].onchange = reportDaily;

  if (document.querySelectorAll('.bubble')) {
    let menuBox = document.querySelectorAll('.bubble');
    for (let i = 0; i < menuBox.length; i++) {
      menuBox[i].style.display = "none";
    }
  }
}

function reportDaily() {
  div.innerHTML = "", foot.innerHTML = "", menuBox.style.display = "none";
  let idx = selector[0].selectedIndex, territory = selector[0][idx].value;
  let idx2 = selector[1].selectedIndex, ticket = selector[1][idx2].value;
  let myData = dataTree[territory];
  let total = 0, day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let date in myData) {
    let sum = 0;
    let unit = document.createElement("div");
    unit.setAttribute("class", "unit");
    div.insertBefore(unit, div.firstChild);
    let lid = document.createElement("div");
    lid.setAttribute("class", "lid");
    unit.appendChild(lid);
    let tempDate = new Date();
    tempDate.setFullYear(date.substr(0, 4) * 1, date.substr(5, 2) * 1 - 1, date.substr(8, 2) * 1);
    lid.innerHTML = date + " " + day[tempDate.getDay()].substr(0, 3) + ".";
    let belly = document.createElement("div");
    belly.setAttribute("class", "belly");
    unit.appendChild(belly);
    if (selector[1].selectedIndex) {
      let content = document.createElement("div");
      content.style.padding = "5px 10px 10px 15px";
      belly.appendChild(content);
      if (myData[date][ticket]) {
        for (let clinic in myData[date][ticket]) {
          content.innerHTML += ` ${clinic}: ${myData[date][ticket][clinic].toLocaleString()}` + "<br>";
          sum += myData[date][ticket][clinic];
        }
      } else {
        content.innerHTML = `💤 💤 💤`;
      }
      let bottom = document.createElement("div");
      bottom.setAttribute("class", "bottom");
      belly.appendChild(bottom);
      bottom.innerHTML += `total: ${sum.toLocaleString()}/${fruit[territory][date].total.toLocaleString()}
        (${(sum / fruit[territory][date].total * 100).toFixed(1)}%)` + "<br>";
    } else {
      for (let ticket in myData[date]) {
        belly.innerHTML += `<p class="belt">${ticket}</p>`;
        let content = document.createElement("div");
        content.style.padding = "5px 10px 10px 15px";
        belly.appendChild(content);
        for (let clinic in myData[date][ticket]) {
          content.innerHTML += ` ${clinic}: ${myData[date][ticket][clinic].toLocaleString()}` + "<br>";
          sum += myData[date][ticket][clinic];
        }
      }
      let bottom = document.createElement("div");
      bottom.setAttribute("class", "bottom");
      belly.appendChild(bottom);
      if (dataDealer.clan.local.indexOf(territory) != -1) {
        let terrSum = 0;
        for (let i = 0; i < dataDealer.clan.local.length; i++) {
          let terr = dataDealer.clan.local[i];
          fruit[terr] ? fruit[terr][date] ? terrSum += fruit[terr][date].total : terrSum += 0 : null;
        }
        bottom.innerHTML += `total: ${sum.toLocaleString()}/${terrSum.toLocaleString()}
          (${(sum / terrSum * 100).toFixed(1)}%)` + "<br>";
      } else {
        bottom.innerHTML += `total: ${sum.toLocaleString()}`;
      }
    }
    total += sum;
  }

  if (total == 0) div.innerHTML = "<br><p>ㅤ😂ㅤ 💤 💤 💤 ㅤ🙌</p><br><br>";

  let showIt = document.createAttribute("style");
  showIt.value = "display: block";
  foot.setAttributeNode(showIt);
  if (selector[1].selectedIndex) {
    foot.innerHTML = `Territory ${territory} 내 비중(${ticket}): ${total.toLocaleString()}/${fruit[territory].total.toLocaleString()}
      (${(total / fruit[territory].total * 100).toFixed(1)}%)` + "<br>";
  } else if (territory != "NIP" && territory != "도매") {
    let localSum = 0;
    for (let i = 0; i < dataDealer.clan.local.length; i++) {
      let terr = dataDealer.clan.local[i];
      localSum += fruit[terr] ? fruit[terr].total : 0;
    }
    if (territory == "GH") {
      foot.innerHTML = `${territory} 비중: ${total.toLocaleString()}/${(localSum + (fruit["GH"] ? fruit["GH"].total : 0)).toLocaleString()}
        (${(total / (localSum + (fruit["GH"] ? fruit["GH"].total : 0)) * 100).toFixed(1)}%)` + "<br>";
    } else {
      foot.innerHTML = `Territory ${territory} 비중: ${total.toLocaleString()}/${localSum.toLocaleString()}
        (${(total / localSum * 100).toFixed(1)}%)` + "<br>";
    }
  } else {
    foot.innerHTML = `${territory} 비중: ${total.toLocaleString()}/${fruit.Total.toLocaleString()}
     (${(total / fruit.Total * 100).toFixed(1)}%)`;
  }
}

function bakeDonut(dataDough, legendSet, trayWidth, trayHeight, parentDiv, palette, title) {

  const donutTray = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  donutTray.setAttribute("width", trayWidth), donutTray.setAttribute("height", trayHeight);
  parentDiv.appendChild(donutTray);

  const banner = document.createElementNS("http://www.w3.org/2000/svg", "text");
  banner.setAttribute("x", donutTray.width.baseVal.value / 20);
  banner.setAttribute("y", donutTray.height.baseVal.value / 7);
  banner.innerHTML = title;
  donutTray.appendChild(banner);

  const center = { x: donutTray.width.baseVal.value * 17 / 50, y: donutTray.height.baseVal.value * 3 / 5 };
  const radius = donutTray.height.baseVal.value / 3.3;
  let startX = center.x, startY = center.y - radius, endX, endY, portion = 0;

  if (!Array.isArray(legendSet)) {
    let legendArray = [];
    for (let item in legendSet) {
      legendArray.push(item);
    }
    legendSet = legendArray;
  }

  let wholeSum = 0;
  for (let i = 0; i < legendSet.length; i++) {
    let item = legendSet[i];
    wholeSum += dataDough[item] ? dataDough[item] : 0;
  }

  const unitNum = legendSet.length > 7 ? legendSet.length > 8 ? Math.ceil(legendSet.length / 2) : Math.ceil(legendSet.length / 2) + 1 : legendSet.length;
  let positionX, positionY;
  for (let i = 0; i < legendSet.length; i++) {
    let item = legendSet[i], itemValue = dataDough[item] ? dataDough[item] : 0;
    let share = itemValue / wholeSum;
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let largeArcFlag = share > 0.5 ? 1 : 0;
    let posiRad = portion + share * Math.PI;
    portion += 2 * Math.PI * share;
    endX = center.x + radius * Math.sin(portion), endY = center.y - radius * Math.cos(portion);

    path.setAttribute("fill", Array.isArray(palette) ? palette[i % palette.length] : palette[item]);
    path.setAttribute("stroke", "white");
    path.setAttribute("d", `M ${center.x} ${center.y} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`);
    startX = endX, startY = endY;
    donutTray.appendChild(path);

    if (share > 0.01) {
      let percent = document.createElementNS("http://www.w3.org/2000/svg", "text");
      percent.setAttribute("x", center.x - 10 + 1.2 * radius * Math.sin(posiRad)), percent.setAttribute("y", center.y + 5 - 1.2 * radius * Math.cos(posiRad));
      percent.setAttribute("font-size", `12px`);
      percent.innerHTML = `${(share * 100).toFixed(0)}%`;
      donutTray.appendChild(percent);
    }

    positionX = donutTray.width.baseVal.value * 3 / (legendSet.length > 7 ? 4.6 : 4.2) + 78 * Math.floor(i / unitNum);
    positionY = donutTray.height.baseVal.value * 3 / 5 + 12 - 20 * (unitNum / 2 - i % unitNum);

    donutTray.innerHTML +=
      `<circle cx=${positionX} cy=${positionY} r="4" fill=${Array.isArray(palette) ? palette[i % palette.length] : palette[item]}></circle>`;
    if (legendSet[i].length == 1) {
      donutTray.innerHTML += `<text x=${positionX + 10} y=${positionY + 4} font-size="10px" font-style="italic">${legendSet[i]} (${itemValue} / ${wholeSum})</text>`;
    } else {
      donutTray.innerHTML += `<text x=${positionX + 10} y=${positionY + 4} font-size="10px" font-style="italic">${legendSet[i].indexOf("/") != -1 ? legendSet[i].substr(3) : legendSet[i]}</text>`;
    }
  }

  let hole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  hole.setAttribute("cx", center.x), hole.setAttribute("cy", center.y);
  hole.setAttribute("r", radius * 3 / 5), hole.setAttribute("fill", "white");
  donutTray.appendChild(hole);

  if (legendSet[3] == "D") {
    donutTray.innerHTML += `<text x=${center.x - 36} y=${center.y - radius / 2 * Math.sin(Math.PI / 12)} font-size="9px" font-style="italic" font-weight="bold" fill="darkolivegreen">Target Share</text>`;
    donutTray.innerHTML += `<text x=${center.x - 25} y=${center.y + radius / 2 * Math.sin(Math.PI / 12)} font-size="18px" font-style="italic" font-weight="bold" fill="orange">${((1 - dataDough.D / wholeSum) * 100).toFixed(1)}%</text>`;
  } else {
    let territory;
    for (let terr in dataDealer.terrOrg) {
      if (dataDealer.terrOrg[terr] == legendSet) territory = terr;
    }
    donutTray.innerHTML += `<text x=${center.x - 40} y=${center.y + 7} font-size="18px" font-style="italic" font-weight="bold" fill="darkolivegreen">VAC${territory}</text>`;
  }

}

const addrDealer = {

  wideArea: ["서울", "부산", "인천", "대구", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"],
  metro: ["서울", "부산", "인천", "대구", "광주", "대전", "울산"],
  cities: ["고양시", "성남시", "수원시", "안산시", "안양시", "용인시", "청주시", "천안시", "전주시", "포항시", "창원시"],
  dong: {
    부산: { 연산동: "연제구" },
    인천: { 구월동: "남동구" },
    대전: { 봉명동: "유성구" },
    경기: { 호계동: "안양시 동안구", 권선동: "수원시 권선구", 세류동: "수원시 권선구", 초지동: "안산시 단원구", 상현동: "용인시 수지구", 동천동: "용인시 수지구", 이동면: "용인시 처인구", 대화동: "고양시 일산서구", 일산동: "고양시 일산서구", 탄현동: "고양시 일산서구", 사리현동: "고양시 일산동구" },
    충북: { 용암동: "청주시 상당구", 오창면: "청주시 청원구", 삼승면: "보은군", 원남리: "보은군" },
    충남: { 쌍용동: "천안시 서북구", 성정동: "천안시 서북구", 신부동: "천안시 동남구", 병천리: "천안시 동남구", 병천면: "천안시 동남구" },
    전북: { 송천동: "전주시 덕진구" },
    경남: { 제동리: "창원시 의창구", 대산면: "창원시 의창구", 팔용동: "창원시 의창구", 내서읍: "창원시 마산회원구" },
    제주: { 한림읍: "제주시" }
  },

  서울: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  부산: ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
  인천: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "옹진군"],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  경기: ["가평군", "고양시 덕양구", "고양시 일산동구", "고양시 일산서구", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시 분당구", "성남시 수정구", "성남시 중원구", "수원시 권선구", "수원시 영통구", "수원시 장안구", "수원시 팔달구", "시흥시", "안산시 단원구", "안산시 상록구", "안성시", "안양시 동안구", "안양시 만안구", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시 기흥구", "용인시 수지구", "용인시 처인구", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
  강원: ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
  충북: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시 상당구", "청주시 서원구", "청주시 청원구", "청주시 흥덕구", "충주시"],
  충남: ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시 동남구", "천안시 서북구", "청양군", "태안군", "홍성군"],
  전북: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시 덕진구", "전주시 완산구", "정읍시", "진안군"],
  전남: ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  경북: ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시 남구", "포항시 북구"],
  경남: ["거제시", "거창군", "고성군", "김해시", "남해군", "남해시", "밀양시", "사천시", "산청군", "양산시", "의령군", "장승포시", "진주시", "진해시", "창녕군", "창원시 마산합포구", "창원시 마산회원구", "창원시 성산구", "창원시 의창구", "창원시 진해구", "통영시", "하동군", "함안군", "함양군", "합천군"],
  제주: ["서귀포시", "제주시"],
  세종: [],

  getTicket: function (address) {
    //console.log(this.getDistrict(address), address, this.confirmDong(address), this.getArea(address));
    return this.getArea(address) + "/" + this.getDistrict(address);
  },

  getArea: function (address) {
    let area;
    let addrString = address.replace(/\s/g, "");
    let iniTwo = addrString.substring(0, 2), areaDouble;
    iniTwo == "경상" || iniTwo == "전라" || iniTwo == "충청" ?
      areaDouble = addrString.charAt(0) + addrString.charAt(2) :
      areaDouble = iniTwo;
    this.wideArea.indexOf(areaDouble) != -1 ?
      area = areaDouble :
      area = this.confirmArea(address);
    return area;
  },
  confirmArea: function (address) {
    let distName = address.match(/[가-힣]{2,3}[구군]{1}/);
    if (distName != "고성군") {
      for (let i = 0; i < this.wideArea.length - 1; i++) {
        for (let j = 0; j < this[this.wideArea[i]].length; j++) {
          if (this[this.wideArea[i]][j].indexOf(distName) != -1) {
            return this.wideArea[i];
          }
        }
      }
    } else {
      if (address.match(/[가-핳]{2}로/) == "동외로")
        return "경남";
    }
    distName = address.match(/[가-힣]{2,3}시/);
    for (let i = 0; i < this.wideArea.length - 1; i++) {
      for (let j = 0; j < this[this.wideArea[i]].length; j++) {
        if (this[this.wideArea[i]][j].indexOf(distName) != -1) {
          return this.wideArea[i];
        }
      }
    }
    return null;
  },

  getDistrict: function (address) {
    let district, startIdx, charNums;
    let addrString = address.replace(/\s/g, "");
    let area = this.getArea(address);
    if (this.metro.indexOf(area) != -1) {
      addrString.indexOf("특별시") == 2 || addrString.indexOf("광역시") == 2 ?
        startIdx = 5 :
        addrString.charAt(2) == "시" ?
          startIdx = 3 :
          this.wideArea.indexOf(addrString.substring(0, 2)) != -1 ?
            startIdx = 2 :
            startIdx = 0;
      addrString.substr(startIdx + 1, 3).indexOf("구") != -1 ?
        charNums = addrString.substr(startIdx + 1, 3).indexOf("구") + 2 :
        addrString.substr(startIdx + 1, 3).indexOf("군") != -1 ?
          charNums = addrString.substr(startIdx + 1, 3).indexOf("군") + 2 :
          charNums = 2;
    } else if (area != "세종") {
      addrString.charAt(1) == "남" || addrString.charAt(1) == "북" ?
        startIdx = 2 :
        addrString.indexOf("도") < 4 && addrString.indexOf("도") != -1 ?
          startIdx = addrString.indexOf("도") + 1 :
          this.wideArea.indexOf(addrString.substring(0, 2)) != -1 ?
            startIdx = 2 :
            startIdx = 0;
      this.cities.indexOf(addrString.substr(startIdx, 3)) != -1 ?
        charNums = addrString.substr(startIdx, 8).indexOf("구") + 1 :
        addrString.substr(startIdx + 1, 2).indexOf("군") == 1 ?
          charNums = 3 :
          addrString.substr(startIdx + 1, 3).indexOf("시") != -1 ?
            charNums = addrString.substr(startIdx + 1, 3).indexOf("시") + 2 :
            charNums = 2;
    } else {
      charNums = -1;
    }

    let regDist = addrString.substr(startIdx, charNums);
    charNums > 4 ? regDist = regDist.replace("시", "시 ") : null;
    const distList = this[area];
    const idx = distList.indexOf(regDist);

    idx != -1 ? district = distList[idx] :
      area == "인천" && regDist == "남구" ? district = "미추홀구" :
        charNums == -1 ? district = "세종시" :
          charNums != 0 ? district = this.confirmDist(distList, regDist, address) : null;

    if (!district) district = this.confirmDong(address);

    return district;
  },
  confirmDist: function (distList, regDist, address) {
    if (this.cities.indexOf(regDist.substr(0, 2) + "시") == -1 && distList && regDist.charAt(1) != "시") {
      for (let i = 0; i < distList.length; i++) {
        if (distList[i].indexOf(regDist.substr(0, 2)) == 0)
          return distList[i];
      }
      if (address.match(/[가-힣]{2}시/)) {
        if (this.cities.indexOf(address.match(/[가-힣]{2}시/)[0]) != -1) {
          return distList[distList.indexOf(address.match(/[가-힣]{2}시 [가-힣]{1,4}구/)[0])];
        } else {
          return distList[distList.indexOf(address.match(/[가-힣]{2,3}시/)[0])];
        }
      } else if ((address.match(/[가-힣]{1,3}구/))) {
        return distList[distList.indexOf(address.match(/[가-힣]{1,3}구/)[0])];
      }
    } else {
      let gu;
      if (this.cities.indexOf(regDist + "시") != -1) {
        address = address.replace(regDist, regDist + "시 ");
        gu = regDist + "시 " + address.match(/[가-힣]{1,4}구/);
      } else {
        gu = address.match(/[가-힣]{1,4}구/);
      }
      return distList[distList.indexOf(`${gu}`)];
    }
  },
  confirmDong: function (address) {
    let area = this.getArea(address);
    let dongName = address.match(/[가-힣]{2,3}[동리읍면]/);
    if (this[area].indexOf(this.dong[area][dongName]) != -1) {
      return this.dong[area][dongName];
    };
  }

};

const dataDealer = {

  terrOrg: {
    /*1301: ["경기/김포시", "경기/파주시", "경기/고양시 일산서구", "경기/고양시 일산동구"],
    1302: ["경기/부천시", "경기/고양시 덕양구", "인천/부평구", "인천/계양구", "인천/서구", "인천/중구", "인천/강화군"],
    1303: ["인천/남동구", "인천/미추홀구", "인천/연수구", "인천/동구", "서울/구로구", "경기/시흥시", "경기/안산시 상록구"],
    1304: ["서울/마포구", "서울/영등포구", "서울/은평구", "서울/동작구", "서울/양천구"],
    1305: ["서울/강북구", "서울/서대문구", "서울/성북구", "서울/용산구", "서울/종로구", "서울/중구", "서울/도봉구"],
    1306: ["서울/관악구", "서울/금천구", "서울/강서구", "경기/광명시", "경기/안양시 동안구", "경기/안양시 만안구"],
    1307: ["경기/안산시 단원구", "경기/안성시", "경기/평택시", "경기/화성시", "경기/오산시"],*/
    2301: ["서울/노원구", "경기/의정부시", "경기/남양주시", "경기/양주시", "경기/동두천시", "경기/연천군"],
    2302: ["서울/광진구", "서울/동대문구", "서울/성동구", "서울/중랑구", "경기/구리시", "경기/포천시", "경기/가평군"],
    2303: ["서울/강동구", "서울/송파구", "경기/하남시", "경기/광주시"],
    2304: ["서울/강남구", "서울/서초구", "경기/과천시", "경기/군포시", "경기/의왕시"],
    2305: ["경기/수원시 권선구", "경기/수원시 영통구", "경기/수원시 장안구", "경기/수원시 팔달구", "경기/용인시 기흥구", "경기/용인시 처인구", "경기/이천시", "경기/여주시", "경기/양평군"],
    2306: ["경기/성남시 분당구", "경기/성남시 수정구", "경기/성남시 중원구", "경기/용인시 수지구"],
    2307: ["강원/강릉시", "강원/고성군", "강원/동해시", "강원/삼척시", "강원/속초시", "강원/양구군", "강원/양양군", "강원/영월군", "강원/원주시", "강원/인제군", "강원/정선군", "강원/철원군", "강원/춘천시", "강원/태백시", "강원/평창군", "강원/홍천군", "강원/화천군", "강원/횡성군"],
    /*3301: ["충남/당진시", "충남/서산시", "충남/아산시", "충남/천안시 동남구", "충남/천안시 서북구", "충남/태안군", "대전/동구"],
    3302: ["대전/서구", "대전/중구", "충남/계룡시", "충남/공주시", "충남/금산군", "충남/논산시", "충남/보령시", "충남/부여군", "충남/서천군", "충남/예산군", "충남/청양군", "충남/홍성군", "충북/보은군", "충북/영동군", "충북/옥천군"],
    3303: ["세종/세종시", "대전/대덕구", "충북/청주시 상당구", "충북/청주시 서원구", "충북/청주시 청원구", "충북/청주시 흥덕구", "충북/충주시", "충북/제천시", "충북/괴산군", "충북/단양군", "충북/음성군", "충북/증평군", "충북/진천군"],
    3304: ["전북/전주시 덕진구", "전북/전주시 완산구", "전북/남원시", "전북/무주군", "전북/순창군", "전북/완주군", "전북/임실군", "전북/장수군", "전북/진안군", "대전/유성구"],
    3305: ["광주/북구", "전남/순천시", "전남/여수시", "전남/광양시", "전남/곡성군", "전남/구례군", "전남/담양군"],
    3306: ["광주/광산구", "전북/익산시", "전북/군산시", "전북/정읍시", "전북/김제시", "전북/부안군", "전북/고창군"],
    3307: ["광주/남구", "광주/동구", "광주/서구", "전남/강진군", "전남/고흥군", "전남/나주시", "전남/목포시", "전남/무안군", "전남/보성군", "전남/신안군", "전남/영암군", "전남/영광군", "전남/완도군", "전남/장성군", "전남/장흥군", "전남/진도군", "전남/함평군", "전남/해남군", "전남/화순군"],
    4301: ["대구/북구", "경북/구미시", "경북/안동시", "경북/칠곡군", "경북/예천군"],
    4302: ["대구/달서구", "대구/서구", "대구/달성군", "경북/문경시", "경북/김천시", "경북/상주시", "경북/고령군", "경북/성주군"],
    4303: ["대구/동구", "경북/포항시 남구", "경북/포항시 북구", "경북/경주시", "경북/영천시", "경북/영주시", "경북/울진군", "경북/영덕군", "경북/봉화군", "경북/청송군", "경북/영양군", "경북/울릉군"],
    4304: ["대구/수성구", "대구/중구", "대구/남구", "경북/경산시", "경북/의성군", "경북/청도군", "경북/군위군"],
    4305: ["경남/창원시 마산합포구", "경남/창원시 마산회원구", "경남/창원시 성산구", "경남/창원시 의창구", "경남/창원시 진해구", "경남/함양군", "경남/산청군"],
    4306: ["부산/영도구", "부산/사하구", "경남/거제시", "경남/통영시", "경남/진주시", "경남/사천시", "경남/고성군", "경남/남해군", "경남/하동군"],
    4307: ["부산/북구", "부산/동구", "경남/양산시", "경남/김해시"],
    4308: ["울산/남구", "울산/동구", "울산/중구", "울산/북구", "울산/울주군", "부산/기장군", "경남/밀양시", "경남/창녕군"],
    4309: ["부산/해운대구", "부산/사상구", "부산/수영구", "부산/금정구", "부산/남구", "부산/동래구"],
    4310: ["부산/연제구", "부산/서구", "부산/중구", "부산/강서구", "부산/부산진구", "경남/거창군", "경남/함안군", "경남/의령군", "경남/합천군"],
    6501: ["제주/제주시", "제주/서귀포시"],*/
    others: [],
    GH: ["(학)가톨릭대학교서울성모병원", "(학)카톨릭대학교여의도성모병원", "인천성모병원 (학)가톨릭대학교", "(학)가톨릭학원의정부성모병원", "(학)가톨릭대학교부천성모병원", "성빈센트병원(학)가톨릭학원가톨릭대학교", "카톨릭대학교은평성모병원"],
    NIP: [],
    도매: []
  },

  clan: {
    local: [/*"1301", "1302", "1303", "1304", "1305", "1306", "1307",*/ "2301", "2302", "2303", "2304", "2305", "2306", "2307", /*"3301", "3302", "3303", "3304", "3305", "3306", "3307", "4301", "4302", "4303", "4304", "4305", "4306", "4307", "4308", "4309", "4310", "6501",*/ "others"],
    GH: ["GH"],
    NIP: ["NIP"],
    도매: ["도매"]
  },

  target: {
    A: [10008115, 10008158, 10008196, 10008206, 10008226, 10008238, 10008315, 10008324, 10008376, 10008378, 10008384, 10008400, 10008404, 10010994, 10012037, 10012585, 10037118, 10042310, 10042469, 10044110, 10050941, 10054496],
    B: [10008179, 10008195, 10008235, 10008268, 10008284, 10008293, 10008403, 10011038, 10011072, 10011078, 10034710, 10034905, 10035787, 10035949, 10038724, 10038972, 10039176, 10046460, 10046917, 10050899, 10051268, 10055541, 10058466, 10060994, 10063493, 10064917],
    C: [10008178, 10008183, 10008188, 10008219, 10008291, 10008312, 10008380, 10010631, 10010952, 10011058, 10035474, 10035867, 10051457, 10059254],
    D: []
  },

  resultArray: [],
  header: [],
  sumReport: {},

  processXML: function (data) {
    let dataArray = [];
    let rows = data.getElementsByTagName("Row");
    for (let i = 0; i < rows.length; i++) {
      let rowArray = [];
      for (let j = 0; j < rows[i].childElementCount; j++) {
        rowArray.push(rows[i].children[j].textContent);
      }
      dataArray.push(rowArray);
    }

    let idx = dataArray[0].indexOf("주소"), idx2 = dataArray[0].indexOf("일자");
    dataArray[0].push("지역", "Territory", "Clan", "Period", "Grade");
    this.header = dataArray[0];
    for (let i = 1; i < dataArray.length; i++) {
      let address = dataArray[i][idx];
      let areaDist = addrDealer.getTicket(address);
      dataArray[i].push(areaDist);

      let territory = this.getTerr(dataArray[i]);
      dataArray[i].push(territory);
      for (let group in this.clan) {
        if (this.clan[group].indexOf(territory) != -1) dataArray[i].push(group);
      }

      let date = dataArray[i][idx2];
      let period = date.match(/-(\d{2})-/)[1] % 12 + 1 + "P";
      dataArray[i].push(period);

      let grade = this.getGrade(dataArray[i]);
      dataArray[i].push(grade);
    }
    this.resultArray = dataArray;
    //return dataArray;
  },

  getTerr: function (record) {
    let accountIdx = this.header.indexOf("거래처명");
    let refIdx = this.header.indexOf("구분");
    let ticketIdx = this.header.indexOf("지역");
    if (record[accountIdx].indexOf("보건") != -1 && record[accountIdx].indexOf("의원") == -1) {
      return "NIP";
    } else if (record[refIdx].indexOf("도매") != -1) {
      return "도매";
    } else if (this.terrOrg.GH.indexOf(record[accountIdx]) != -1) {
      return "GH";
    }
    for (let num in this.terrOrg) {
      if (this.terrOrg[num].indexOf(record[ticketIdx]) != -1) return num;
    }
    return "others";
  },

  getGrade: function (record) {
    let codeIdx = this.header.indexOf("거래처"), accountIdx = this.header.indexOf("거래처명");
    const gradeTag = { A: "red", B: "blue", C: "yellowgreen" };
    for (let grade in this.target) {
      if (this.target[grade].indexOf(record[codeIdx] * 1) != -1) {
        record[accountIdx] = `<font color=${gradeTag[grade]}><sup>•</sup></font>${record[accountIdx]}`;
        return grade;
      }
    }
    return "D";
  },

  summerizer: function (criteria1, criteria2, criteria3, criteria4) {
    let summeryObj = {};
    this.sumReport = {};
    let salesIdx = this.header.indexOf("매출량");
    let idx = this.header.indexOf(criteria1);
    let idx2 = this.header.indexOf(criteria2);
    let idx3 = this.header.indexOf(criteria3);
    let idx4 = this.header.indexOf(criteria4);
    for (let i = 1; i < this.resultArray.length; i++) {
      let salesVol = this.resultArray[i][salesIdx].replace(",", "") * 1;
      let item = this.resultArray[i][idx], item2 = this.resultArray[i][idx2], item3 = this.resultArray[i][idx3], item4 = this.resultArray[i][idx4];
      if (summeryObj[item]) {
        if (criteria2) {
          if (summeryObj[item][item2]) {
            if (criteria3) {
              if (summeryObj[item][item2][item3]) {
                if (criteria4) {
                  if (summeryObj[item][item2][item3][item4]) {
                    summeryObj[item][item2][item3][item4] += salesVol;
                    this.sumReport[item][item2][item3] += salesVol;
                    this.sumReport[item][item2]["total"] += salesVol;
                    this.sumReport[item]["total"] += salesVol;
                    this.sumReport["Total"] += salesVol;
                  } else {
                    summeryObj[item][item2][item3][item4] = salesVol;
                    this.sumReport[item][item2][item3] += salesVol;
                    this.sumReport[item][item2]["total"] += salesVol;
                    this.sumReport[item]["total"] += salesVol;
                    this.sumReport["Total"] += salesVol;
                  }
                } else {
                  summeryObj[item][item2][item3] += salesVol;
                  this.sumReport[item][item2] += salesVol;
                  this.sumReport[item]["total"] += salesVol;
                  this.sumReport["Total"] += salesVol;
                }
              } else if (criteria4) {
                summeryObj[item][item2][item3] = {};
                summeryObj[item][item2][item3][item4] = salesVol;
                this.sumReport[item][item2][item3] = salesVol;
                this.sumReport[item][item2]["total"] += salesVol;
                this.sumReport[item]["total"] += salesVol;
                this.sumReport["Total"] += salesVol;
              } else {
                summeryObj[item][item2][item3] = salesVol;
                this.sumReport[item][item2] += salesVol;
                this.sumReport[item]["total"] += salesVol;
                this.sumReport["Total"] += salesVol;
              }
            } else {
              summeryObj[item][item2] += salesVol;
              this.sumReport[item] += salesVol;
              this.sumReport["Total"] += salesVol;
            }
          } else if (criteria3 && criteria4) {
            summeryObj[item][item2] = {};
            summeryObj[item][item2][item3] = {};
            summeryObj[item][item2][item3][item4] = salesVol;
            this.sumReport[item][item2] = {};
            this.sumReport[item][item2][item3] = salesVol;
            this.sumReport[item][item2]["total"] = salesVol;
            this.sumReport[item]["total"] += salesVol;
            this.sumReport["Total"] += salesVol;
          } else if (criteria3) {
            summeryObj[item][item2] = {};
            summeryObj[item][item2][item3] = salesVol;
            this.sumReport[item][item2] = salesVol;
            this.sumReport[item]["total"] += salesVol;
            this.sumReport["Total"] += salesVol;
          } else {
            summeryObj[item][item2] = salesVol;
            this.sumReport[item] += salesVol;
            this.sumReport["Total"] += salesVol;
          }
        } else {
          summeryObj[item] += salesVol;
          this.sumReport["Total"] += salesVol;
        }
      } else {
        if (criteria2) {
          summeryObj[item] = {};
          if (criteria3) {
            summeryObj[item][item2] = {};
            this.sumReport[item] = {};
            if (criteria4) {
              summeryObj[item][item2][item3] = {};
              summeryObj[item][item2][item3][item4] = salesVol;
              this.sumReport[item][item2] = {};
              this.sumReport[item][item2][item3] = salesVol;
              this.sumReport[item][item2]["total"] = salesVol;
              this.sumReport[item]["total"] = salesVol;
              this.sumReport["Total"] ?
                this.sumReport["Total"] += salesVol :
                this.sumReport["Total"] = salesVol;
            } else {
              summeryObj[item][item2][item3] = salesVol;
              this.sumReport[item][item2] = salesVol;
              this.sumReport[item]["total"] = salesVol;
              this.sumReport["Total"] ?
                this.sumReport["Total"] += salesVol :
                this.sumReport["Total"] = salesVol;
            }
          } else {
            summeryObj[item][item2] = salesVol;
            this.sumReport[item] = salesVol;
            this.sumReport["Total"] ?
              this.sumReport["Total"] += salesVol :
              this.sumReport["Total"] = salesVol;
          }
        } else {
          summeryObj[item] = salesVol;
          this.sumReport["Total"] ?
            this.sumReport["Total"] += salesVol :
            this.sumReport["Total"] = salesVol;
        }
      }
    }
    return summeryObj;
  }
};

/*
let area = dataDealer.terrOrg[terr];
let color = ["red", "orange", "yellowgreen", "green", "skyblue", "blue", "purple"];
let canvas = document.createElement("canvas");
canvas.height = 220, canvas.width = 320;
canvas.setAttribute("style", "{width: 300px; height: 220px;}");
let context = canvas.getContext("2d");
let startRad = -0.5 * Math.PI;
context.fillStyle = "darkolivegreen";
context.font = "1.6em Lucida Grande";
context.fillText("🍩 Territory 내 지역별 비중 🍉", 20, 30);
for (let i = 0; i < area.length; i++) {
  let areaSales = coverData[terr][area[i]];
  //let portion = (areaSales? areaSales : 0) / report.local[terr];
  //let posiRad = startRad + (0.5 + portion) * Math.PI;
  content.innerHTML += `<li class="item" id="${area[i]}">${area[i]}: ${areaSales? areaSales : 0}
    (${((areaSales? areaSales : 0)/localSum * 100).toFixed(1)}%)</li>`;
  context.beginPath();
  context.arc(125, 130, 65, startRad, startRad + portion * 2 * Math.PI, areaSales > 0 ? false : true);
  context.lineTo(125, 130);
  context.fillStyle = color[i];
  context.fill();
  context.fillRect(235, (canvas.height + 50) / 2 - 23 * area.length / 2 + 23 * i, 7, 7);
  if(portion > 0.01) {
    context.fillStyle = "black";
    context.font = "1.2em Lucida Grande";
    context.fillText((portion * 100).toFixed(0) + "%", 116 + 80 * Math.sin(posiRad), 136 - 80 * Math.cos(posiRad));
  }
  context.font = "1em Lucida Grande";
  context.fillText(area[i].substr(3), 250, (canvas.height + 63) / 2 - 23 * area.length / 2 + 23 * i);
  context.closePath();
  startRad += portion * 2 * Math.PI;
}
content.appendChild(canvas);


let xhr = new XMLHttpRequest();
let accountHistory = {};
xhr.overrideMimeType("text/xml");
xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    dataDealer.processXML(this.responseXML);
    let accountSales = dataDealer.summerizer("거래처명", "일자");
    for (let account in accountSales) {
      if (accountHistory[account]) {
        for (let date in accountSales[account]) {
          accountHistory[account][date] = accountSales[account][date];
        }
      } else {
        accountHistory[account] = {};
        for (let date in accountSales[account]) {
          accountHistory[account][date] = accountSales[account][date];
        }
      }
    }
  }
};
for (let i = 0; i < 12; i++) {
  xhr.open("GET", "/data/CKD Prevenar Sales data(2021." + (i > 8 ? (i + 1) : "0" + (i + 1)) + ").xls", false);
  xhr.send();
}
//console.log(accountHistory);
*/

