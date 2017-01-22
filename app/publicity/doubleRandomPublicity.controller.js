$(function () {
    //退出全屏
    var url = window.apiPoint + 'double-random-results';
    console.log(url);
    var dataQuery = {
        page: 0,
        size: 100,
        sort: 'id,desc'
    };
    $.ajax({
        url: url,
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                var result = {};
                result['doubleRandomResults'] = data;
                console.log(data);
                var tpl = [
                    '{@each doubleRandomResults as it,index}',
                    '<tr>',
                    '<td>${it.id}</td>',
                    '<td>${it.companyName}</td>',
                    '<td>${it.companyRegisterId}</td>',
                    '<td>{@if it.doubleRandom.doubleRandomTaskContent != null }${it.doubleRandom.doubleRandomTaskContent}{@/if}</td>',
                    '<td>${it.people}</td>',
                    '<td>${it.doubleRandom.doubleRandomDate}</td>',
                    '<td>{@if it.result != null }${it.result}{@else}正常{@/if}</td>',
                    '<td>{@if it.resultDeal != null }{@else if it.resultDeal == 2}责令查改{@else}{@/if}</td>',
                    '<td>{@if it.resultStatus != null }${it.resultStatus}{@else}正常{@/if}</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
            }
        },
    });
});
