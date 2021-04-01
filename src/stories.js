window.renderTemplate = function(alias, data) {

    const staticEmoji = '👍';
    let result;
    let avatarSrc;

    window.screen.availHeight > 375 ? avatarSrc = "img/2x/" : avatarSrc = "img/1x/";

    if(alias === "leaders") {
        function generateColumns() {
            data.users.sort((a, b) => Number(b.valueText.replace(/\D+/g,"")) - Number(a.valueText.replace(/\D+/g,"")));
            let correctsIndexes = [3, 4, 2, 5, 1];
            let votedUser;
            let votedUserInFirstFourPlaces = true;
            let idHolder;
            if ("selectedUserId" in data) { //Есть ли человек за которого проголосовали?
                idHolder = data["selectedUserId"]; //если есть, запишем айди
                console.log("selectedUserId" in data);
                console.log("idHolder " + idHolder);

                for (let i = 0; i < 3; i++) { // проверим, он в первых четырех позициях?
                    idHolder == data.users[i].id ? (votedUserInFirstFourPlaces = true) : (votedUserInFirstFourPlaces = false); // если да, ничего не меняем
                };

                if(!votedUserInFirstFourPlaces) {
                    for (let i = 0; i < data.users.length; i++) {
                        console.log(i);
                        if(data.users[i].id == idHolder) {
                            votedUser = data.users[i];
                            console.log(votedUser)
                            break;
                        }
                    }
                }
            };

            for(let i = 0; i < data.users.length; i++) {
                data.users[i].positionInTop = i + 1;
                data.users[i].columnNumber = correctsIndexes[i];
            }

            data.users.sort((a, b) => a.columnNumber - b.columnNumber);
            let usersStack = [];
            let mostVotedMember;
            if(votedUserInFirstFourPlaces){
                for (let j = 0; j < 5; j++) {
                    usersStack.push(data.users[j]);
                    usersStack[j].userLabel = j;
                }
            } else if(!votedUserInFirstFourPlaces) {
                usersStack.push(votedUser);
                usersStack[0].userLabel = 0;
                for (let j = 1; j < 5; j++) {
                    usersStack.push(data.users[j]);
                    usersStack[j].userLabel = j;
                }


            mostVotedMember =
                `<div class="leaders-votedUsersWrapper">
                   <div class="leaders-emoji">${staticEmoji}</div>
                   <img class="leaders-avatar" src='${avatarSrc}${votedUser.avatar}'>
                   <div class="leaders-name">${votedUser.name}</div>
                   <div class="leaders-commitsRes">${votedUser.valueText}</div>
                   <div class="leaders-underline"></div>
                   <span class="leaders-position">${votedUser.positionInTop}</span>
                   </div>`;
            }

            return usersStack.map((user, index) => {
              return (`<div class="leaders-column text-a-center">
                          <div class="leaders-usersWrapper">
                              <div class="leaders-emoji">${index == 2 ? data.emoji : ""}${index == 0 ? staticEmoji : "" }</div>
                              <img class="leaders-avatar" src='${avatarSrc}${user.avatar}'>
                              <div class="leaders-name">${user.name}</div>
                              <div class="leaders-commits">${user.valueText}</div>
                          </div>
                          <div class="leaders-resultBar flex j-c-space-between flex-d-column">
                              <span class="leaders-position">${user.positionInTop}</span>
                              ${(index == 2) && (!votedUserInFirstFourPlaces) ? mostVotedMember : ""}
                          </div>
                      </div>`);
            })

        };
        result =
        `<div class="leaders flex flex-d-column a-i-center j-c-space-between">
             <div class="leaders-titlesWrapper text-a-center">
                <div class="leaders-title">${data.title}</div>
                <div class="leaders-subtitle">${data.subtitle}</div>
            </div>
            <div class="leaders-columns flex a-i-flex-end">
              ${generateColumns().join("")}
            </div>
        </div>`
    }

    if(alias === "vote") {

        function isChecked(id) {
            if(id == data.selectedUserId) {
                return "checked";
            }
        }

        const svgButton = `<svg class="vote-svgButton" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M32 2C15.4315 2 2 15.4315 2 32C2 48.5685 
                            15.4315 62 32 62C48.5685 62 62 48.5685 62 32C62 15.4315 48.5685 2 32 2ZM32 
                            -2.79753e-06C14.3269 -4.34256e-06 4.34256e-06 14.3269 2.79753e-06 32C1.2525e-06 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 
                            64 32C64 14.3269 49.6731 -1.2525e-06 32 -2.79753e-06ZM4.99999 32C4.99999 17.0883 
                            17.0883 4.99999 32 4.99999C46.9117 4.99999 59 17.0883 59 32C59 46.9117 46.9117 
                            59 32 59C17.0883 59 4.99999 46.9117 4.99999 32ZM38.9393 36.0607C39.5251 36.6464 
                            40.4749 36.6464 41.0607 36.0607C41.6464 35.4749 41.6464 34.5251 41.0607 
                            33.9393L33.0607 25.9393C32.4749 25.3536 31.5251 25.3536 30.9393 25.9393L22.9393 
                            33.9393C22.3536 34.5251 22.3536 35.4749 22.9393 36.0607C23.5251 36.6464 24.4749 36.6464 
                            25.0607 36.0607L32 29.1213L38.9393 36.0607Z"/>
                            </svg>`

        function generateVoteItem() {
            let usersStack = [];

            for(let j = 0; j < 8; j++){
                usersStack.push(data.users[j]);
                usersStack[j].userLabel = j;
            }

            return usersStack.map((user, index) => {
                return (`
                <div class="vote-item flex">
                    <input class="vote-itemRadio" ${isChecked(user.id, user.userLabel)} name="myVoice" type="radio" value="${user.id}" id='member${user.userLabel}'>
                    <label class="vote-label" for="member${user.userLabel}">
                    <div class="vote-emoji">${staticEmoji}</div>
                            <img class="vote-avatar" src="${avatarSrc}${user.avatar}">
                            <div class="vote-name text-a-center">${user.name}</div>
                    </label>
                </div>`)
            })
        }

        result =
        `<div class="vote flex flex-d-column a-i-center j-c-space-between">
            <div class="vote-titlesWrapper text-a-center">
                <div class="vote-title">${data.title}</div>
                <div class="vote-subtitle">${data.subtitle}</div>
            </div>
            <form class="vote-content">
                <button class="vote-item vote-toggleMembers flex" disabled type="button">${svgButton}</button>
                <button class="vote-item vote-toggleMembers flex" type="button">${svgButton}</button>
                  ${generateVoteItem().join("")}
            </form>
        </div>`

    }

    if(alias === "chart") {

        let startIndex, endIndex;

        data.values.forEach(function(item, i, arr) {
            if(data.values[i].hasOwnProperty('active')) {
                startIndex = i - 6;
                endIndex = i + 2
            }
        });

        function generateChartColumns() {
            let chartStack = [];
            let bigNumber = null;

            for (let j = startIndex; j <= endIndex; j++ ) {
                chartStack.push(data.values[j]);
                if((data.values[j].value.toString()).length >= 4 && bigNumber == null ) {
                    bigNumber = true;
                }

            }

            let minValue = chartStack[0].value;
            let maxValue = minValue;
            for (let m = 1; m < chartStack.length; m++) {
                if (chartStack[m].value > maxValue) maxValue = chartStack[m].value;
                if (chartStack[m].value < minValue && chartStack[m].value != 0) minValue = chartStack[m].value;
            }
            // 69% высоты в верстке = 270px, максимальному значению по макету и = 100% относительной шкалы измерения
            //

            function getColumnHeight(value, maxValue) {
                if(value != 0) {
                    let columnHeightRelativeScale = (value * 100) / maxValue;
                    let columnHeight = columnHeightRelativeScale * 69 / 100;
                    return columnHeight.toFixed(2);
                }
                return 0;
            }

            return chartStack.map(column => {
                return `<div class="chart-container flex flex-d-column a-i-center j-c-flex-end">
                          <div class="chart-value ${bigNumber ? "chart-bigNumber" : ""} ${column.hasOwnProperty('active') ? "chart-color" : "" }">
                          ${column.value == 0 ? "" : column.value}</div>
                          <div class="chart-column ${column.hasOwnProperty('active') ? "active" : "" }" style="height: ${getColumnHeight(column.value, maxValue)}%"></div>
                          <div class="chart-index">${column.title}</div>
                        </div>`
            })
        }

        result =
            `<div class="chart flex flex-d-column a-i-center j-c-space-between">
                <div class="chart-titlesWrapper text-a-center">
                    <div class="chart-title">${data.title}</div>
                    <div class="chart-subtitle">${data.subtitle}</div>
                </div>
                <div class="chart-columns flex a-i-flex-end j-c-space-between">
                    ${generateChartColumns().join("")}
                </div>
                <div class="chart-leaders flex j-c-space-between">
                    <div class="chart-user flex">
                        <img class="chart-avatar" src='${avatarSrc}${data.users[0].avatar}'>
                        <div class="chart-usersInfo">
                            <div class="chart-name">${data.users[0].name}</div>
                            <div class="chart-count">${data.users[0].valueText}</div>
                        </div>
                    </div>
                    <div class="chart-separator"></div>
                    <div class="chart-user flex">
                        <img class="chart-avatar" src='${avatarSrc}${data.users[1].avatar}'>
                        <div class="chart-usersInfo">
                            <div class="chart-name">${data.users[1].name}</div>
                            <div class="chart-count">${data.users[1].valueText}</div>
                        </div>
                    </div>
                </div>
            </div>`
    }

    if(alias === "activity") {

        const heatColumnSrc = ['var(--svg-min-col)', "var(--svg-mid-col)", "var(--svg-max-col)", "var(--svg-extra-col)"];
        let weeksDay = [];

        function getMinMaxValue(obj) {
            let min = 0;
            let max = min;
            for(let key in obj) {
                weeksDay.push(obj[key]);
                for (let m = 0; m < obj[key].length; m++) {
                    if (obj[key][m] >= max) max = obj[key][m];
                    if (obj[key][m] <= min) min = obj[key][m];
                }
            }
            if(min == 0) min = 1;
            let minMaxValue = {min: min, max: max}

            return minMaxValue;
        }


        let column12Hours = {};

        for(let key in data.data) {
            let newArray = [];
            for (let m = 0; m < (data.data[key].length); m = m + 2) {
                newArray.push(data.data[key][m] + data.data[key][m + 1]);
            }
            column12Hours[`${key}`] = newArray;
        }

        function intervals(min, max) {
            let lengthMinMax = [];
            let resultArr = [];

            for (let i = min; i <= max; i++) lengthMinMax.push(i);

            let arrLength = lengthMinMax.length;

            while ((arrLength % 3) != 0) arrLength--;
            debugger;
            if(arrLength % 3 == 0) {
                let intervalSize = arrLength / 3;
                let start = 0;
                let end = intervalSize - 1;
                for (let i = 0; i < 2; i++) {
                    resultArr.push([lengthMinMax[start], lengthMinMax[end]]);
                    start = start + intervalSize;
                    end = end + intervalSize;
                }
                resultArr.push([lengthMinMax[start], lengthMinMax[lengthMinMax.length - 1]]);
            }

            let obj = {
                min: 0,
                mid: resultArr[0],
                max: resultArr[1],
                extra: resultArr[2],
            }

            return obj;
        }


        const intervalsObject = {
            horizontal: intervals(getMinMaxValue(column12Hours).min, getMinMaxValue(column12Hours).max),
            vertical: intervals(getMinMaxValue(data.data).min, getMinMaxValue(data.data).max),
        }

        function settings(value) {
            if(value == 0) {
                let obj = {
                    'src': heatColumnSrc[0],
                    'class': 'min',
                    sizeH: {
                        h: 2.125,
                        w: 2.125,
                        'correctPos' : 0,
                    },
                    sizeV: {
                        h: 2.688,
                        w: 2.688,
                        'correctPos' : 0,
                    }
                }
                return obj;
            }
            if(value >= intervalsObject.horizontal.mid[0] && value <= intervalsObject.horizontal.mid[1]
                || (value >= intervalsObject.vertical.mid[0] && value <= intervalsObject.horizontal.mid[1]))  {
                let obj = {
                    'src': heatColumnSrc[1],
                    'class': 'mid',
                    sizeH: {
                        h: 2.563,
                        w: 2.125,
                        'correctPos' : -0.5,
                    },
                    sizeV: {
                        h: 3.375,
                        w: 2.734,
                        'correctPos' : -0.625,
                    }
                }
                return obj;
            }

            if((value >= intervalsObject.horizontal.max[0] && value <= intervalsObject.horizontal.max[1])
                || (value >= intervalsObject.vertical.max[0] && value <= intervalsObject.vertical.max[1])) {
                let obj = {
                    'src': heatColumnSrc[2],
                    'class': 'max',
                    sizeH: {
                        h: 3.563,
                        w: 2.125,
                        'correctPos' : -1.5,
                    },
                    sizeV: {
                        h: 4.625,
                        w: 2.688,
                        'correctPos' : -1.938,
                    }
                }
                return obj;
            }

            if((value >= intervalsObject.horizontal.extra[0] && value <= intervalsObject.horizontal.extra[1])
                || value >= intervalsObject.vertical.extra[0] && value <= intervalsObject.vertical.extra[1]) {
                let obj = {
                    'src': heatColumnSrc[3],
                    'class': 'extra',
                    sizeH: {
                        h: 4.563,
                        w: 2.125,
                        'correctPos' : -2.500,
                    },
                    sizeV: {
                        h: 5.938,
                        w: 2.688,
                        'correctPos' : -3.188,
                    }
                }
                return obj;
            }
        }

        let combinedArray = [];
        for(let key in data.data) {
            combinedArray.push([key, data.data[key], column12Hours[key]]);
        }

        function generateHeatMap() {
            let h = 0;
            return combinedArray.map((arrayElement, index) => {
                return `<div class="activity-${arrayElement[0]} activity-dayOfWeek">

                            <div class="activity-12hoursA">
                                ${arrayElement[1].map((value, i) => {
                                    if (i % 2 == 0) {
                                    h = h - 7;
                                    return `<div class="activity-item">
                                              <div class="activity-img activity-${settings(value).class}"
                                                   style="top: ${settings(value).sizeV.correctPos}rem;
                                                   width: ${settings(value).sizeV.w}rem;
                                                   height: ${settings(value).sizeV.h}rem;
                                                   z-index: ${i}; background: ${settings(value).src} no-repeat;
                                                   background-size: cover;"></div></div>`
                                    }}).join("")}</div>
                            <div class="activity-12hoursB">
                                ${arrayElement[1].map((value, i) => {
                                    if (i % 2 != 0) {
                                    h = h - 7;
                                    return `<div class="activity-item">
                                              <div class="activity-img activity-${settings(value).class}"
                                                   style="top: ${settings(value).sizeV.correctPos}rem;
                                                   width: ${settings(value).sizeV.w}rem; 
                                                   height: ${settings(value).sizeV.h}rem; 
                                                   z-index: ${i}; background: ${settings(value).src} no-repeat; 
                                                   background-size: cover;"></div></div>`
                                    }}).join("")}</div>
                            <div class="activity-24hours flex j-c-center">
                                ${arrayElement[2].map((value, i) => {
                                    return `<div class="activity-item">
                                                <div class="activity-img activity-${settings(value).class}"
                                                    style="top: ${settings(value).sizeH.correctPos}rem;
                                                    background: ${settings(value).src} no-repeat; 
                                                    width: ${settings(value).sizeH.w}rem; height: ${settings(value).sizeH.h}rem;
                                                    z-index: ${index}; background-size: contain; "></div></div>`}).join("")}
                                                </div>
                                              </div>`}).join("");
        }

        result =
            `<div class="activity flex flex-d-column a-i-center j-c-space-between">
                <div class="activity-titlesWrapper text-a-center">
                    <div class="activity-title">${data.title}</div>
                    <div class="activity-subtitle">${data.subtitle}</div>
                </div>
                <div class="activity-heatMap">
             ${generateHeatMap()}
                </div>
                <div class="activity-legend flex j-c-space-between text-a-center">
                    <div class="activity-time">
                    <div class="activity-timeBar"></div>
                    <span class="activity-2HoursScale">2 часа</span>
                    <span class="activity-1HoursScale">1 час</span>
                    </div>
                    <div class="activity-zeroHours">
                        <div class="activity-minBar"></div>
                        <span class="activity-1HoursScale">${intervalsObject.vertical.min}</span>
                        <span class="activity-2HoursScale">${intervalsObject.horizontal.min}</span>
                    </div>
                    <div class="activity-firstInterval">
                        <div class="activity-midBar"></div>
                        <span class="activity-1HoursScale">${intervalsObject.vertical.mid[0]} — ${intervalsObject.vertical.mid[1]}</span>
                        <span class="activity-2HoursScale">${intervalsObject.horizontal.mid[0]} — ${intervalsObject.horizontal.mid[1]}</span>
                    </div>
                    <div class="activity-secondInterval">
                        <div class="activity-maxBar"></div>
                        <span class="activity-1HoursScale">${intervalsObject.vertical.max[0]} — ${intervalsObject.vertical.max[1]}</span>
                        <span class="activity-2HoursScale">${intervalsObject.horizontal.max[0]} — ${intervalsObject.horizontal.max[1]}</span>
                    </div>
                    <div class="activity-thirdInterval">
                        <div class="activity-extraBar"></div>
                        <span class="activity-1HoursScale">${intervalsObject.vertical.extra[0]} — ${intervalsObject.vertical.extra[1]}</span>
                        <span class="activity-2HoursScale">${intervalsObject.horizontal.extra[0]} — ${intervalsObject.horizontal.extra[1]}</span>
                    </div>
                </div>
            </div>`
    }

    if(alias == "diagram") {
        const pi = 3.1415926;
        const radiusSvgDiagram = 102.1;
        const circleLength = Math.round(((2 * pi * radiusSvgDiagram)));
        const oneDegree = circleLength / 360;
        const correctedCircleLength = circleLength - (4 * oneDegree) * 2;
        const totalCount = Number(data.totalText.replace(/\D+/g,""));
        let dataCategCombined = [];

        for (let i = 0; i < data.categories.length; i++) {
            dataCategCombined.push({...data.categories[i], valueTextN: data.categories[i].valueText.replace(/\D+/g,""),
                differenceTextN: data.categories[i].differenceText.replace(/\D+/g,"")});
        }

        let initialOffs = circleLength / 4;
        let percentPart1;
        let starts;
        for (let i = 0; i < dataCategCombined.length; i++) {
            starts = 0;
            percentPart1 = Number(dataCategCombined[i].valueText.replace(/\D+/g,""));
            dataCategCombined[i].percentPart = Number(((percentPart1 / totalCount)*100));
            dataCategCombined[i].sectionLength = Number(((correctedCircleLength * dataCategCombined[i].percentPart) / 100));
            if(i == 0) {
                dataCategCombined[i].initialOffsetEl = initialOffs;
                starts = initialOffs + dataCategCombined[i].sectionLength;
            };
            if(i !== 0) {

                starts = dataCategCombined[i - 1].initialOffsetEl + dataCategCombined[i].sectionLength + 2 * oneDegree;
                dataCategCombined[i].initialOffsetEl = starts;
                starts = 0;
            };
            dataCategCombined[i].dashArrayValues = {
                "first": dataCategCombined[i].sectionLength,
                "second": circleLength - dataCategCombined[i].sectionLength,
            };

        }

        let svgDiagram =
            `<svg class="diagram-svg" viewBox="0 0 262 262" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="var(--filter1)">
            <circle cx="132" cy="132" r="102.1" fill="transparent" stroke="var(--paint2)" stroke-width="35.9" opacity="var(--opacity_1)"
                    stroke-dasharray="${dataCategCombined[3].dashArrayValues.first} ${dataCategCombined[3].dashArrayValues.second}" 
                    stroke-dashoffset="${dataCategCombined[3].initialOffsetEl}"></circle>
        </g>
        <g filter="var(--filter2)">
            <circle cx="132" cy="132" r="102.1" fill="transparent" stroke="var(--paint2)" stroke-width="35.9" opacity="var(--opacity_2)"
                    stroke-dasharray="${dataCategCombined[2].dashArrayValues.first} ${dataCategCombined[2].dashArrayValues.second}" 
                    stroke-dashoffset="${dataCategCombined[2].initialOffsetEl}"></circle>
        </g>
        <g filter="var(--filter3)">
            <circle cx="132" cy="132" r="102.1" fill="transparent" stroke="var(--paint3)" stroke-width="35.9" opacity="var(--opacity_3)"
                    stroke-dasharray="${dataCategCombined[0].dashArrayValues.first} ${dataCategCombined[0].dashArrayValues.second}" 
                    stroke-dashoffset="${dataCategCombined[0].initialOffsetEl}"></circle>
        </g>
        <g filter=var(--filter0)>
            <circle cx="132" cy="132" r="102.1" fill="transparent" stroke="var(--paint0)" stroke-width="35.9" opacity="var(--opacity_0)"
                    stroke-dasharray="${dataCategCombined[1].dashArrayValues.first} ${dataCategCombined[1].dashArrayValues.second}" 
                    stroke-dashoffset="${dataCategCombined[1].initialOffsetEl}"></circle>
        </g>
        <defs>
            <filter id="filter0_dii_dark" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
                <feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect1_dropShadow"></feMorphology>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feColorMatrix type="matrix" values="0 0 0 0 0.575 0 0 0 0 0.365803 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0.791667 0 0 0 0 0.504028 0 0 0 0 0 0 0 0 0.9 0"></feColorMatrix>
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dx="-1" dy="1"></feOffset>
                <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                <feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"></feBlend>
            </filter>
            <filter id="filter1_dii_dark" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
                <feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect1_dropShadow"></feMorphology>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feColorMatrix type="matrix" values="0 0 0 0 0.375 0 0 0 0 0.375 0 0 0 0 0.375 0 0 0 0.2 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0.15 0 0 0 0 0.15 0 0 0 0 0.15 0 0 0 0.9 0"></feColorMatrix>
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dx="-1" dy="1"></feOffset>
                <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                <feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"></feBlend>
            </filter>
            <filter id="filter2_dii_dark" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
                <feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect1_dropShadow"></feMorphology>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0.545833 0 0 0 0 0.545833 0 0 0 0 0.545833 0 0 0 0.9 0"></feColorMatrix>
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dx="-1" dy="1"></feOffset>
                <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                <feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"></feBlend>
            </filter>
            <filter id="filter3_dii_dark" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
                <feMorphology radius="8" operator="erode" in="SourceAlpha" result="effect1_dropShadow"></feMorphology>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feColorMatrix type="matrix" values="0 0 0 0 0.972549 0 0 0 0 0.618715 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.636666 0 0 0 0 0 0 0 0 0.9 0"></feColorMatrix>
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dx="-1" dy="1"></feOffset>
                <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></feColorMatrix>
                <feBlend mode="normal" in2="effect2_innerShadow" result="effect3_innerShadow"></feBlend>
            </filter>
        
            <filter id="filter0_ii_light"  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="10"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.4 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-1" dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
            </filter>
            <filter id="filter1_ii_light"  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="10"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.5125 0 0 0 0 0.5125 0 0 0 0 0.5125 0 0 0 0.6 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-1" dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
            </filter>
            <filter id="filter2_ii_light" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="10"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.4125 0 0 0 0 0.4125 0 0 0 0 0.4125 0 0 0 0.2 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-1" dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
            </filter>
            <filter id="filter3_ii_light" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="10"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.9 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-1" dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"/>
            </filter>
            <radialGradient id="paint0_radial_light" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(163.486 164.514) rotate(90) scale(163.486)">
            <stop offset="0.8125" stop-color="#FFB800" stop-opacity="0.4"/>
            <stop offset="1" stop-color="#FFEF99" stop-opacity="0.2"/>
            </radialGradient>
            <radialGradient id="paint1_radial_light" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(163.486 164.514) rotate(90) scale(163.486)">
            <stop offset="0.828125" stop-color="#BFBFBF" stop-opacity="0.69"/>
            <stop offset="0.921875" stop-color="#E4E4E4" stop-opacity="0.2"/>
            </radialGradient>
            <radialGradient id="paint2_radial_light" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(163.486 164.514) rotate(90) scale(163.486)">
            <stop offset="0.828125" stop-color="#A6A6A6" stop-opacity="0.69"/>
            <stop offset="0.921875" stop-color="#CBCBCB" stop-opacity="0.2"/>
            </radialGradient>
            <radialGradient id="paint3_radial_light" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(163.486 164.514) rotate(90) scale(163.486)">
            <stop offset="0.8125" stop-color="#FFB800" stop-opacity="0.7"/>
            <stop offset="1" stop-color="#FFEF99" stop-opacity="0.4"/>
            </radialGradient>
            <radialGradient id="paint0_radial_dark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(131.624 132.376) rotate(90) scale(119.624)">
                <stop offset="0.729167" stop-color="#633F00"></stop>
                <stop offset="1" stop-color="#0F0900"></stop>
            </radialGradient>
            <radialGradient id="paint1_radial_dark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(131.624 132.376) rotate(90) scale(119.624)">
                <stop offset="0.71875" stop-color="#4D4D4D"></stop>
                <stop offset="1" stop-color="#382900"></stop>
            </radialGradient>
            <radialGradient id="paint2_radial_dark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(131.624 132.376) rotate(90) scale(119.624)">
                <stop offset="0.71875" stop-color="#9B9B9B"></stop>
                <stop offset="1" stop-color="#382900"></stop>
            </radialGradient>
            <radialGradient id="paint3_radial_dark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(131.624 132.376) rotate(90) scale(119.624)">
                <stop offset="0.71875" stop-color="#FFA300"></stop>
                <stop offset="1" stop-color="#5B3A00"></stop>
            </radialGradient>
        </defs>
    </svg>`

        result =
            `<div class="diagram flex flex-d-column a-i-center">
                <div class="diagram-titlesWrapper text-a-center">
                    <div class="diagram-title">${data.title}</div>
                    <div class="diagram-subtitle">${data.subtitle}</div>
                </div>
               <div class="diagram-content flex a-i-center j-c-space-between">
                   <div class="diagram-circle flex">${svgDiagram}
                      <div class="diagram-textHolder text-a-center">
                           <div class="diagram-totalCommits">${data.totalText}</div>
                           <div class="diagram-fromLast">${data.differenceText}</div>
                      </div>
                   </div>
                   <div class="diagram-legend flex flex-d-column">
                       ${dataCategCombined.map(item => {
                            return `<div class="diagram-itemsWrapper flex j-c-space-between">
                                        <div class="diagram-left flex">
                                            <div class="diagram-dot"></div>
                                            <div class="diagram-stringsCount">${item.title}</div>
                                        </div>
                                        <div class="diagram-right flex">
                                            <div class="diagram-delta">+${item.differenceTextN}</div>
                                            <div class="diagram-totalCount">${item.valueTextN}</div>
                                        </div>
                                    </div>`}).join("")}             
                  </div>
               </div>
            </div>`
    }

    return result;
}
