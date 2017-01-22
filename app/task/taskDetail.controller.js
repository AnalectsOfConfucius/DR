$(function () {
    var resultId = getUrlValue("id");
    initPage(resultId);
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    $('.deal').bind('change', function () {
        var deal = $('.deal').val();
        if (deal == 1) {
            $('#myModal1').modal({backdrop: 'static', keyboard: false, show: 'toggle'});
        } else if (deal == 2) {
            $('#myModal2').modal({backdrop: 'static', keyboard: false, show: 'toggle'});
        } else if (deal == 3) {
            $('#myModal3').modal({backdrop: 'static', keyboard: false, show: 'toggle'});
        }
    });
    $('.check').bind('click', function () {
        // var result = $('#deal').find('select[name=result]').val();
        // var resultDeal = $('#deal').find('select[name=resultDeal]').val();
        // var description = $('#deal').find('select[name=description]').val();
        var id = $('#deal').find('input[name=id]').val();
        // var companyName = $('#deal').find('input[name=companyName]').val();
        // var people = $('#deal').find('input[name=people]').val();
        // var companyRegisterId = $('#deal').find('input[name=companyRegisterId]').val();
        // var department = $('#deal').find('input[name=department]').val();
        // var doubleRandomResult = {
        //     id: id,
        //     companyName: companyName,
        //     people: people,
        //     companyRegisterId: companyRegisterId,
        //     department: department,
        //     description: description,
        //     resultDeal: resultDeal,
        //     checkDate: '2017-01-18'
        // };
        var doubleRandomResult;
        $.ajax({
            url: window.apiPoint + 'double-random-results/' + id,
            type: 'GET',
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    doubleRandomResult = data;
                }
            },
        });
        doubleRandomResult['result'] = $('#deal').find('select[name=result]').val();
        doubleRandomResult['resultDeal'] = $('#deal').find('select[name=resultDeal]').val();
        doubleRandomResult['resultDeadline'] = $('#zlzgDate').val();
        doubleRandomResult['checkDate'] = '2017-01-18';
        doubleRandomResult['description'] = $('#deal').find('textarea[name=description]').val();
        $.ajax({
            url: window.apiPoint + 'double-random-results',
            type: 'PUT',
            // 序列化Json对象为Json字符串
            data: JSON.stringify(doubleRandomResult),
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    location.href = "/app/task/taskBoxList.html"
                }
            },
        });
    });
});

function initPage(id) {
    $.ajax({
        url: window.apiPoint + 'double-random-results/' + id,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            var result =  {};
            result["doubleRandomResult"] = data;
            var tpl = [
                '<p><span class="font-noraml">企业名称： </span>${doubleRandomResult.companyName}</p>',
                '<p><span class="font-noraml">执法人员： </span>${doubleRandomResult.people}</p>',
                '<p><span class="font-noraml">检查事项： </span>${doubleRandomResult.doubleRandom.doubleRandomTaskContent}</p>',
                '<p><span class="font-noraml">检查时间： </span>${doubleRandomResult.doubleRandom.doubleRandomDate}'
            ].join('');
            var html = juicer(tpl, result);
            $('#deal').find('input[name=id]').val(data.id);
            $('#deal').find('input[name=companyName]').val(data.companyName);
            $('#deal').find('input[name=people]').val(data.people);
            $('#deal').find('input[name=companyRegisterId]').val(data.companyRegisterId);
            $('#deal').find('input[name=department]').val(data.department);
            $('#tContent').html(html);
            console.log(data);
        }
    });
};