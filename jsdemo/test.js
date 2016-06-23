//这里我通过和优秀的是算作85，因为我确实85分。后面可能改成手工录入
//cancleProNum 表示删除的低分专业选修课数量，cancleQuaNum 表示删除的低分素质选修课数量
function getWeightedAverage(cancleProNum, cancleQuaNum) {
    var creditSum, weightingSum, deleteNum;
    var classNum = $('#grid21344342991_data tr').length;
    var creditArray = $('#grid21344342991_data tr').map((index, item) => +$($(item).find('td')[5]).html());
    var gradeArray = $('#grid21344342991_data tr').map((index, item) => +$($(item).find('td')[8]).html());
    var classTypeArray = $('#grid21344342991_data tr').map((index, item) => $($(item).find('td')[4]).html());
    creditArray = $.makeArray(creditArray);
    gradeArray = $.makeArray(gradeArray);
    classTypeArray = $.makeArray(classTypeArray);

    cancelNum('pro', cancleProNum);
    cancelNum('qua', cancleQuaNum);

    return getWeightingSum() / getCreditSum();

    function cancelNum(type, num) {
            for (var i = 0; i < num; i++) {
                deleteNum = getMinIndexInGradeArr(type);
                gradeArray = gradeArray.slice(0, deleteNum).concat(gradeArray.slice(deleteNum + 1));
                creditArray = creditArray.slice(0, deleteNum).concat(creditArray.slice(deleteNum + 1));
                classTypeArray = classTypeArray.slice(0, deleteNum).concat(classTypeArray.slice(deleteNum + 1));
            }
        }
        //素质选修type为qua,专业选修type为pro

    function getMinIndexInGradeArr(type) {
        var nowAve = getWeightingSum() / getCreditSum();
        var typeArray = {
            'pro': ['本专业选修课', '专业选修课'],
            'qua': ['素质教育选修课程', '素质教育选修课', '素质教育选修课（跨专业课外选修实验类）', '数理基础拓展']
        }
        var minIndex, maxAve = nowAve,
            getAve;
        gradeArray.forEach(function(item, index) {
            if (getFinalGrade(index) && item < nowAve && $.inArray(classTypeArray[index], typeArray[type]) != -1) {
                getAve = (getWeightingSum() - item * creditArray[index]) / (getCreditSum() - creditArray[index]);
                if (getAve > maxAve) {
                    maxAve = getAve;
                    minIndex = index;
                }
            }
        });
        return minIndex;
    }

    function getFinalGrade(index) {
        if (gradeArray[index] == '通过' || gradeArray[index] == '优秀') {
            return 85;
        } else if (gradeArray[index] < 60 && (classTypeArray[index] == '素质教育选修课程' || classTypeArray[index] == '素质教育选修课' || classTypeArray[index] == '数理基础拓展')) {
            return '';
        } else {
            return gradeArray[index];
        }
    }


    function getCreditSum() {
        creditSum = creditArray.reduce(function(previous, current, index) {
            if (getFinalGrade(index)) {
                previous += current;
            }
            return previous;
        });
        return creditSum;
    }

    function getWeightingSum() {
        weightingSum = gradeArray.reduce(function(previous, current, index) {
            if (getFinalGrade(index)) {
                previous += getFinalGrade(index) * creditArray[index];
            }
            return previous;
        }, 0);
        return weightingSum;
    }
};
$(document).click(function(e) {
    if (e.target.title == '所有学期成绩') {
        var sh;
        sh = setInterval(function() {
            if ($('#grid21344342991').text() != '') {
                $('.grid').before('<div class="check-average"><a>查看均分</a></div>');
                $('.check-average').click(function() {
                    var cancleProNum = prompt("请输入删除专业选修数量", "0");
                    var cancleQuaNum = prompt("请输入删除素质选修数量", "0");
                    alert('加权平均分为' + getWeightedAverage(cancleProNum, cancleQuaNum));
                });
                clearInterval(sh);
            }
        }, 50)
    };
});
