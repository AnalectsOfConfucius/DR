$(function () {
    initPage(0, 10);
    $('.finish').bind('click', function () {
        // var result = $('#deal').find('select[name=result]').val();
        // var resultDeal = $('#deal').find('select[name=resultDeal]').val();
        // var description = $('#deal').find('select[name=description]').val();
        var id = $('#finish').find('input[name=id]').val();
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
        doubleRandomResult['resultStatus'] = $('#finish').find('select[name=resultStatus]').val();
        doubleRandomResult['finishDate'] = '2017-01-18';
        $.ajax({
            url: window.apiPoint + 'double-random-results',
            type: 'PUT',
            // 序列化Json对象为Json字符串
            data: JSON.stringify(doubleRandomResult),
            async: true,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    location.href = "/app/task/finishedList.html"
                }
            },
        });
    });
});

function initPage(page, size) {
    var url = window.apiPoint + 'double-random-results/login/unfinish';
    console.log(url);
    var dataQuery = {
        page: page,
        size: size,
        check: 'checked',
        resultDeal: '2'
    };
    $.ajax({
        url: url,
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result['doubleRandomResults'] = data;
                console.log(data);
                var tpl = [
                    '{@each doubleRandomResults as it,index}',
                    '<tr>',
                    '<td>${it.id}</td>',
                    '<td>${it.companyName}</td>',
                    '<td>${it.department}</td>',
                    '<td>${it.people}</td>',
                    '<td>${it.doubleRandom.doubleRandomTaskContent}</td>', ,
                    '<td>${it.doubleRandom.doubleRandomDate}</td>',
                    '<td>{@if it.result != null}${it.result}{@/if}</td>',
                    '<td>{@if it.resultStatus != null}{@else if it.result == 2}责令整改{@/if}</td>',
                    '<td><span class="label label-danger">{@if it.resultDeadline != null}${it.resultDeadline}{@/if}</span></td>',
                    '<td>',
                    '<a href="javascript:;" onclick="finish(${it.id})" data-toggle="modal" data-target="#myModal0">整改结果</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
            }
        },
    });
};

function finish(id) {
    $('#finish').find('input[name=id]').val(id);
}