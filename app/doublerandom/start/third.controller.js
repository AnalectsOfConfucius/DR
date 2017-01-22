$(function () {
    $("#ionrange").ionRangeSlider({
        min: 0,
        max: 100,
        type: 'single',
        step: 1,
        postfix: "%",
        prettify: false,
        hasGrid: true
    });
    $.ajax({
        url: window.apiPoint + 'lawenforce-departments',
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result["lawenforceDepartments"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each lawenforceDepartments as it,index}',
                    '<option value="${it.id}">${it.departmentName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#lawenforceDepartments').html(html);
            }
        },
    });
    $('.search-action').click(function () {
        initQuery(0, 10);
    });
});

function initQuery(page, size) {
    // var doubleRandomManagerName = $('#third').find('input[name=doubleRandomManagerName]').val();
    // var doubleRandomManagerNumber = $('#third').find('select[name=doubleRandomManagerNumber]').val();
    var doubleRandomManagerDepartment = $('#third').find('select[name=doubleRandomManagerDepartment]').val();
    var doubleRandomManagerRatio = $('#third').find('input[name=doubleRandomManagerRatio]').val();
    var dataQuery = {
        page: page,
        size: size,
        lawenforceDepartmentId: doubleRandomManagerDepartment,
    };
    $.ajax({
        url: window.apiPoint + 'managers/search',
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data && data.length > 0) {
                $('.third-action').show();
                var result = {};
                result['managers'] = data;
                var totalCount = xhr.getResponseHeader("X-Total-Count");
                var nowpage = parseInt(totalCount / dataQuery.size);
                var tpl = [
                    '{@each managers as it,index}',
                    '<tr>',
                    '<td>${it.managerCardId}</td>',
                    '<td>${it.managerCardType}</td>',
                    '<td>${it.managerName}</td>',
                    '<td>${it.managerSex}</td>',
                    '<td>{@if it.managerLawenforceDepartment != null }${it.managerLawenforceDepartment.departmentName}{@/if}</td>',
                    '<td>{@if it.managerLawenforceAreas != null }${it.managerLawenforceAreas.areaName}{@/if}</td>',
                    '<td>{@if it.managerFlag != null }${it.managerFlag}{@/if}</td>',
                    '<td>{@if it.checkCount != null }${it.checkCount}{@/if}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
                $("#Pagination").pagination(nowpage, {
                    'current_page': dataQuery.page,
                    'callback': pageQuery,
                });
            } else {
                $('.third-action').hide();
                var html = '';
                $('#tContent').html(html);
                $("#Pagination").pagination(0);
            }
        },
    });
};

function pageQuery(page_index) {
    initQuery(page_index, 10);
};