$(function () {
    initPage(0, 10);
    $('.input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
    });
    $('.search-action').click(function () {
        initQuery(0, 10);
    });
    $('.add-modal').bind('click', function() {
        initAddOne();
    });
    $('.add-action').bind('click', function () {
        addOne();
    });
    $('.update-action').bind('click', function () {
        updateOne();
    });
});

function initQuery(page, size) {
    var query = $('#query').val();
    if (query == "" || query == null) {
        return;
    }
    console.log(query);
    var dataQuery = {
        page: page,
        size: size,
        query: query,
    };
    $.ajax({
        url: window.apiPoint + '_search/companies',
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data.companies);
                var tpl = [
                    '{@each companies as it,index}',
                    '<tr>',
                    '<td>${it.companyRegisterId}</td>',
                    '<td>${it.companyName}</td>',
                    '<td>${it.businessAddress}</td>',
                    '<td>${it.companyOwner}</td>',
                    '<td>${it.companyPhone}</td>',
                    '<td>${it.companySupervisory.departmentName}</td>',
                    '<td>${it.companyStatus}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" data-toggle="modal" data-target="#myModal1">查看</a>',
                    '<a href="javascript:;" data-toggle="modal" data-target="#myModal2">修改</a>',
                    '<a href="javascript:;" onclick="deleteOne(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, data);
                $('#tContent').html(html);
                $("#Pagination").pagination(data.totalPages, {
                    'current_page': dataQuery.page,
                    'callback': pageQuery,
                });
            }
        },
    });
};

function initPage(page, size) {
    var dataQuery = {
        page: page,
        size: size,
        sort: 'id,desc'
    };
    $.ajax({
        url: window.apiPoint + 'companies',
        type: 'GET',
        // GET请求传递data
        data: dataQuery,
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data) {
                console.log(data);
                var result = {};
                result['companies'] = data;
                var totalCount = xhr.getResponseHeader("X-Total-Count");
                var nowpage = parseInt(totalCount / dataQuery.size);
                console.log(nowpage);
                var tpl = [
                    '{@each companies as it,index}',
                    '<tr>',
                    '<td>${it.companyRegisterId}</td>',
                    '<td>${it.companyName}</td>',
                    '<td>${it.businessAddress}</td>',
                    '<td>${it.companyOwner}</td>',
                    '<td>${it.companyPhone}</td>',
                    '<td>{@if it.companySupervisory != null }${it.companySupervisory.departmentName}{@/if}</td>',
                    '<td>{@if it.companyStatus == null }{@else if it.companyStatus == 1}异常{@else}正常{@/if}</td>',
                    '<td>{@if it.description != null }${it.description}{@/if}</td>',
                    '<td>',
                    '<a href="javascript:;" onclick="detailOne(${it.id})" data-toggle="modal" data-target="#myModal1">查看</a>',
                    '<a href="javascript:;" onclick="initUpdateOne(${it.id})" data-toggle="modal" data-target="#myModal2">修改</a>',
                    '<a href="javascript:;" onclick="deleteOne(${it.id})">删除</a>',
                    '</td>',
                    '</tr>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('#tContent').html(html);
                $("#Pagination").pagination(nowpage, {
                    'current_page': dataQuery.page,
                    'callback': pageSelect,
                });
            }
        },
    });
};

function initAddOne() {
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
                $('.lawenforceDepartments').html(html);
            }
        },
    });
    $.ajax({
        url: window.apiPoint + 'industry-types',
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result["industryTypes"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each industryTypes as it,index}',
                    '<option value="${it.id}">${it.typeName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('.industryTypes').html(html);
            }
        },
    });
    $.ajax({
        url: window.apiPoint + 'company-types',
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result["companyTypes"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each companyTypes as it,index}',
                    '<option value="${it.id}">${it.typeName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('.companyTypes').html(html);
            }
        },
    });
}

function initUpdateOne(id) {
    $.ajax({
        url: window.apiPoint + 'lawenforce-departments',
        type: 'GET',
        async: false,
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
                $('.lawenforceDepartments').html(html);
            }
        },
    });
    $.ajax({
        url: window.apiPoint + 'industry-types',
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result["industryTypes"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each industryTypes as it,index}',
                    '<option value="${it.id}">${it.typeName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('.industryTypes').html(html);
            }
        },
    });
    $.ajax({
        url: window.apiPoint + 'company-types',
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data) {
            if (data) {
                console.log(data);
                var result = {};
                result["companyTypes"] = data;
                var tpl = [
                    '<option value=""></option>',
                    '{@each companyTypes as it,index}',
                    '<option value="${it.id}">${it.typeName}</option>',
                    '{@/each}'].join('');
                var html = juicer(tpl, result);
                $('.companyTypes').html(html);
            }
        },
    });
    $.ajax({
        url: window.apiPoint + 'companies/' + id,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            console.log(data);
            if (data) {
                $("#update").find("input[name=id]").val(data.id);
                $("#update").find("input[name=companyName]").val(data.companyName);
                $("#update").find("input[name=companyRegisterId]").val(data.companyRegisterId);
                $("#update").find("input[name=companyCapital]").val(data.companyCapital);
                $("#update").find("input[name=companyAddress]").val(data.companyAddress);
                $("#update").find("input[name=businessAddress]").val(data.businessAddress);
                $("#update").find("textarea[name=businessScope]").val(data.businessScope);
                $("#update").find("input[name=companyOwner]").val(data.companyOwner);
                $("#update").find("input[name=companyDate]").val(data.companyDate);
                $("#update").find("input[name=companyPhone]").val(data.companyPhone);
                $("#update").find("select[name=companyStatus]").val(data.companyStatus);
                $("#update").find("textarea[name=description]").val(data.description);
                $("#update").find("select[name=lawenforceDepartment]").val(data.companySupervisory.id);
                $("#update").find("select[name=industryType]").val(data.industryType.id);
                $("#update").find("select[name=companyType]").val(data.companyType.id);
            }
        },
    });
};

function pageSelect(page_index) {
    initPage(page_index, 10);
};

function pageQuery(page_index) {
    initQuery(page_index, 10);
};

function addOne() {
    var companyName = $("#add").find("input[name=companyName]").val();
    var companyRegisterId = $("#add").find("input[name=companyRegisterId]").val();
    var companyCapital = $("#add").find("input[name=companyCapital]").val();
    var companyAddress = $("#add").find("input[name=companyAddress]").val();
    var businessAddress = $("#add").find("input[name=businessAddress]").val();
    var businessScope = $("#add").find("textarea[name=businessScope]").val();
    var companyOwner = $("#add").find("input[name=companyOwner]").val();
    var companyDate = $("#add").find("input[name=companyDate]").val();
    var companyPhone = $("#add").find("input[name=companyPhone]").val();
    var companyStatus = $("#add").find("select[name=companyStatus]").val();
    var description = $("#add").find("textarea[name=description]").val();
    var companySupervisoryId = $("#add").find("select[name=lawenforceDepartment]").val();
    var industryTypeId = $("#add").find("select[name=industryType]").val();
    var companyTypeId = $("#add").find("select[name=companyType]").val();
    var companySupervisory = {id: companySupervisoryId};
    var industryType = {id: industryTypeId};
    var companyType = {id: companyTypeId};
    var dataPost = {
        companyName: companyName,
        companyRegisterId: companyRegisterId,
        companyCapital: companyCapital,
        companyAddress: companyAddress,
        businessAddress: businessAddress,
        businessScope: businessScope,
        companyOwner: companyOwner,
        companyDate: companyDate,
        companyPhone: companyPhone,
        companyStatus: companyStatus,
        description: description,
        companySupervisory: companySupervisory,
        industryType: industryType,
        companyType: companyType
    };
    console.log(dataPost);
    $.ajax({
        url: window.apiPoint + 'companies',
        type: 'POST',
        // 序列化Json对象为Json字符串
        data: JSON.stringify(dataPost),
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                initPage(0, 10);
                $('#myModal0').modal('hide');
                $('input[name=reset]').trigger("click");
            }
        },
    });
};

function deleteOne(id) {
    swal({
            title: "您确定要删除这条信息吗",
            text: "删除后将无法恢复，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，我要删除！",
            cancelButtonText: "让我再考虑一下…",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: window.apiPoint + 'companies/' + id,
                    type: 'DELETE',
                    async: true,
                    dataType: 'json',
                    complete: function (data) {
                        console.log(data);
                        if (data.status == 200 && data.statusText == "OK") {
                            swal("删除成功！", "您已经永久删除了这条信息。", "success");
                            initPage(0, 10);
                        }
                    },
                });
            } else {
                swal("已取消", "您取消了删除操作！", "error");
            }
        });
};

function detailOne(id) {
    $.ajax({
        url: window.apiPoint + 'companies/' + id,
        type: 'GET',
        async: true,
        dataType: 'json',
        success: function (data, status, xhr) {
            console.log(data);
            if (data) {
                $("#detail").find("input[name=companyName]").val(data.companyName);
                $("#detail").find("input[name=companyRegisterId]").val(data.companyRegisterId);
                $("#detail").find("input[name=companyCapital]").val(data.companyCapital);
                $("#detail").find("input[name=companyAddress]").val(data.companyAddress);
                $("#detail").find("input[name=businessAddress]").val(data.businessAddress);
                $("#detail").find("textarea[name=businessScope]").val(data.businessScope);
                $("#detail").find("input[name=companyOwner]").val(data.companyOwner);
                $("#detail").find("input[name=companyDate]").val(data.companyDate);
                $("#detail").find("input[name=companyPhone]").val(data.companyPhone);
                $("#detail").find("select[name=companyStatus]").val(data.companyStatus);
                $("#detail").find("textarea[name=description]").val(data.description);
                $("#detail").find("input[name=lawenforceDepartment]").val(data.companySupervisory.departmentName);
                $("#detail").find("input[name=industryType]").val(data.industryType.typeName);
                $("#detail").find("input[name=companyType]").val(data.companyType.typeName);
            }
        },
    });
};

function updateOne() {
    var id = $("#update").find("input[name=id]").val();
    var companyName = $("#update").find("input[name=companyName]").val();
    var companyRegisterId = $("#update").find("input[name=companyRegisterId]").val();
    var companyCapital = $("#update").find("input[name=companyCapital]").val();
    var companyAddress = $("#update").find("input[name=companyAddress]").val();
    var businessAddress = $("#update").find("input[name=businessAddress]").val();
    var businessScope = $("#update").find("textarea[name=businessScope]").val();
    var companyOwner = $("#update").find("input[name=companyOwner]").val();
    var companyDate = $("#update").find("input[name=companyDate]").val();
    var companyPhone = $("#update").find("input[name=companyPhone]").val();
    var companyStatus = $("#update").find("select[name=companyStatus]").val();
    var description = $("#update").find("textarea[name=description]").val();
    var companySupervisoryId = $("#update").find("select[name=lawenforceDepartment]").val();
    var industryTypeId = $("#update").find("select[name=industryType]").val();
    var companyTypeId = $("#update").find("select[name=companyType]").val();
    var companySupervisory = {id: companySupervisoryId};
    var industryType = {id: industryTypeId};
    var companyType = {id: companyTypeId};
    var dataPost = {
        id: id,
        companyName: companyName,
        companyRegisterId: companyRegisterId,
        companyCapital: companyCapital,
        companyAddress: companyAddress,
        businessAddress: businessAddress,
        businessScope: businessScope,
        companyOwner: companyOwner,
        companyDate: companyDate,
        companyPhone: companyPhone,
        companyStatus: companyStatus,
        description: description,
        companySupervisory: companySupervisory,
        industryType: industryType,
        companyType: companyType
    };
    console.log(dataPost);
    $.ajax({
        url: window.apiPoint + 'companies',
        type: 'PUT',
        // 序列化Json对象为Json字符串
        data: JSON.stringify(dataPost),
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data) {
                initPage(0, 10);
                $('#myModal2').modal('hide');
                $('input[name=reset]').trigger("click");
            }
        },
    });
}