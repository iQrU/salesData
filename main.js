'use strict';

let distObj = {
  서울: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  부산: ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "연수구", "영도구", "중구", "해운대구"],
  인천: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "옹진군"],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  경기: ["가평군", "고양시 덕양구", "고양시 일산동구", "고양시 일산서구", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시 분당구", "성남시 수정구", "성남시 중원구", "수원시 권선구", "수원시 영통구", "수원시 장안구", "수원시 팔달구", "시흥시", "안산시 단원구", "안산시 상록구", "안성시", "안양시 동안구", "안양시 만안구", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시 기흥구", "용인시 수지구", "용인시 처인구", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
  강원: ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
  충북: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시 상당구", "청주시 서원구", "청주시 청원구", "청주시 흥덕구", "충주시"],
  충남: ["계룡시", "공주시", "금산군", "논산시", "당진군", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시 동남구", "천안시 서북구", "청양군", "태안군", "홍성군"],
  전북: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시 덕진구", "전주시 완산구", "정읍시", "진안군"],
  전남: ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  경북: ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시 남구", "포항시 북구"],
  경남: ["거제시", "거창군", "고성군", "김해시", "남해군", "남해시", "밀양시", "사천시", "산청군", "양산시", "의령군", "장승포시", "진주시", "진해시", "창녕군", "창원시 마산합포구", "창원시 마산회원구", "창원시 성산구", "창원시 의창구", "창원시 진해구", "통영시", "하동군", "함안군", "함양군", "합천군"],
  제주: ["서귀포시", "제주시"]
};

let terrOrg = {
  1303: ["인천/남동구", "인천/미추홀구", "인천/연수구", "인천/동구", "경기/시흥시", "경기/김포시", "경기/안산시 상록구"]
};

let div = document.getElementById("data");
let foot = document.getElementById("foot");
let selector = document.querySelectorAll('.criteria');

// 매출자료 가져오기!!

let xlr = new XMLHttpRequest();
let monthData = "/data/CKD Prevenar Sales data(2022.03).xls";
xlr.open("GET", monthData);
xlr.overrideMimeType("text/xml");
xlr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let rawData = this.responseXML;
    let resultArray = dataDealer.processXML(rawData);

    selector[0].length = 1;
    for (let i in dataDealer.clan) {
      for (let j = 0; j < dataDealer.clan[i].length; j++) {
        let opt = document.createElement("option");
        opt.setAttribute("value", dataDealer.clan[i][j]);
        opt.innerHTML = dataDealer.clan[i][j];
        selector[0].appendChild(opt);
      }
    }

    makeCover();

    function makeCover() {
      selector[0].selectedIndex = 0, selector[1].length = 1;
      div.innerHTML = "", foot.style.display = "none";
      let coverData = dataDealer.summerizer("Clan", "Territory", "지역");
      let coverPage = document.createElement("div");
      coverPage.style.width = "100%";
      div.appendChild(coverPage);
      
      let dataBranch = dataDealer.summerizer("Clan", "Territory", "일자");
      let report = dataDealer.sumReport;  
      for (let i = 0; i < dataDealer.clan.local.length; i++) {
        let terr = dataDealer.clan.local[i];
        let terrBox = document.createElement("div");
        terrBox.setAttribute("class", "line");
        coverPage.appendChild(terrBox);

        let title = document.createElement("div");
        terrBox.appendChild(title);
        title.innerHTML = `<span class="narrow" id=${terr}><i class="far fa-plus-square"></i></span>
          ${terr}: ${report.local[terr].toLocaleString()}
          (${(report.local[terr]/report.local.total * 100).toFixed(1)}%)<br>`;

        let content = document.createElement("div");
        content.setAttribute("class", "has");
        terrBox.appendChild(content);
        if (terr == "others") {
          for (let area in coverData.local[terr]) {
            content.innerHTML += `<li class="item" id="${area}">${area}: ${coverData.local[terr][area]}
              (${(coverData.local[terr][area]/report.local.total * 100).toFixed(1)}%)</li>`;
          }
          for (let area in coverData.local[terr]) {
            let areaSales = document.getElementById(area);
            areaSales.addEventListener("click", function() {
              selector[0].value = terr;
              let opt = document.createElement("option");
              opt.innerHTML = area;
              selector[1].appendChild(opt);
              selector[1].value = area;
              reportAreaDaily(div, foot, terr, area, dataBranch, report);
            });
          }
        } else {
          let area = dataDealer.terrOrg[terr];
          let color = ["red", "orange", "yellowgreen", "green", "skyblue", "blue", "purple"];
          for (let i = 0; i < area.length; i++) {
            let areaSales = coverData.local[terr][area[i]];
            content.innerHTML += `<li class="item" id="${area[i]}">${area[i]}: ${areaSales? areaSales : 0}
              (${((areaSales? areaSales : 0)/dataDealer.sumReport.local.total * 100).toFixed(1)}%)</li>`;
          }
          for (let i = 0; i < area.length; i++) {
            let areaSales = document.getElementById(area[i]);
            areaSales.onclick = function() {
              selector[0].value = terr;
              for (let j = 0; j < area.length; j++) {
                let opt = document.createElement("option");
                opt.setAttribute("value", area[j]);
                opt.innerHTML = area[j];
                selector[1].appendChild(opt);
                selector[1].onchange = function() {
                  let area = selector[1][selector[1].selectedIndex].value;
                  if (selector[1].selectedIndex != 0) {
                    reportAreaDaily(div, foot, terr, area, dataBranch, report);
                  } else {
                    reportDaily(div, foot, selector, dataBranch, report);
                  }
                };    
              }
              selector[1].value = area[i];
              reportAreaDaily(div, foot, terr, area[i], dataBranch, report);
            };
          }
          let chartArea = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          chartArea.setAttribute("width", "340"), chartArea.setAttribute("height", "250");

          let title = document.createElementNS("http://www.w3.org/2000/svg", "text");
          title.setAttribute("x", 30), title.setAttribute("y", 35);
          title.innerHTML = "🍩 Territory 내 지역별 비중 🍉";
          chartArea.appendChild(title);

          let startX = 130, startY = 75, endX, endY, portion = 0;
          for (let i = 0; i < area.length; i++) {
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let areaSales = coverData.local[terr][area[i]];
            let areaShare = (areaSales? areaSales : 0) / report.local[terr];
            let largeArcFlag = areaShare > 0.5 ? 1 : 0;
            let posiRad = portion + areaShare * Math.PI;
            portion += 2 * Math.PI * areaShare;
            endX = 130 + 75 * Math.sin(portion), endY = 150 - 75 * Math.cos(portion);
            path.setAttribute("fill", color[i]);
            path.setAttribute("d", `M 130 150 L ${startX} ${startY} A 75 75 0 ${largeArcFlag} 1 ${endX} ${endY} Z`);
            startX = endX, startY = endY;
            chartArea.appendChild(path);

            if (areaShare > 0.01) {
              let percent = document.createElementNS("http://www.w3.org/2000/svg", "text");
              percent.setAttribute("x", 120 + 90 * Math.sin(posiRad)), percent.setAttribute("y", 155 - 90 * Math.cos(posiRad));
              percent.setAttribute("font-size", `12px`);
              percent.innerHTML = `${(areaShare * 100).toFixed(0)}%`;
              chartArea.appendChild(percent);
            }

            chartArea.innerHTML +=
              `<circle cx="255" cy=${162 - 23 * area.length / 2 + 23 * i} r="4" fill=${color[i]}></circle>
              <text x="265" y=${166 - 23 * area.length / 2 + 23 * i} font-size="10px">${area[i].substr(3)}</text>`;
          }
          content.appendChild(chartArea);
        }

        let anchor = document.getElementById(terr);
        anchor.onclick = function() {
          if (content.classList.value == "has active") {
            anchor.innerHTML = '<i class="far fa-plus-square"></i>';
            title.style.color = "black", title.style.fontStyle = "normal", title.style.fontWeight = "normal";
          } else {
            anchor.innerHTML = '<i class="far fa-minus-square"></i>';
            title.style.color = "darkolivegreen", title.style.fontStyle = "italic", title.style.fontWeight = "bold";
          }
          content.classList.toggle('active');
          /*let menus = document.querySelectorAll('.far');
          menus.forEach(menu => {
            menu.onmouseover = function() {
              menu.style.color = "#34346895";
            };
            menu.onmouseout = function() {
              menu.style.color = "#34346830";
            };
          });*/
        }
      }

      if (document.querySelectorAll('.bubble')) {
        let menuBox = document.querySelectorAll('.bubble');
        for (let i = 0; i < menuBox.length; i++) {
          menuBox[i].style.display = "none";
        }
      }
      /*let menus = document.querySelectorAll('.fa-plus-square');
      menus.forEach(menu => {
        menu.onmouseover = function() {
          menu.style.color = "#34346895";
        };
        menu.onmouseout = function() {
          menu.style.color = "#34346830";
        };
      });*/
    }

    let clip = document.querySelector('.fa-redo');
    /*clip.onmouseover = function() {
      if (foot.style.display == "block") {
        clip.style.color = "brown";
      }
    };
    clip.onmouseout = function() {
      clip.style.color = "darkolivegreen";
    };*/
    clip.onclick = makeCover;

    let dataBranch = dataDealer.summerizer("Clan", "Territory", "일자");
    let report = dataDealer.sumReport;

    selector[0].addEventListener("change", function() {
      let idx = selector[0].selectedIndex;
      let territory = selector[0][idx].value;
      selector[1].length = 1;
      if (territory != "GH") {
        for (let i = 0; i < dataDealer.terrOrg[territory].length; i++) {
          let opt = document.createElement("option");
          opt.setAttribute("value", dataDealer.terrOrg[territory][i]);
          opt.innerHTML = dataDealer.terrOrg[territory][i];
          selector[1].appendChild(opt);
        }
      }

      reportDaily(div, foot, selector, dataBranch, report);
      selector[1].onchange = function() {
        reportDaily(div, foot, selector, dataBranch, report);
      };
    });

    /*btn.onclick = function() {
      div.innerHTML = "", foot.innerHTML = "";
      let dataTree, myData;
      let idx = selector[0].selectedIndex;
      let territory = selector[0][idx].value;
      let dataBranch = dataDealer.summerizer("Clan", "Territory", "일자");
      let report = dataDealer.sumReport;
      if (selector[1].selectedIndex) {
        let idx2 = selector[1].selectedIndex;
        let ticket = selector[1][idx2].value;
        dataTree = dataDealer.summerizer("Territory", "지역", "일자", "거래처명");
        myData = dataTree[territory][ticket];
      } else {
        dataTree = dataDealer.summerizer("Territory", "일자", "거래처명");
        myData = dataTree[territory];
      }
      let total = 0;
      for (let date in myData) {
        let sum = 0;
        let unit = document.createElement("div");
        unit.setAttribute("class", "unit");
        div.insertBefore(unit, div.firstChild);
        let lid = document.createElement("div");
        lid.setAttribute("class", "lid");
        unit.appendChild(lid);
        lid.innerHTML += date + "<br>";
        let belly = document.createElement("div");
        belly.setAttribute("class", "belly");
        unit.appendChild(belly);
        for (let clinic in myData[date]) {
          belly.innerHTML += ` ${clinic}: ${myData[date][clinic]}` + "<br>";
          sum += myData[date][clinic];
        }
        if (selector[1].selectedIndex) {
          belly.innerHTML += "-----------------------<br>" + `total: ${sum}/${dataBranch["local"][territory][date]}
            (${(sum/dataBranch["local"][territory][date] * 100).toFixed(1)}%)` + "<br>";
        } else {
          let local = dataBranch["local"], terrSum = 0;
          for (let terr in local) {
            local[terr][date] ? terrSum += local[terr][date] : terrSum += 0;
          }
          belly.innerHTML += "-----------------------<br>" + `total: ${sum}/${terrSum}
            (${(sum/terrSum * 100).toFixed(1)}%)` + "<br>";
        }
        total += sum;
      }
      if (selector[1].selectedIndex) {
        foot.innerHTML += `지역비중: ${total}/${report["local"][territory]}
          (${(total/report["local"][territory] * 100).toFixed(1)}%)` + "<br>";
      } else {
        foot.innerHTML += `누적비중: ${total}/${report["local"].total}
          (${(total/report["local"].total * 100).toFixed(1)}%)` + "<br>";
      }
      console.log(selector[0].selectedIndex, selector[1].selectedIndex);
    }*/


    /*let dataTree = dataDealer.summerizer("Territory", "일자", "거래처명");
    let dataBranch = dataDealer.summerizer("Clan", "일자");
    let report = dataDealer.sumReport;
    let myTerr = dataTree["1303"];
    let total = 0;
    for (let date in myTerr) {
      let sum = 0;
      let unit = document.createElement("div");
      unit.setAttribute("class", "unit");
      div.insertBefore(unit, div.firstChild);
      let lid = document.createElement("div");
      lid.setAttribute("class", "lid");
      unit.appendChild(lid);
      lid.innerHTML += date + "<br>";
      let belly = document.createElement("div");
      belly.setAttribute("class", "belly");
      unit.appendChild(belly);
    for (let clinic in myTerr[date]) {
          belly.innerHTML += ` ${clinic}: ${myTerr[date][clinic]}` + "<br>";
          sum += myTerr[date][clinic];
        }
      belly.innerHTML += "-----------------------<br>" + `total: ${sum}/${dataBranch["local"][date]}
        (${(sum/dataBranch["local"][date] * 100).toFixed(1)}%)` + "<br>";
      let para = document.createElement("p");
      unit.appendChild(para);
      total += sum;
    }
    div.innerHTML += `누적비중: ${total}/${report["local"]}
      (${(total/report["local"] * 100).toFixed(2)}%)` + "<br><br>";

    let newResultArr = [];
    newResultArr.push(resultArray[0]);
    for (let i = 1; i < resultArray.length; i ++) {
      if (resultArray[i][resultArray[i].length - 2] == "1303") {
        newResultArr.push(resultArray[i]);
      }
    }
    let summeryObj = processData(newResultArr, "일자", "거래처명");
    let totalSumObj = processData(resultArray, "일자", "Territory");
    for (let date in summeryObj) {
      let sum = 0;
      for (let clinic in summeryObj[date]) {
        div.innerHTML += `${date}> ${clinic}: ${summeryObj[date][clinic]}` + "<br>";
        sum += summeryObj[date][clinic];
      }
      div.innerHTML += `subTotal(${date}): ${sum}/${totalSumObj[date]["others"] + sum}(${(sum/(totalSumObj[date]["others"] + sum) * 100).toFixed(1)}%)` + "<br><br>";
    }*/
  }
};
xlr.send();

let calendar = document.querySelector('.fa-calendar-alt');
let menuBox = document.createElement("div");
menuBox.setAttribute("class", "bubble");
document.body.appendChild(menuBox);
let thisMonth = new Date().getMonth();
let thisYear = new Date().getFullYear();
let monthArray = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
for (let i = 0; i < (thisYear - 2020) * 12 + thisMonth + 2; i++) {
  let menu = document.createElement("p");
  let count = Math.floor((thisMonth - i) / 12);
  let year = thisYear + count;
  let month = (thisMonth + (thisYear - 2019) * 12 - i) % 12;
  menu.style.padding = "3px 10px";
  menu.innerHTML = monthArray[month] + " " + year;
  menuBox.appendChild(menu);
  menu.onmouseover = function() {
    menu.style.color = "blue", menu.style.fontStyle = "italic";
  }
  menu.onmouseout = function() {
    menu.style.color = "black", menu.style.fontStyle = "normal";
  }
  menu.onclick = function() {
    div.innerHTML = "", foot.style.display = "none";
    let ring = document.createElement("div");
    ring.setAttribute("class", "ring");
    div.appendChild(ring);
    monthData = "/data/CKD Prevenar Sales data(" + year + "." + (month > 8 ? (month + 1) : "0" + (month + 1)) + ").xls"
    xlr.open("GET", monthData);
    xlr.overrideMimeType("text/xml");
    xlr.send();
    menuBox.style.display = "none";
  }
}
menuBox.style.display = "none";

calendar.onclick = function() {
  if (menuBox.style.display == "none") {
    menuBox.style.display = "block";
  } else {
    menuBox.style.display = "none";
  }
};

function reportDaily(container1, container2, selector, auxData, auxReport) {
  container1.innerHTML = "", container2.innerHTML = "";
  let dataTree = dataDealer.summerizer("Territory", "일자", "지역", "거래처명");
  let idx = selector[0].selectedIndex, territory = selector[0][idx].value;
  let idx2 = selector[1].selectedIndex, ticket = selector[1][idx2].value;
  let myData = dataTree[territory];
  let total = 0, day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let date in myData) {
    let sum = 0;
    let unit = document.createElement("div");
    unit.setAttribute("class", "unit");
    container1.insertBefore(unit, container1.firstChild);
    let lid = document.createElement("div");
    lid.setAttribute("class", "lid");
    unit.appendChild(lid);
    let tempDate = new Date();
    tempDate.setFullYear(date.substr(0,4) * 1, date.substr(5,2) * 1 - 1, date.substr(8,2) * 1);
    lid.innerHTML = date + " " + day[tempDate.getDay()].substr(0,3) + ".";
    let belly = document.createElement("div");
    belly.setAttribute("class", "belly");
    unit.appendChild(belly);
    if (selector[1].selectedIndex) {
      let content = document.createElement("div");
      content.style.padding = "5px 15px 10px 15px";
      belly.appendChild(content);
      for (let clinic in myData[date][ticket]) {
        content.innerHTML += ` ${clinic}: ${myData[date][ticket][clinic].toLocaleString()}` + "<br>";
        sum += myData[date][ticket][clinic];
      }
      let bottom = document.createElement("div");
      bottom.setAttribute("class", "bottom");
      belly.appendChild(bottom);
      bottom.innerHTML += `total: ${sum.toLocaleString()}/${auxData["local"][territory][date].toLocaleString()}
        (${(sum/auxData["local"][territory][date] * 100).toFixed(1)}%)` + "<br>";
    } else {
      for (let ticket in myData[date]) {
        belly.innerHTML += `<p class="belt">${ticket}</p>`;
        let content = document.createElement("div");
        content.style.padding = "5px 15px 10px 15px";
        belly.appendChild(content);
        for (let clinic in myData[date][ticket]) {
          content.innerHTML += ` ${clinic}: ${myData[date][ticket][clinic].toLocaleString()}` + "<br>";
          sum += myData[date][ticket][clinic];
        }
      }
      let content = document.createElement("div");
      content.setAttribute("class", "bottom");
      belly.appendChild(content);
      if (territory != "NIP" && territory != "도매") {
        let local = auxData["local"], terrSum = 0;
        for (let terr in local) {
          local[terr][date] ? terrSum += local[terr][date] : terrSum += 0;
        }
        content.innerHTML += `total: ${sum.toLocaleString()}/${terrSum.toLocaleString()}
          (${(sum/terrSum * 100).toFixed(1)}%)` + "<br>";
      } else {
        content.innerHTML += `total: ${sum.toLocaleString()}`;
      }
    }
    total += sum;
  }

  let showIt = document.createAttribute("style");
  showIt.value = "display: block";
  container2.setAttributeNode(showIt);
  if (selector[1].selectedIndex) {
    container2.innerHTML = `Territory ${territory} 내 비중(${ticket}): ${total.toLocaleString()}/${auxReport["local"][territory].toLocaleString()}
      (${(total/auxReport["local"][territory] * 100).toFixed(1)}%)` + "<br>";
  } else if (territory == "GH") {
    container2.innerHTML = `${territory} 비중: ${total.toLocaleString()}/${(auxReport["local"].total + auxReport["GH"].total).toLocaleString()}
      (${(total/(auxReport["local"].total + auxReport["GH"].total) * 100).toFixed(1)}%)` + "<br>";
  } else if (territory != "NIP" && territory != "도매") {
    container2.innerHTML = `Territory ${territory} 비중: ${total.toLocaleString()}/${auxReport["local"].total.toLocaleString()}
      (${(total/auxReport["local"].total * 100).toFixed(1)}%)` + "<br>";
  } else {
    container2.innerHTML = `${territory} 비중: ${total.toLocaleString()}/${auxReport.Total.toLocaleString()} (${(total/auxReport.Total * 100).toFixed(1)}%)`;
  }
}

function reportAreaDaily(container1, container2, territory, area, auxData, auxReport) {
  container1.innerHTML = "", container2.innerHTML = "";
  let dataTree = dataDealer.summerizer("Territory", "일자", "지역", "거래처명");
  let myData = dataTree[territory];
  console.log(myData);
  let total = 0, day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let date in myData) {
    if (myData[date][area]) {
      let sum = 0;
      let unit = document.createElement("div");
      unit.setAttribute("class", "unit");
      container1.insertBefore(unit, container1.firstChild);
      let lid = document.createElement("div");
      lid.setAttribute("class", "lid");
      unit.appendChild(lid);
      let tempDate = new Date();
      tempDate.setFullYear(date.substr(0,4) * 1, date.substr(5,2) * 1 - 1, date.substr(8,2) * 1);
      lid.innerHTML = date + " " + day[tempDate.getDay()].substr(0,3) + ".";
      let belly = document.createElement("div");
      belly.setAttribute("class", "belly");
      unit.appendChild(belly);
      let content = document.createElement("div");
      content.style.padding = "5px 15px 10px 15px";
      belly.appendChild(content);
      for (let clinic in myData[date][area]) {
        content.innerHTML += ` ${clinic}: ${myData[date][area][clinic].toLocaleString()}` + "<br>";
        sum += myData[date][area][clinic];
      }
      let bottom = document.createElement("div");
      bottom.setAttribute("class", "bottom");
      belly.appendChild(bottom);
      bottom.innerHTML += `total: ${sum.toLocaleString()}/${auxData["local"][territory][date].toLocaleString()}
        (${(sum/auxData["local"][territory][date] * 100).toFixed(1)}%)` + "<br>";
      total += sum;  
    }
  }

  let showIt = document.createAttribute("style");
  showIt.value = "display: block";
  container2.setAttributeNode(showIt);
  container2.innerHTML = `Territory ${territory} 내 비중(${area}): ${total.toLocaleString()}/${auxReport["local"][territory].toLocaleString()}
    (${(total/auxReport["local"][territory] * 100).toFixed(1)}%)` + "<br>";
}

function processRaw(data) {
  let dataArray = [];
  let rows = data.getElementsByTagName("Row");
  for (let i = 0; i < rows.length; i++) {
    let rowArray = [];
    for (let j = 0; j < rows[i].childElementCount; j++) {
      rowArray.push(rows[i].children[j].textContent);
    }
    dataArray.push(rowArray);
  }
  return dataArray;
}

function getArea(address) {
  let distName = address.match(/[가-힣]{2,3}[구군]{1}/);
  for (let idx in distObj) {
    for (let value of distObj[idx]) {
      if (value.indexOf(distName) != -1) {
        return idx;
      }
    }
  }
  distName = address.match(/[가-힣]{2,3}시/);
  for (let idx in distObj) {
    if (distObj[idx].indexOf(distName[0]) != -1) {
      return idx;
    }
  }
  return null;
}

function getTerr(record) {
  for (num in terrOrg) {
    if (record[5].indexOf("보건") != -1 && record[5].indexOf("의원") == -1) {
      return "NIP";
    } else if (record[record.length - 2].indexOf("도매") != -1) {
      return "도매";
    } else if (terrOrg[num].indexOf(record[record.length - 1]) != -1) {
      return num;
    }
  }
  return "";
}

function processData(dataArray, criteria, critAdded) {
  let summeryObj = {};
  let resultIdx = dataArray[0].indexOf("매출량");
  let idx = dataArray[0].indexOf(criteria);
  let idx2 = dataArray[0].indexOf(critAdded);
  for (let i = 1; i < dataArray.length; i++) {
    let salesVol = dataArray[i][resultIdx].replace(",", "") * 1;
    if (summeryObj[dataArray[i][idx]]) {
      if (critAdded) {
        summeryObj[dataArray[i][idx]][dataArray[i][idx2]] ?
          summeryObj[dataArray[i][idx]][dataArray[i][idx2]] += salesVol :
          summeryObj[dataArray[i][idx]][dataArray[i][idx2]] = salesVol;
      } else {
        summeryObj[dataArray[i][idx]] += salesVol;
      }
    } else {
      if (critAdded) {
        summeryObj[dataArray[i][idx]] = {};
        summeryObj[dataArray[i][idx]][dataArray[i][idx2]] = salesVol;
      } else {
        summeryObj[dataArray[i][idx]] = salesVol;
      }
    }
  }
  return summeryObj;
}

function processAddress(address) {
  let area, district;
  let wideArea = ["서울", "부산", "인천", "대구", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"];
  let metro = ["서울", "부산", "인천", "대구", "광주", "대전", "울산"];
  let cities = ["고양시", "성남시", "수원시", "안산시", "안양시", "용인시", "청주시", "천안시", "전주시", "포항시", "창원시"];
  let addrString = address.replace(/\s/g, "");
  let iniTwo = addrString.substring(0,2), areaDouble;
  iniTwo == "경상" || iniTwo == "전라" || iniTwo == "충청" ?
    areaDouble = addrString.charAt(0) + addrString.charAt(2) :
    areaDouble = iniTwo;
  wideArea.indexOf(areaDouble) != -1 ?
    area = areaDouble :
    area = getArea(address);

  let startIdx, charNums;
  if (metro.indexOf(area) != -1) {
    addrString.indexOf("특별시") == 2 || addrString.indexOf("광역시") == 2 ?
      startIdx = 5 :
      addrString.charAt(2) == "시" ?
        startIdx = 3 :
        startIdx = 2;
    addrString.substr(startIdx + 1, 3).indexOf("구") != -1 ?
      charNums = addrString.substr(startIdx + 1, 3).indexOf("구") + 2 :
      charNums = addrString.substr(startIdx + 1, 3).indexOf("군") + 2;
  } else if (area != "세종") {
    addrString.charAt(1) == "남" || addrString.charAt(1) == "북" ?
      startIdx = 2 :
      addrString.indexOf("도") < 7 && addrString.indexOf("도") != -1 ?
        startIdx = addrString.indexOf("도") + 1 :
        startIdx = 2;
    cities.indexOf(addrString.substr(startIdx, 3)) != -1 ?
      charNums = addrString.substr(startIdx, 8).indexOf("구") + 1 :
      addrString.substr(startIdx + 1, 2).indexOf("군") == 1 ?
        charNums = 3 :
        charNums = addrString.substr(startIdx + 1, 3).indexOf("시") + 2;
  } else {
    charNums = -1;
  }

  let regDist = addrString.substr(startIdx, charNums);
  let distList = distObj[area];
  charNums == 3 || charNums == 4 ?
    district = distList[distList.indexOf(regDist)] :
    charNums > 4 ?
      district = distList[distList.indexOf(regDist.replace("시", "시 "))] :
      charNums == -1 ?
        district = "세종시" :
        distList.indexOf(regDist) != -1 ?
          district = distList[distList.indexOf(regDist)] :
          area == "인천" && regDist == "남구" ?
            district = "미추홀구" :
            district = distList[distList.indexOf(address.match(/[가-힣]{2,3}[시군구]{1}/)[0])];
        
  return area + "/" + district;
}

function getTotal(dataArray) {
  let total;
  let refIdx = dataArray[0].indexOf("구분");
  let terrIdx = dataArray[0].indexOf("Territory");
  let resultIdx = dataArray[0].indexOf("매출량");
  for (let i = 1; i < dataArray.length; i++) {
    let salesVol = dataArray[i][resultIdx].replace(",", "") * 1;
    if (dataArray[i][refIdx].indexOf("도매") == -1 && dataArray[i][terrIdx] != "NIP") {
      total == null ?
        total = salesVol :
        total += salesVol;
    }
  }
  console.log(total);
}

let addrDealer = {

  wideArea: ["서울", "부산", "인천", "대구", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"],
  metro: ["서울", "부산", "인천", "대구", "광주", "대전", "울산"],
  cities: ["고양시", "성남시", "수원시", "안산시", "안양시", "용인시", "청주시", "천안시", "전주시", "포항시", "창원시"],
  dong: {호계동: "안양시 동안구", 권선동: "수원시 권선구", 세류동: "수원시 권선구", 초지동: "안산시 단원구", 상현동: "용인시 수지구", 쌍용동: "천안시 서북구", 송천동: "전주시 덕진구", 성정동: "천안시 서북구", 동천동: "용인시 수지구", 신부동: "천안시 동남구", 용암동: "청주시 상당구", 제동리: "창원시 의창구", 구월동: "남동구"},

  서울: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  부산: ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "연수구", "영도구", "중구", "해운대구"],
  인천: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "옹진군"],
  대구: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  광주: ["광산구", "남구", "동구", "북구", "서구"],
  대전: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산: ["남구", "동구", "북구", "울주군", "중구"],
  경기: ["가평군", "고양시 덕양구", "고양시 일산동구", "고양시 일산서구", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시 분당구", "성남시 수정구", "성남시 중원구", "수원시 권선구", "수원시 영통구", "수원시 장안구", "수원시 팔달구", "시흥시", "안산시 단원구", "안산시 상록구", "안성시", "안양시 동안구", "안양시 만안구", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시 기흥구", "용인시 수지구", "용인시 처인구", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
  강원: ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
  충북: ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시 상당구", "청주시 서원구", "청주시 청원구", "청주시 흥덕구", "충주시"],
  충남: ["계룡시", "공주시", "금산군", "논산시", "당진군", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시 동남구", "천안시 서북구", "청양군", "태안군", "홍성군"],
  전북: ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시 덕진구", "전주시 완산구", "정읍시", "진안군"],
  전남: ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  경북: ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시 남구", "포항시 북구"],
  경남: ["거제시", "거창군", "고성군", "김해시", "남해군", "남해시", "밀양시", "사천시", "산청군", "양산시", "의령군", "장승포시", "진주시", "진해시", "창녕군", "창원시 마산합포구", "창원시 마산회원구", "창원시 성산구", "창원시 의창구", "창원시 진해구", "통영시", "하동군", "함안군", "함양군", "합천군"],
  제주: ["서귀포시", "제주시"],
  세종: [],
  
  getTicket: function(address) {
    //console.log(this.getDistrict(address), address, this.confirmDong(address), this.getArea(address));
    return this.getArea(address) + "/" + this.getDistrict(address);
  },

  getArea: function(address) {
    let area;
    let addrString = address.replace(/\s/g, "");
    let iniTwo = addrString.substring(0,2), areaDouble;
    iniTwo == "경상" || iniTwo == "전라" || iniTwo == "충청" ?
      areaDouble = addrString.charAt(0) + addrString.charAt(2) :
      areaDouble = iniTwo;
    this.wideArea.indexOf(areaDouble) != -1 ?
      area = areaDouble :
      area = this.confirmArea(address);
    return area;
  },
  confirmArea: function(address) {
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

  getDistrict: function(address) {
    let district, startIdx, charNums;
    let addrString = address.replace(/\s/g, "");
    let area = this.getArea(address);
    if (this.metro.indexOf(area) != -1) {
      addrString.indexOf("특별시") == 2 || addrString.indexOf("광역시") == 2 ?
        startIdx = 5 :
        addrString.charAt(2) == "시" ?
          startIdx = 3 :
          this.wideArea.indexOf(addrString.substring(0,2)) != -1 ?
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
          this.wideArea.indexOf(addrString.substring(0,2)) != -1 ?
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
    let distList = this[area];
    //console.log(this.confirmDong(address), charNums, distList.indexOf(regDist), address);
    charNums == 3 || (charNums == 4 && regDist.charAt(2) != "군" && distList[distList.indexOf(regDist)]) ?
      district = distList[distList.indexOf(regDist)] :
      charNums > 4 ?
        district = distList[distList.indexOf(regDist.replace("시", "시 "))] :
        charNums == -1 ?
          district = "세종시" :
          distList && distList.indexOf(regDist) != -1 ?
            district = distList[distList.indexOf(regDist)] :
            area == "인천" && regDist == "남구" ?
              district = "미추홀구" :
              (charNums == 2 && area != "제주") || (charNums == 4 && this.confirmDist(distList, regDist, address)) ?
                district = this.confirmDist(distList, regDist.substr(0,2), address) :
                district = distList[distList.indexOf(address.match(/[가-힣]{2,3}[시군구]{1}/)[0])];
                if (!district) district = this.confirmDong(address);

    return district;
  },
  confirmDist: function(distList, regDist, address) {
    if (this.cities.indexOf(regDist.substr(0,2) + "시") == -1 && distList && regDist.charAt(1) != "시") {
      for (let i = 0; i < distList.length; i++) {
        if (distList[i].indexOf(regDist.substr(0,2)) == 0)
          return distList[i];
      }
      if (address.match(/[가-힣]{2}시/)) {
        if (this.cities.indexOf(address.match(/[가-힣]{2}시/)[0]) != -1) {
          return distList[distList.indexOf(address.match(/[가-힣]{2}시 [가-힣]{1,4}구/)[0])];
        } else {
          return distList[distList.indexOf(address.match(/[가-힣]{2,3}시/)[0])];
        }
      } else {
        return distList[distList.indexOf(address.match(/[가-힣]{1,3}구/)[0])];
      }
    } else if (this.cities.indexOf(regDist.substr(0,2) + "시") != -1) {
      let gu = regDist.substr(0,2) + "시 " + address.match(/[가-힣]{1,4}구/);
      for (let i = 0; i <distList.length; i++) {
        if (distList[i].indexOf(gu) == 0) {
          return distList[i];
        }
      }
    } else {
      return distList[distList.indexOf(address.match(/[가-힣]{1,4}구/)[0])];
    }
  },
  confirmDong: function(address) {
    let area = this.getArea(address);
    let dongName = address.match(/[가-힣]{2}[동리]/);
    if (this[area].indexOf(this.dong[dongName]) != -1) {
      return this.dong[dongName];
    };
  }

}

let dataDealer = {

  terrOrg: {
    1303: ["인천/남동구", "인천/미추홀구", "인천/연수구", "인천/동구", "서울/구로구", "경기/시흥시", "경기/안산시 상록구"],
    2302: ["서울/광진구", "서울/동대문구", "서울/성동구", "서울/중랑구", "경기/구리시", "경기/포천시", "경기/가평군"],
    2306: ["경기/성남시 분당구", "경기/성남시 중원구", "경기/성남시 수정구", "경기/용인시 수지구"],
    others: [],
    GH: ["(학)가톨릭대학교서울성모병원", "(학)카톨릭대학교여의도성모병원", "인천성모병원 (학)가톨릭대학교", "(학)가톨릭학원의정부성모병원", "(학)가톨릭대학교부천성모병원", "성빈센트병원(학)가톨릭학원가톨릭대학교", "카톨릭대학교은평성모병원"],
    NIP: [],
    도매: []
  },

  clan: {
    local: ["1303", "2302", "2306", "others"],
    GH: ["GH"],
    NIP: ["NIP"],
    도매: ["도매"]
  },

  resultArray: [],
  header: [],
  sumReport: {},

  processXML: function(data) {
    let dataArray = [];
    let rows = data.getElementsByTagName("Row");
    for (let i = 0; i < rows.length; i++) {
      let rowArray = [];
      for (let j = 0; j < rows[i].childElementCount; j++) {
        rowArray.push(rows[i].children[j].textContent);
      }
      dataArray.push(rowArray);
    }

    let idx = dataArray[0].indexOf("주소");
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
    return dataArray;
  },

  getTerr: function(record) {
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

  getGrade: function(record) {
    let codeIdx = this.header.indexOf("거래처"), accountIdx = this.header.indexOf("거래처명");
    const gradeTag = {A: "ⓐ", B: "ⓑ", C: "ⓒ"};
    for (let grade in this.target) {
      if (this.target[grade].indexOf(record[codeIdx] * 1) != -1) {
        record[accountIdx] += gradeTag[grade];
        return grade;
      }
    }
    return "";
  },

  summerizer: function(criteria1, criteria2, criteria3, criteria4) {
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

    /*let total = 0;
    this.sumReport = {};
    for (let item in summeryObj) {
      if (!isNaN(summeryObj[item])) {
        total += summeryObj[item];
      } else {
        let semiTotal = 0;
        for (let item2 in summeryObj[item]) {
          if (!isNaN(summeryObj[item][item2])) {
            semiTotal += summeryObj[item][item2];
          } else {
            let subTotal = 0;
            this.sumReport[item] ?
              this.sumReport[item] : this.sumReport[item] = {};
            for (let item3 in summeryObj[item][item2]) {
              if (!isNaN(summeryObj[item][item2][item3])) {
                subTotal += summeryObj[item][item2][item3];
              } else {
                let sum = 0;
                this.sumReport[item][item2] ?
                  this.sumReport[item][item2] : this.sumReport[item][item2] = {};
                for (let item4 in summeryObj[item][item2][item3]) {
                  sum += summeryObj[item][item2][item3][item4];
                  this.sumReport[item][item2][item3] = sum;
                }
                subTotal += sum;
              }
              isNaN(summeryObj[item][item2][item3]) ?
                this.sumReport[item][item2]["total"] = subTotal :
                this.sumReport[item][item2] = subTotal;
            }
            semiTotal += subTotal;
          }
          isNaN(summeryObj[item][item2]) ?
            this.sumReport[item]["total"] = semiTotal :
            this.sumReport[item] = semiTotal;
        }
        total += semiTotal;
      }
      this.sumReport["Total"] = total;
    }*/
    return summeryObj;
  }
  
}

